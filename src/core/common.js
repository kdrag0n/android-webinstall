let debugMode = true;

export function logDebug(...data) {
    if (debugMode) {
        console.log(...data);
    }
}

export function setDebugMode(mode) {
    debugMode = mode;
}
