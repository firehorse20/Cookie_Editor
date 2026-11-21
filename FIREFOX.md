# Cookie Editor on Firefox

Cookie Editor ships a dedicated Firefox build alongside the Chrome build.
Same features, same codebase — only the browser-specific wiring differs.

## Requirements

- Firefox **140+** on desktop (Firefox 142+ on Android).
  The floor is set by `browser_specific_settings.gecko.data_collection_permissions`,
  which Firefox only understands from 140 (desktop) / 142 (Android).
- Node.js 20+ and npm, only if you build it yourself.

## Install (temporary add-on, for testing)

AMO publication is not done yet, so for now load the built extension
temporarily. Temporary add-ons are removed when Firefox restarts.

```bash
git clone https://github.com/firehorse20/Cookie_Editor.git
cd Cookie_Editor
npm install
npm run build:firefox   # output: dist-firefox/
```

1. In Firefox, open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…**.
3. Select any file inside `dist-firefox/` (e.g. `dist-firefox/manifest.json`).
4. The extension appears in `about:addons` and its icon appears in the
   toolbar. Click the icon (or the sidebar button) to open Cookie Editor
   in the Firefox sidebar.

To update after pulling new code, rebuild and click **Reload** next to the
extension in `about:debugging`.

## Install (signed package, once published on AMO)

When the extension is submitted to
[addons.mozilla.org](https://addons.mozilla.org/) (see below), users will
install it from its AMO listing like any other add-on — no local build
needed, and it survives restarts and updates itself.

To produce a submittable package locally:

```bash
npm run build:firefox
npx web-ext build --source-dir dist-firefox --artifacts-dir web-ext-artifacts
# -> web-ext-artifacts/cookie_editor-1.1.0.0.zip  (upload this file to AMO)
```

(`web-ext` is Mozilla's command-line tool; `npx web-ext` fetches it on
demand. `web-ext-artifacts/` is git-ignored via `*.zip`.)

## What changed for Firefox

| Area | Chrome build | Firefox build |
| --- | --- | --- |
| Manifest | `src/manifest.json` | `src/manifest.firefox.json` |
| Background | `background.service_worker` (MV3 service worker) | `background.scripts` (event page — Firefox has no extension service workers) |
| Panel UI | `sidePanel` permission + `side_panel` key, `chrome.sidePanel` API | `sidebar_action` key (`default_panel: pages/sidepanel.html`), `browser.sidebarAction` API |
| Add-on ID | derived by Chrome | `browser_specific_settings.gecko.id`: `cookie-editor@cookieeditor.org` |
| Data collection | — | `gecko.data_collection_permissions`: required `authenticationInfo`, `browsingActivity`; optional `technicalAndInteraction` (see note below) |
| Permissions | `contextMenus`, `storage`, `alarms` are optional | moved to required `permissions` — Firefox does not accept them as optional permissions |
| Extra optional | — | `history` added to `optional_permissions` (the auto-remove feature requests it at runtime) |
| Extension URLs | `chrome-extension://<id>/…` in 3 places | `runtime.getURL()` everywhere, which returns `moz-extension://…` on Firefox |
| API namespace | `chrome.*` | `chrome.*` unchanged — in Firefox MV3, `chrome.*` returns Promises just like `browser.*`, and also still accepts callbacks, which this codebase mixes. Firefox-only APIs (`sidebarAction`) are looked up on `browser.*` in `src/utils/browser.js` |

Chrome behaviour is untouched: `npm run build` / `npm run build:extension`
still produces the exact same Chrome manifest (service worker + side panel).

### Files

- `src/manifest.firefox.json` — the Firefox manifest.
- `src/utils/browser.js` — small cross-browser shim (`browserAPI`,
  `getExtensionURL()`, `openPanel()`), used by the background script and
  the shared `extension` helper.
- `src/background.js` — guards the Chrome-only `sidePanel` calls and the
  `externally_connectable` message listener (Firefox does not support
  `externally_connectable`, so web pages cannot message the extension
  there); opens the sidebar via `sidebarAction` on Firefox.
- `src/utils/chrome.js` — storage helpers now tolerate both Promise-based
  and callback-based API shapes.
- `src/utils/images.js`, `src/pages/Extension_sidepanel/components/popup/detail_cookie/index.jsx`
  — extension-page links via `runtime.getURL()` instead of a hard-coded
  `chrome-extension://` URL.
- `vite.config.mjs` / `package.json` — `npm run build:firefox`
  (`vite build --mode firefox`, output `dist-firefox/`); the Chrome
  scripts are unchanged.
- `public/icons/*.png` — the four icon files were all the same 120×120
  image; they are now correctly sized 16/32/48/128 px (this also fixes
  the same warning for the Chrome build).

## Validation

- `npm run build:firefox` — builds cleanly.
- `npm run build` (Chrome) — still builds cleanly, manifest unchanged
  (service worker + side panel).
- `npm test` — 5/5 tests pass.
- `npx addons-linter dist-firefox` — **0 errors**. Remaining warnings are
  pre-existing vendored-library notes (Flowbite/Tailwind `innerHTML` /
  `createContextualFragment` usage), not Firefox issues.

Note: this was validated by build + Mozilla's addons-linter + unit tests,
not by a live run inside Firefox — please report any runtime issue.

## Known differences / limitations on Firefox

- **No ads.** This build ships without ads: the sidebar ad banner
  (`cookieeditor.org/ads` iframe), the wetab.org ad script and the
  "No Ads" upsell card were removed. The extension's own premium
  upgrade prompt is still present.
- **Sidebar, not side panel.** Firefox's sidebar is per-window, while
  Chrome's side panel is per-tab. The same `pages/sidepanel.html` is
  shown; it does not follow the active tab the way Chrome's does.
- **Cookie-link pages and account sync need the website.** The
  `cookieeditor.org` link flow (`/cookie/link/…`) and the
  `onMessageExternal` check only work on Chrome, because Firefox does not
  support `externally_connectable`. Import/export inside the sidebar works
  the same on both browsers.
- **Clear-browsing-data options.** Firefox does not know Chrome's
  `appcache`, `cacheStorage`, `fileSystems` and `webSQL` data types, so
  those checkboxes are ignored on Firefox; cache, cookies, downloads,
  history, form data, IndexedDB, local storage and service workers work.
- **Android.** This build targets desktop Firefox. `permissions.request`
  is not implemented in Firefox for Android, so the optional-permission
  prompts (browsing data, history) will not work there.
- **Data-collection declaration.** The manifest declares required
  `authenticationInfo` (cookies are session/auth data) and
  `browsingActivity` (the current tab's URL is needed to fetch its
  cookies), plus optional `technicalAndInteraction` (Google Analytics
  events). This is a best-effort declaration for AMO review — if a
  reviewer asks for a different categorisation, update
  `data_collection_permissions` in `src/manifest.firefox.json`.
