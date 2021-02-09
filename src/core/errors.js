export function isConnectSelectError(err) {
    return (
        err instanceof DOMException &&
        err.code === DOMException.NOT_FOUND_ERR &&
        err.message === "No device selected."
    );
}

export function isConnectUdevError(err) {
    return (
        err instanceof DOMException &&
        err.code === DOMException.SECURITY_ERR &&
        err.message === "Access denied."
    );
}

export function isStorageError(err) {
    return (
        err instanceof DOMException &&
        err.code === 0 &&
        err.message.startsWith("The requested file could not be read")
    );
}

export function isClaimError(err) {
    return (
        err instanceof DOMException &&
        err.code === DOMException.NETWORK_ERR &&
        err.message === "Unable to claim interface."
    );
}

export function isDisconnectError(err) {
    return (
        err instanceof DOMException &&
        err.code === DOMException.NETWORK_ERR &&
        err.message === "A transfer error has occurred."
    );
}

export function isMemoryError(err) {
    return (
        err instanceof RangeError && err.message.includes("allocation failed")
    );
}
