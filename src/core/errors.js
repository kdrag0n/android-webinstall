import { XhrError } from "./download";
import { TimeoutError } from "android-fastboot";

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
        (err instanceof DOMException &&
            err.code === 0 &&
            err.message.startsWith("The requested file could not be read")) ||
        (err instanceof XhrError && err.status === 0 && err.statusText === "")
    );
}

export function isClaimError(err) {
    return (
        (err instanceof DOMException &&
            err.code === DOMException.NETWORK_ERR &&
            err.message === "Unable to claim interface.") ||
        (err instanceof DOMException &&
            err.code === DOMException.INVALID_STATE_ERR &&
            err.message ===
                "An operation that changes the device state is in progress.")
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

// This is still separate in case it changes in the future.
export function isTimeoutError(err) {
    return err instanceof TimeoutError;
}
