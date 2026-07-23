// Supabase Edge Function: send-push
// -----------------------------------------------------------------------------
// Triggered by a Database Webhook on the `hr_requests` table (INSERT + UPDATE).
// It figures out WHO should be notified for the request's CURRENT stage and
// delivers a Web Push message only to those people (targeted, not broadcast).
//
// Who gets notified (mirrors who can actually ACT in the app):
//   بانتظار مدير الإدارة   -> dept manager(s) of that department
//                             (fallback: HR + owner — they can act when a
//                              department has no manager, so requests never
//                              go silent)
//   بانتظار HR / مرتجع لـ HR -> HR (fallback: owner)
//   بانتظار المالك          -> owner
//   بانتظار الاعتماد (سلفة/مكافأة/خصم) -> HR + owner
//   بانتظار الاعتماد (تأخير) -> dept manager(s) of that department + branch
//                              managers + HR + owner (single-stage approval:
//                              anyone of them can decide, so all are notified)
//   معتمد / مرفوض / بانتظار رد الموظف -> the request owner (employee)
//
// Required secrets:
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (auto-provided at runtime)
// -----------------------------------------------------------------------------

import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") || "mailto:admin@example.com";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const REQUEST_TYPES = ["إجازة", "تأخير", "سلفة", "مكافأة", "خصم"];
const FINANCIAL_TYPES = ["سلفة", "مكافأة", "خصم"];

const STATUS = {
  PENDING_GENERIC: "بانتظار الاعتماد",
  PENDING_DEPT: "بانتظار مدير الإدارة",
  PENDING_HR: "بانتظار HR",
  PENDING_OWNER: "بانتظار المالك",
  RETURNED_HR: "مرتجع لـ HR",
  AWAITING_EMPLOYEE: "بانتظار رد الموظف",
  APPROVED: "معتمد",
  REJECTED: "مرفوض",
};

type HrUser = { role?: string; phone?: string; managedDepartment?: string };

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function norm(value: unknown): string {
  return String(value ?? "").trim();
}

// Same matching rule the app uses (inManagedDepartment): a department manager
// matches if their managedDepartment equals the request's managerDepartment OR
// its department (trimmed), or if they manage "all".
function managesRequestDept(user: HrUser, reqManagerDept: string, reqDept: string): boolean {
  if (user.role !== "department_manager") return false;
  const md = norm(user.managedDepartment);
  if (!md) return false;
  if (md === "all") return true;
  return (reqManagerDept !== "" && md === reqManagerDept) || (reqDept !== "" && md === reqDept);
}

