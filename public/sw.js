"use strict";
(() => {
  // service-worker/index.ts
  self.addEventListener("install", (event) => {
    console.log("Installed SW");
  });
  self.addEventListener("activate", (event) => {
    console.log("Activated SW");
  });
  self.addEventListener("online", () => {
    console.log("online");
  });
  self.addEventListener("push", function(event) {
    var _a, _b;
    if (event.data) {
      console.log("This push event has a lot of data: ", event.data.text());
    } else {
      console.log("This push event has no data.");
    }
    const promiseChain = self.registration.showNotification(
      (_b = (_a = event.data) == null ? void 0 : _a.text()) != null ? _b : "Check this out."
    );
    event.waitUntil(promiseChain);
  });
})();
