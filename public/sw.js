/* anis.hr — Service Worker
   - Enables "Add to Home Screen" (installable PWA).
   - Ready to receive Web Push notifications (used in the next step).
   Keep it network-first (no offline app caching) so the app always loads the
   latest version after each deploy. */

const SW_VERSION = "anishr-sw-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// A fetch handler is present so the app qualifies as installable across
// browsers. We don't intercept (no respondWith) -> default network behavior,
// which means no stale caching of your live data.
self.addEventListener("fetch", () => {});

// ---- Web Push (used after the push server piece is added) ----
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "إشعار جديد", body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "إشعار جديد";
  const options = {
    body: data.body || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    dir: "rtl",
    lang: "ar",
    tag: data.tag || undefined,
    renotify: Boolean(data.tag),
    data: { url: data.url || "/" },
  };
  event.waitUntil(
    (async () => {
      // If the app is already open and focused, its in-app poll shows the
      // notification, so skip the push one to avoid a duplicate. When the app
      // is closed or backgrounded (the whole point of push), show it.
      const clientsArr = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const isFocused = clientsArr.some(
        (client) => client.focused || client.visibilityState === "visible"
      );
      if (isFocused) return;
      await self.registration.showNotification(title, options);
    })()
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate && client.navigate(targetUrl);
            return client.focus();
          }
        }
        if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
      })
  );
});
