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

    if (eventType === "INSERT" && data.status === "بانتظار الاعتماد") {
      title = "طلب جديد";
      body = `${data.employeeName || ""} - ${data.type}`.trim();
      filter = { roles: APPROVER_ROLES };
    } else if (eventType === "UPDATE") {
      const oldStatus = oldRecord?.data?.status;
      if (oldStatus !== data.status && (data.status === "معتمد" || data.status === "مرفوض")) {
        title = "تحديث على طلبك";
        body = data.status === "معتمد" ? `تم اعتماد طلب ${data.type}` : `تم رفض طلب ${data.type}`;
        if (data.employeePhone) filter = { phones: [data.employeePhone] };
      }
    }

    if (!filter) return jsonResponse({ skipped: "no-op event" });

    let query = supabase.from("hr_push_subscriptions").select("endpoint, subscription");
    if (filter.roles) query = query.in("role", filter.roles);
    if (filter.phones) query = query.in("phone", filter.phones);
    const { data: subs, error } = await query;
    if (error) throw error;

    const message = JSON.stringify({ title, body, url: "/", tag: `req-${record.id}` });

    const results = await Promise.allSettled(
      (subs || []).map(async (s: { endpoint: string; subscription: unknown }) => {
        try {
          await webpush.sendNotification(s.subscription as webpush.PushSubscription, message);
        } catch (err) {
          const statusCode = (err as { statusCode?: number })?.statusCode;
          // 404/410 mean the subscription is gone — clean it up.
          if (statusCode === 404 || statusCode === 410) {
            await supabase.from("hr_push_subscriptions").delete().eq("endpoint", s.endpoint);
          }
          throw err;
        }
      })
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    return jsonResponse({ recipients: subs?.length || 0, sent });
  } catch (e) {
    return jsonResponse({ error: String(e) }, 500);
  }
});
