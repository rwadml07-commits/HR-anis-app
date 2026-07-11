// Supabase Edge Function: send-push
// -----------------------------------------------------------------------------
// Triggered by a Database Webhook on the `hr_requests` table (INSERT + UPDATE).
// It figures out who should be notified and delivers a Web Push message to their
// registered browsers/devices (stored in `hr_push_subscriptions`).
//
//   INSERT (new request, status "بانتظار الاعتماد")  -> notify all approvers
//   UPDATE (status changed to "معتمد" / "مرفوض")     -> notify the request owner
//
// Required secrets (Dashboard → Edge Functions → send-push → Secrets, or
// `supabase secrets set ...`):
//   VAPID_PUBLIC_KEY
//   VAPID_PRIVATE_KEY
//   VAPID_SUBJECT              e.g. "mailto:admin@yourcompany.com"
//   SUPABASE_URL              (provided automatically in the runtime)
//   SUPABASE_SERVICE_ROLE_KEY (provided automatically in the runtime)
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

const APPROVER_ROLES = ["owner", "hr", "branch_manager", "department_manager"];
const REQUEST_TYPES = ["إجازة", "تأخير", "سلفة", "مكافأة", "خصم"];

// Any "awaiting an approver" status -> notify the approvers. Leave requests move
// through several stages (dept manager -> HR -> owner); other requests use the
// generic pending status. "مرتجع لـ HR" is a return-to-HR stage.
const PENDING_APPROVER_STATUSES = [
  "بانتظار الاعتماد",
  "بانتظار مدير الإدارة",
  "بانتظار HR",
  "بانتظار المالك",
  "مرتجع لـ HR",
];

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
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
      return jsonResponse({ skipped: "not a notifiable request" });
    }

    let title = "";
    let body = "";
    let filter: { roles?: string[]; phones?: string[] } | null = null;

    const newStatus: string = data.status;
    const oldStatus: string | undefined = oldRecord?.data?.status;

    // On UPDATE, only react when the status actually changed (ignore edits to
    // other fields). On INSERT there is no old status, so this is always true.
    const statusChanged = eventType === "INSERT" || oldStatus !== newStatus;

    if (statusChanged) {
      if (PENDING_APPROVER_STATUSES.includes(newStatus)) {
        // A request is waiting for an approver -> notify all approvers.
        title = "طلب بحاجة اعتماد";
        body = `${data.employeeName || ""} - ${data.type}`.trim();
        filter = { roles: APPROVER_ROLES };
      } else if (newStatus === "معتمد" || newStatus === "مرفوض") {
        // Final decision -> notify the request owner.
        title = "تحديث على طلبك";
        body = newStatus === "معتمد" ? `تم اعتماد طلب ${data.type}` : `تم رفض طلب ${data.type}`;
        if (data.employeePhone) filter = { phones: [data.employeePhone] };
      } else if (newStatus === "بانتظار رد الموظف") {
        // Leave was returned to the employee for their reply -> notify the owner.
        title = "طلبك بحاجة إلى ردّك";
        body = `طلب ${data.type} بحاجة إلى ردّك`;
        if (data.employeePhone) filter = { phones: [data.employeePhone] };
      }
    }

    if (!filter) {
      console.log("skip: no-op event, type=", eventType, "old=", oldStatus, "new=", newStatus);
      return jsonResponse({ skipped: "no-op event" });
    }

    let query = supabase.from("hr_push_subscriptions").select("endpoint, subscription");
    if (filter.roles) query = query.in("role", filter.roles);
    if (filter.phones) query = query.in("phone", filter.phones);
    const { data: subs, error } = await query;
    if (error) throw error;

    console.log("send-push:", eventType, "status=", data.status, "filter=", JSON.stringify(filter), "recipients=", subs?.length || 0);

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
    return jsonResponse({ error: String(e) }, 500);
  }
});
