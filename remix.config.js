/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],

  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",

  browserNodeBuiltinsPolyfill: { modules: { punycode: true } },

  serverDependenciesToBundle: ["lodash"],
};
