/*global chrome*/

import { getExtensionURL } from "./browser";

const image = {
    inExtension: (path) => {
        // runtime.getURL() returns moz-extension://... on Firefox
        // and chrome-extension://... on Chrome.
        return getExtensionURL(path.replace(/^\//, ""));
    },
    favicon: (url) => {
        return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(url)}&size=32`
    }
}

export {
    image
}