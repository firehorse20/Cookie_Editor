/*global chrome*/

import { browserAPI } from "./browser";

/**
 * Call an extension API that may be Promise-based (`browser.*` in
 * Firefox, `chrome.*` in Chrome MV3) or callback-based (older
 * `chrome.*`). Returns a Promise either way.
 */
const callAsync = (fn, ...args) => {
  return new Promise((resolve, reject) => {
    let result;
    try {
      result = fn(...args, (value) => {
        const lastError = browserAPI.runtime?.lastError;
        if (lastError) {
          reject(new Error(lastError.message));
        } else {
          resolve(value);
        }
      });
    } catch (error) {
      reject(error);
      return;
    }
    // Promise-based flavour: the call returned a thenable and the
    // callback above will never fire, so resolve from the Promise.
    // (Firefox `browser.*` ignores the extra callback argument.)
    if (result && typeof result.then === "function") {
      result.then(resolve, reject);
    }
  });
};

const extension = {
  getManifest: () => {
    return browserAPI.runtime.getManifest();
  },
  getId: () => {
    return browserAPI.runtime.id;
  },
  getLang: (key) => {
    return browserAPI.i18n.getMessage(key);
  },
  storage: {
    getItem: async (key) => {
      const result = await callAsync(
        browserAPI.storage.local.get.bind(browserAPI.storage.local),
        key
      );
      return result?.[key] ?? null;
    },
    setItem: async (key, value) => {
      await callAsync(
        browserAPI.storage.local.set.bind(browserAPI.storage.local),
        { [key]: value }
      );
    },
    removeItem: async (key) => {
      await callAsync(
        browserAPI.storage.local.remove.bind(browserAPI.storage.local),
        key
      );
    },
  },
};

export { extension };
