"use strict";
(() => {
  // service-worker/index.ts
  self.addEventListener("install", (event) => {
    console.log("Installed SW");
  });
  self.addEventListener("activate", (event) => {
    console.log("Activated SW");
  });
  self.addEventListener("push", function(event) {
    if (event.data) {
      const promiseChain = self.registration.showNotification(event.data.text(), {
        actions: [{ action: "register", title: "Registrera" }]
      });
      event.waitUntil(promiseChain);
    } else {
      console.log("Empty notification");
    }
  });
  self.addEventListener("notificationclick", (e) => {
    e.notification.close();
    const url = `https://log.jdahl.se/activities/create`;
    e.waitUntil(
      self.clients.matchAll({ type: "window" }).then((clientsArr) => {
        const hadWindowToFocus = clientsArr.some(
          (windowClient) => windowClient.url === url ? (windowClient.focus(), true) : false
        );
        if (!hadWindowToFocus)
          self.clients.openWindow(url).then((windowClient) => windowClient ? windowClient.focus() : null);
      })
    );
  });
})();
