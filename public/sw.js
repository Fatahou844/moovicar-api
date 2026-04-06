// Service Worker — Web Push notifications Moovicar
self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data?.json() || {}; } catch (_) {}

  const title = data.title || "Nouveau message";
  const options = {
    body: data.body || "",
    icon: "/logo192.png",
    badge: "/logo192.png",
    vibrate: [200, 100, 200],
    data: { link: data.link || "/" },
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = event.notification.data?.link || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      // Si un onglet de l'app est déjà ouvert, on le focus et on navigue
      for (const client of list) {
        if ("focus" in client) {
          client.focus();
          client.postMessage({ type: "NAVIGATE", link });
          return;
        }
      }
      // Sinon ouvre un nouvel onglet
      if (clients.openWindow) return clients.openWindow(link);
    })
  );
});
