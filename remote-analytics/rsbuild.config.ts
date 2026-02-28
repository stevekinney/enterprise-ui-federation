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
        react: { singleton: true },
        "react-dom": { singleton: true },
        nanostores: { singleton: true },
        "@nanostores/react": { singleton: true },
      },
    }),
  ],
  html: {
    template: "./src/index.html",
  },
});
