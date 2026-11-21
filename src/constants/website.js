export const WEBSITE_URL = import.meta.env.VITE_WEBSITE || "https://cookieeditor.org";

// This fork's project page. All user-facing links (About, open
// source, reviews, install page) point here instead of the original
// author's website and social accounts.
export const PROJECT_URL = "https://github.com/firehorse20/Cookie_Editor";
export const PROJECT_ISSUES_URL = `${PROJECT_URL}/issues`;
export const AMO_REVIEWS_URL =
    "https://addons.mozilla.org/firefox/addon/cookie-editor-firefox/reviews/";

export const getN8nWsUrl = () => {
    return WEBSITE_URL.replace(/^http/, "ws") + "/ws/n8n";
};

export const getN8nApiUrl = () => {
    return `${WEBSITE_URL}/api/n8n/cookies`;
};
