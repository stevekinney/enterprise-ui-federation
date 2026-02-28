import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";

export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: "remoteAnalytics",
      exposes: {
        "./analytics-dashboard": "./src/analytics-dashboard",
      },
      shared: {
        react: { singleton: true, eager: true },
        "react-dom": { singleton: true, eager: true },
        nanostores: { singleton: true, eager: true },
        "@nanostores/react": { singleton: true, eager: true },
        "@pulse/shared": { singleton: true, eager: true },
      },
    }),
  ],
  html: {
    template: "./src/index.html",
  },
});
