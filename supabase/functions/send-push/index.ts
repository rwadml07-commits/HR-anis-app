// Supabase Edge Function: send-push
// -----------------------------------------------------------------------------
// Triggered by a Database Webhook on the `hr_requests` table (INSERT + UPDATE).
// It figures out WHO should be notified for the request's CURRENT stage and
// delivers a Web Push message only to those people (targeted, not broadcast).
//
// Approval flow (leave): dept manager -> HR -> owner -> (decision).
// Each stage notifies only the person whose turn it is:
//   بانتظار مدير الإدارة  -> the department manager of that department
//   بانتظار HR / مرتجع لـ HR -> HR
//   بانتظار المالك          -> owner
//   بانتظار الاعتماد (مالية) -> HR + owner
//   بانتظار الاعتماد (تأخير) -> the department manager of that department
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

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Decide whether a given system user should be notified for this request stage.
function isTargetApprover(
  user: { role?: string; managedDepartment?: string },
  status: string,
  reqType: string,
  reqDepartment: string,
): boolean {
  const role = user.role;
  const managesThisDept =
    role === "department_manager" &&
    (user.managedDepartment === reqDepartment || user.managedDepartment === "all");

  switch (status) {
    case STATUS.PENDING_DEPT:
      return managesThisDept;
    case STATUS.PENDING_HR:
    case STATUS.RETURNED_HR:
      return role === "hr";
    case STATUS.PENDING_OWNER:
      return role === "owner";
    case STATUS.PENDING_GENERIC:
      if (FINANCIAL_TYPES.includes(reqType)) return role === "hr" || role === "owner";
      // تأخير and any other non-financial generic-pending request.
      return managesThisDept;
    default:
      return false;
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
    const reqDepartment: string = data.managerDepartment || data.department || "";

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
      // Look them up in hr_users so we can match department managers by dept.
      const { data: userRows, error: usersErr } = await supabase
        .from("hr_users")
        .select("data");
      if (usersErr) throw usersErr;

      const users = (userRows || [])
        .map((r: { data: unknown }) => r.data as { role?: string; phone?: string; managedDepartment?: string })
        .filter(Boolean);

      targetPhones = users
        .filter((u) => isTargetApprover(u, newStatus, reqType, reqDepartment))
        .map((u) => String(u.phone || ""))
        .filter(Boolean);

      title = "طلب بحاجة اعتماد";
      body = `${data.employeeName || ""} - ${reqType}`.trim();
    }

    // Deduplicate phones.
    targetPhones = Array.from(new Set(targetPhones));

    if (!targetPhones.length) {
      console.log("skip: no target recipients, status=", newStatus, "type=", reqType, "dept=", reqDepartment);
      return jsonResponse({ skipped: "no target recipients" });
    }

    const { data: subs, error } = await supabase
      .from("hr_push_subscriptions")
      .select("endpoint, subscription")
      .in("phone", targetPhones);
    if (error) throw error;

    console.log(
      "send-push:", eventType, "status=", newStatus, "type=", reqType,
      "dept=", reqDepartment, "targets=", JSON.stringify(targetPhones),
      "subscriptions=", subs?.length || 0,
    );

    const message = JSON.stringify({ title, body, url: "/", tag: `req-${record.id}` });

    const results = await Promise.allSettled(
      (subs || []).map(async (s: { endpoint: string; subscription: unknown }) => {
        try {
          await webpush.sendNotification(s.subscription as webpush.PushSubscription, message);
          console.log("push OK:", String(s.endpoint).slice(0, 45));
        } catch (err) {
          const statusCode = (err as { statusCode?: number })?.statusCode;
          const errBody = (err as { body?: string })?.body;
          console.log("push FAIL:", String(s.endpoint).slice(0, 45), "status=", statusCode, "body=", errBody, "msg=", String(err));
          // 404/410 mean the subscription is gone — clean it up.
          if (statusCode === 404 || statusCode === 410) {
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
