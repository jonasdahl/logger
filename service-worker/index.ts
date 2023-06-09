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

self.addEventListener("online", () => {
  console.log("online");
});
