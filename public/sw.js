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
})();
