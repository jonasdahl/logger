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
  self.addEventListener("notificationclick", (event) => {
    const clickedNotification = event.notification;
    clickedNotification.close();
    event.waitUntil(
      self.clients.openWindow(`https://log.jdahl.se/activities/create`)
    );
  });
})();
