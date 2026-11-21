/*global chrome, browser*/

import { n8nService } from "./services/n8n";
import { browserAPI, getExtensionURL, openPanel } from "./utils/browser";

// `browserAPI` is `chrome.*` where it exists (Chrome, and Firefox
// as a porting aid) and `browser.*` otherwise. In Firefox MV3
// `chrome.*` also returns Promises, so the rest of this file works
// unchanged on both browsers.
const api = browserAPI;

// Chrome/Edge only: `sidePanel` does not exist in Firefox, which
// uses `sidebar_action` (declared in manifest.firefox.json) instead.
if (api.sidePanel) {
    api.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));
}

api.action.onClicked.addListener(async (tab) => {
    // Firefox: opens the sidebar; Chrome: opens the side panel.
    await openPanel(tab).catch((error) => console.error(error));
});

api.runtime.onInstalled.addListener(details => {
    if (details.reason === api.runtime.OnInstalledReason.INSTALL) {
        api.tabs.create({
            url: `https://cookieeditor.org/?install_success=true&ref=https://chromewebstore.google.com/`,
            active: true
        });
        api.runtime.setUninstallURL?.('https://forms.gle/tCy1URDSXn8yqJ8H7');
    } else if (details.reason === api.runtime.OnInstalledReason.UPDATE) {
        // api.tabs.create({url: `https://cookieeditor.org/?updated_success=true`, active: true});
    }
});

api.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab?.url.startsWith("https://cookieeditor.org/cookie/link/")) {
        // getExtensionURL() returns moz-extension://... on Firefox
        // and chrome-extension://... on Chrome.
        api.tabs.update(tabId, {url: tab?.url.replace("https://cookieeditor.org/cookie/link/", `${getExtensionURL("pages/import.html")}?cookie_id=`)});
    }
});

// Firefox does not support `externally_connectable`, so web pages
// cannot message the extension there; the listener is harmless
// (it simply never fires) and is kept for Chrome.
if (api.runtime.onMessageExternal) {
api.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case "check_install":
            sendResponse({status: true});
            break;

        default:
            sendResponse({status: true});
            break;
    }

    return true;
});
}

api.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.action) {
        case "google_analytics":
            sendGoogleAnalytics(request.data, sendResponse);
            return true;

        case "n8n_get_status":
            n8nService.getStatus()
                .then((data) => sendResponse({success: true, data}))
                .catch((error) => sendResponse({success: false, message: error.message}));
            return true;

        case "n8n_connect":
            n8nService.connect(request.password)
                .then((data) => sendResponse({success: true, data}))
                .catch((error) => sendResponse({success: false, message: error.message}));
            return true;

        case "n8n_disconnect":
            n8nService.disconnect(true)
                .then((data) => sendResponse({success: true, data}))
                .catch((error) => sendResponse({success: false, message: error.message}));
            return true;

        case "n8n_clear_history":
            n8nService.clearHistory()
                .then((data) => sendResponse({success: true, data}))
                .catch((error) => sendResponse({success: false, message: error.message}));
            return true;

        case "n8n_init":
            n8nService.resumeConnection()
                .then(() => sendResponse({success: true}))
                .catch((error) => sendResponse({success: false, message: error.message}));
            return true;

        case "n8n_check_permissions":
            n8nService.hasRequiredPermissions()
                .then((granted) => sendResponse({success: true, granted}))
                .catch((error) => sendResponse({success: false, message: error.message}));
            return true;

        default:
            sendResponse({status: true});
            break
    }
});


api.permissions.contains({permissions: ["contextMenus"]}, (result) => {
    if (result) {
        api.contextMenus.onClicked.addListener(async (info, tab) => {
            const cookies = await api.cookies.getAll({url: tab.url});
            switch (info.menuItemId) {
                case "remove_cookie":
                    for (let i = 0; i < cookies.length; i++) {
                        await api.cookies.remove({
                            url: tab.url,
                            name: cookies[i].name,
                            storeId: cookies[i].storeId
                        })
                    }
                    break;

                case "copy_cookie":
                    api.tabs.sendMessage(tab.id, { action: "copy_all_cookie", data: {cookies} });
                    break;
            }
        });
    }
});

const sendGoogleAnalytics = async (data, callback) => {
    const {en, ep = [], tid, cid, v, t, ul, sr} = data;

    const raw = [
        `en=${en}`,
        ...ep.map(item => `ep.${item.key}=${item.value}`)
    ].join('&');

    const params = {
        tid: String(tid),
        cid: String(cid),
        seg: "1",
        ...(v && {v: String(v)}),
        ...(t && {t: String(t)}),
        ...(ul && {ul: String(ul)}),
        ...(sr && {sr: String(sr)}),
    };

    const url = "https://www.google-analytics.com/g/collect?" + new URLSearchParams(params);

    await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "text/plain"},
        body: raw,
        redirect: "follow",
    });

    callback({status: true});
};


