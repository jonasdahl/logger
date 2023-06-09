/**
 * Fix the self reference in order to have
 * service worker intellisense.
 * More info here:
 * https://github.com/Microsoft/TypeScript/issues/11781#issuecomment-503773748
 */
declare var self: ServiceWorkerGlobalScope;
export {};

/**
 * Cache files on install
 */
self.addEventListener("install", (event) => {
  console.log("Installed SW");
});

/**
 * Delete outdated caches when activated
 */
self.addEventListener("activate", (event) => {
  console.log("Activated SW");
});

self.addEventListener("push", function (event) {
  if (event.data) {
    const promiseChain = self.registration.showNotification(event.data.text(), {
      actions: [{ action: "register", title: "Registrera" }],
    });
    event.waitUntil(promiseChain);
  } else {
    console.log("Empty notification");
  }
});

self.addEventListener("notificationclick", (e) => {
  // Close the notification popout
  e.notification.close();
  // Get all the Window clients
  const url = `https://log.jdahl.se/activities/create`;

  e.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientsArr) => {
      // If a Window tab matching the targeted URL already exists, focus that;
      const hadWindowToFocus = clientsArr.some((windowClient) =>
        windowClient.url === url ? (windowClient.focus(), true) : false
      );
      // Otherwise, open a new tab to the applicable URL and focus it.
      if (!hadWindowToFocus)
        self.clients
          .openWindow(url)
          .then((windowClient) => (windowClient ? windowClient.focus() : null));
    })
  );
});