// Decide the list of users to notify for an approval stage.
function pickApprovers(users: HrUser[], status: string, reqType: string, reqManagerDept: string, reqDept: string): HrUser[] {
  const deptManagers = users.filter((u) => managesRequestDept(u, reqManagerDept, reqDept));
  const hr = users.filter((u) => u.role === "hr");
  const owners = users.filter((u) => u.role === "owner");
  const branchManagers = users.filter((u) => u.role === "branch_manager");

  switch (status) {
    case STATUS.PENDING_DEPT:
      // In-app, HR/owner may act at the dept stage when a department has no
      // manager — notify them instead so the request never goes silent.
      return deptManagers.length ? deptManagers : [...hr, ...owners];
    case STATUS.PENDING_HR:
    case STATUS.RETURNED_HR:
      return hr.length ? hr : owners;
    case STATUS.PENDING_OWNER:
      return owners;
    case STATUS.PENDING_GENERIC:
      if (FINANCIAL_TYPES.includes(reqType)) return [...hr, ...owners];
      // تأخير (and any other single-stage request): dept manager, branch
      // managers, HR and owner can all decide it in the app — notify them all.
      return [...deptManagers, ...branchManagers, ...hr, ...owners];
    default:
      return [];
  }
}

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    // Supabase DB webhook shape: { type, table, record, old_record, schema }
    const eventType: string = payload?.type;
    const record = payload?.record; // { id, data }
    const oldRecord = payload?.old_record;

    const data = record?.data;
    if (!data || !REQUEST_TYPES.includes(data.type)) {
      console.log("skip: not notifiable, type=", data?.type);
      return jsonResponse({ skipped: "not a notifiable request" });
    }

    const newStatus: string = data.status;
    const oldStatus: string | undefined = oldRecord?.data?.status;
    // On UPDATE react only when the status changed; on INSERT always react.
    const statusChanged = eventType === "INSERT" || oldStatus !== newStatus;
    if (!statusChanged) {
      console.log("skip: status unchanged, status=", newStatus);
      return jsonResponse({ skipped: "status unchanged" });
    }

    const reqType: string = data.type;
    const reqManagerDept = norm(data.managerDepartment);
    const reqDept = norm(data.department);

    let title = "";
    let body = "";
    let targetPhones: string[] = [];

    const isEmployeeUpdate =
      newStatus === STATUS.APPROVED ||
      newStatus === STATUS.REJECTED ||
      newStatus === STATUS.AWAITING_EMPLOYEE;

    if (isEmployeeUpdate) {
      // Notify the request owner only.
      if (newStatus === STATUS.APPROVED) {
        title = "تحديث على طلبك";
        body = `تم اعتماد طلب ${reqType}`;
      } else if (newStatus === STATUS.REJECTED) {
        title = "تحديث على طلبك";
        body = `تم رفض طلب ${reqType}`;
      } else {
        title = "طلبك بحاجة إلى ردّك";
        body = `طلب ${reqType} بحاجة إلى ردّك`;
      }
      if (data.employeePhone) targetPhones = [String(data.employeePhone)];
    } else {
      // An approval stage -> notify only the person(s) whose turn it is.
      const { data: userRows, error: usersErr } = await supabase
        .from("hr_users")
        .select("data");
      if (usersErr) throw usersErr;

      const users = (userRows || [])
        .map((r: { data: unknown }) => r.data as HrUser)
        .filter(Boolean);

      targetPhones = pickApprovers(users, newStatus, reqType, reqManagerDept, reqDept)
        .map((u) => String(u.phone || ""))
        .filter(Boolean);

      title = "طلب بحاجة اعتماد";
      body = `${data.employeeName || ""} - ${reqType}`.trim();
    }

    // Deduplicate phones.
    targetPhones = Array.from(new Set(targetPhones));

    if (!targetPhones.length) {
      console.log("skip: no target recipients, status=", newStatus, "type=", reqType, "dept=", reqManagerDept || reqDept);
      return jsonResponse({ skipped: "no target recipients" });
    }

    const { data: subs, error } = await supabase
      .from("hr_push_subscriptions")
      .select("endpoint, subscription")
      .in("phone", targetPhones);
    if (error) throw error;

    console.log(
      "send-push:", eventType, "status=", newStatus, "type=", reqType,
      "dept=", reqManagerDept || reqDept, "targets=", JSON.stringify(targetPhones),
      "subscriptions=", subs?.length || 0,
    );

    const message = JSON.stringify({ title, body, url: "/", tag: `req-${record.id}` });

    const results = await Promise.allSettled(
      (subs || []).map(async (s: { endpoint: string; subscription: unknown }) => {
        try {
          // Urgency high so Android delivers promptly even in battery saver.
          await webpush.sendNotification(s.subscription as webpush.PushSubscription, message, {
            urgency: "high",
          });
          console.log("push OK:", String(s.endpoint).slice(0, 45));
        } catch (err) {
          const statusCode = (err as { statusCode?: number })?.statusCode;
          const errBody = (err as { body?: string })?.body;
          console.log("push FAIL:", String(s.endpoint).slice(0, 45), "status=", statusCode, "body=", errBody, "msg=", String(err));
          // 404/410 = subscription is gone. 403 = subscription was created
          // with a DIFFERENT VAPID key (pre-rotation) and can never work with
          // ours. Either way the row is dead weight — remove it; the device
          // re-registers with the current key next time the app is opened.
          if (statusCode === 404 || statusCode === 410 || statusCode === 403) {
            await supabase.from("hr_push_subscriptions").delete().eq("endpoint", s.endpoint);
          }
          throw err;
        }
      })
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    console.log("send-push done: sent=", sent, "of", subs?.length || 0);
    return jsonResponse({ recipients: subs?.length || 0, sent });
  } catch (e) {
    console.log("send-push ERROR:", String(e));
    return jsonResponse({ error: String(e) }, 500);
  }
});
