/*global chrome, browser*/

import { n8nService } from "./services/n8n";
import { browserAPI, openPanel } from "./utils/browser";
import { PROJECT_URL } from "./constants/website";

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
            url: PROJECT_URL,
            active: true
        });
    }
});

api.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.action) {
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
