let debugMode = true;

export function logDebug(...data) {
    if (debugMode) {
        console.log(...data);
    }
}

export function setDebugMode(mode) {
    debugMode = mode;
}

export function logEvent(event, callback) {
    console.log("Event:", event);
    if (
        window.sa_event &&
        process.env.NODE_ENV === "production" &&
        process.env.VUE_APP_SA_DOMAIN !== undefined
    ) {
        window.sa_event(event, callback);
    } else if (callback !== undefined) {
        callback();
    }
}
