const CACHE_NAME = "softlynest-pwa-v3";
const OFFLINE_URL = "/offline.html";

const FILES_TO_CACHE = [
  OFFLINE_URL,
  "/offline.svg",
  "/favicon.svg",
  "/manifest.json",
  "/notif.ogg",
];

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// ── Activate ──────────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
  );
  self.clients.claim();
});

// ── Fetch (offline fallback) ──────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.open(CACHE_NAME).then((cache) => cache.match(OFFLINE_URL))
      )
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((res) => res || fetch(event.request))
    );
  }
});

// ── Message from app: update badge ───────────────────────────────────────────
// The app sends { type: "SET_BADGE", count: N } via postMessage.
// The SW sets the badge — this works on Android Chrome PWA.
self.addEventListener("message", (event) => {
  const { type, count } = event.data || {};

  if (type === "SET_BADGE") {
    if ("setAppBadge" in self) {
      if (count > 0) {
        self.setAppBadge(count).catch(() => {});
      } else {
        self.clearAppBadge().catch(() => {});
      }
    }
  }

  if (type === "SHOW_NOTIFICATION") {
    const { title, body, icon } = event.data;
    self.registration.showNotification(title || "Softlynest", {
      body: body || "You have a new notification",
      icon: icon || "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      vibrate: [200, 100, 200],
      tag: "softlynest-notif",
      renotify: true,
    });
  }
});

// ── Push notification (from server) ──────────────────────────────────────────
self.addEventListener("push", (event) => {
  let data = { title: "Softlynest", body: "New notification" };
  try { data = event.data?.json() ?? data; } catch {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      vibrate: [200, 100, 200],
      tag: "softlynest-notif",
      renotify: true,
    })
  );
});

// ── Notification click ────────────────────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow("/home");
      })
  );
});
