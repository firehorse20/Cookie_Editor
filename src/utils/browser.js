/* Cross-browser extension API shim.
 *
 * Firefox exposes the same WebExtensions APIs under `browser.*`
 * (Promise-based) and, as a porting aid, under `chrome.*` as well.
 * In Firefox MV3, `await chrome.tabs.query(...)` etc. already work,
 * because Firefox returns Promises from `chrome.*` in MV3
 * (https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension).
 * So most call sites can keep using `chrome.*` unchanged.
 *
 * Deliberately prefer `chrome.*` over `browser.*` here: this
 * codebase mixes `await` and callback styles, and Firefox's
 * `chrome.*` supports both in MV3, while `browser.*` is
 * Promise-only (a callback passed to e.g. `permissions.contains`
 * would never fire). Firefox-only APIs such as `sidebarAction`
 * are not in the `chrome.*` namespace, so they are looked up on
 * `browser.*` explicitly (see `openPanel`).
 *
 * This module only centralises the places that DO differ:
 *  - building extension URLs with `runtime.getURL()` instead of a
 *    hard-coded `chrome-extension://` scheme (Firefox uses
 *    `moz-extension://`), and
 *  - feature-detecting Chrome-only APIs (`sidePanel`) vs the
 *    Firefox equivalent (`sidebarAction`).
 */

/*global browser, chrome*/

export const browserAPI = globalThis.chrome ?? globalThis.browser;

const sidebarAction =
  globalThis.browser?.sidebarAction ?? globalThis.chrome?.sidebarAction;

export const isFirefox = typeof sidebarAction !== "undefined";

/** Extension URL for a path inside the extension (scheme-correct on both browsers). */
export const getExtensionURL = (path) => browserAPI.runtime.getURL(path);

// Host access needed to read a tab's cookies.
export const HOST_ORIGINS = ["https://*/*", "http://*/*"];

// Call a `permissions.*` method tolerating both the Promise shape and
// the callback shape (see module header): call once with a callback,
// and use the returned Promise too when the implementation provides one.
const callPermissions = (method, details) =>
  new Promise((resolve) => {
    const fn = browserAPI.permissions?.[method];
    if (typeof fn !== "function") {
      resolve(false);
      return;
    }
    let settled = false;
    const done = (value) => {
      if (!settled) {
        settled = true;
        resolve(value === true);
      }
    };
    try {
      const result = fn.call(browserAPI.permissions, details, (value) => done(value));
      if (result && typeof result.then === "function") {
        result.then(done, () => done(false));
      }
    } catch (_) {
      done(false);
    }
  });

// Firefox MV3: host permissions declared in the manifest start
// UNGRANTED (unlike Chrome, where they are granted at install).
// Until the user grants them, `cookies.getAll({url})` silently
// resolves to [] — no error, no cookies. The sidebar must ask for
// them at runtime; without this the extension looks broken on
// Firefox even though the same build works on Chrome.
export const hasHostPermissions = () =>
  callPermissions("contains", { origins: HOST_ORIGINS });

export const requestHostPermissions = () =>
  callPermissions("request", { origins: HOST_ORIGINS });

/** Open the sidebar / side panel for the given tab, whichever API this browser has. */
export const openPanel = async (tab) => {
  if (sidebarAction) {
    // Firefox: sidebar_action is per-window, no tabId needed.
    if (typeof sidebarAction.open === "function") {
      await sidebarAction.open();
      return true;
    }
    if (typeof sidebarAction.toggle === "function") {
      await sidebarAction.toggle();
      return true;
    }
    return false;
  }
  if (browserAPI.sidePanel) {
    // Chrome / Edge (MV3): per-tab side panel.
    if (tab?.id) {
      await browserAPI.sidePanel.setOptions({
        tabId: tab.id,
        path: "pages/sidepanel.html",
        enabled: true,
      });
      await browserAPI.sidePanel.open({ tabId: tab.id });
    }
    return true;
  }
  return false;
};
