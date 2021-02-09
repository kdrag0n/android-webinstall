import * as common from "./common.js";

const CACHE_DB_NAME = "BlobStore";
const CACHE_DB_VERSION = 1;

export class XhrError extends Error {
    constructor(status, statusText) {
        super(`HTTP error ${status} ${statusText}`);
        this.status = status;
        this.statusText = statusText;
        this.name = "XhrError";
    }
}

// This wraps XHR because getting progress updates with fetch() is overly complicated.
function fetchBlobWithProgress(url, onProgress) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();

    return new Promise((resolve, reject) => {
        xhr.onload = () => {
            resolve(xhr.response);
        };
        xhr.onprogress = (event) => {
            onProgress(event.loaded / event.total);
        };
        xhr.onerror = () => {
            reject(new XhrError(xhr.status, xhr.statusText));
        };
    });
}

export class BlobStore {
    constructor() {
        this.db = null;
    }

    async _wrapReq(request, onUpgrade = null) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.oncomplete = () => {
                resolve(request.result);
            };
            request.onerror = (event) => {
                reject(event);
            };

            if (onUpgrade !== null) {
                request.onupgradeneeded = onUpgrade;
            }
        });
    }

    async init() {
        if (this.db === null) {
            this.db = await this._wrapReq(
                indexedDB.open(CACHE_DB_NAME, CACHE_DB_VERSION),
                (event) => {
                    let db = event.target.result;
                    db.createObjectStore("files", { keyPath: "name" });
                    /* no index needed for such a small database */
                }
            );
        }
    }

    async saveFile(name, blob) {
        this.db.transaction(["files"], "readwrite").objectStore("files").add({
            name: name,
            blob: blob,
        });
    }

    async loadFile(name) {
        try {
            let obj = await this._wrapReq(
                this.db.transaction("files").objectStore("files").get(name)
            );
            return obj.blob;
        } catch (error) {
            return null;
        }
    }

    async close() {
        this.db.close();
    }

    async download(url, onProgress = () => {}) {
        let filename = url.split("/").pop();
        let blob = await this.loadFile(filename);
        if (blob === null) {
            common.logDebug(`Downloading ${url}`);
            blob = await fetchBlobWithProgress(url, onProgress);
            common.logDebug("File downloaded, saving...");
            await this.saveFile(filename, blob);
            common.logDebug("File saved");
        } else {
            common.logDebug(
                `Loaded ${filename} from blob store, skipping download`
            );
        }

        return blob;
    }
}
