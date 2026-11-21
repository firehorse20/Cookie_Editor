import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Target browser, selected with `--mode firefox` (see package.json):
//   npm run build          -> Chrome (src/manifest.json, dist/)
//   npm run build:firefox  -> Firefox (src/manifest.firefox.json, dist-firefox/)
// Chrome keeps its MV3 service-worker background; Firefox gets
// `background.scripts` (event page) + `sidebar_action` instead of
// `sidePanel`, plus `browser_specific_settings.gecko`.
export default defineConfig(({ mode }) => {
  const isFirefox = mode === "firefox";
  const manifest = JSON.parse(
    readFileSync(
      resolve(
        __dirname,
        isFirefox ? "src/manifest.firefox.json" : "src/manifest.json"
      ),
      "utf-8"
    )
  );

  return {
    base: "./",
    plugins: [react(), crx({ manifest, browser: isFirefox ? "firefox" : "chrome" })],
    publicDir: "public",
    build: {
      emptyOutDir: true,
      outDir: isFirefox ? "dist-firefox" : "dist",
      rollupOptions: {
        input: {
          n8n: resolve(__dirname, "pages/n8n.html"),
          // Firefox only: @crxjs recognises Chrome's `sidePanel` manifest
          // key but not Firefox's `sidebar_action`, so without this entry
          // pages/sidepanel.html is copied raw with its dev script path
          // (`../src/entries/sidepanel.jsx`, absent from the package) and
          // the sidebar renders blank. Listing it here makes Vite bundle
          // the entry and rewrite the script tag to the built asset.
          ...(isFirefox
            ? { sidepanel: resolve(__dirname, "pages/sidepanel.html") }
            : {}),
        },
      },
    },
  };
});
