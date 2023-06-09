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

self.addEventListener("notificationclick", (event) => {
  const clickedNotification = event.notification;
  clickedNotification.close();
  event.waitUntil(
    self.clients.openWindow(`https://log.jdahl.se/activities/create`)
  );
});
