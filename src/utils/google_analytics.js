/* Telemetry was removed in this fork: the original code sent usage
 * events to the original author's Google Analytics property
 * (G-Q6M7NGMJYS). This build collects nothing. The export is kept so
 * existing call sites need no changes. */

/*global chrome*/

export const googleAnalytics = ({ name, params = [] }, callback = () => {}) => {
    callback({ status: true });
};
