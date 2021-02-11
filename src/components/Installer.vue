<template>
    <div class="d-flex flex-column flex-grow-1">
        <v-stepper
            ref="stepper"
            v-model="curStep"
            :alt-labels="!$vuetify.breakpoint.mobile"
            class="d-flex flex-column flex-grow-1"
            @errorClaim="errorClaim"
            @errorDisconnect="errorDisconnect"
            @errorStorage="errorStorage"
            @errorTimeout="errorTimeout"
            @requestDeviceReconnect="reconnectCallback"
            @prevStep="curStep -= 1"
            @nextStep="curStep += 1"
        >
            <v-stepper-header class="mb-3">
                <v-stepper-step :complete="curStep > 1" step="1">
                    Connect
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="curStep > 2" step="2">
                    Unlock
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="curStep > 3" step="3">
                    Download
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="curStep > 4" step="4">
                    Install
                </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items class="d-flex flex-column flex-grow-1">
                <v-stepper-content
                    step="-1"
                    :class="
                        curStep === -1 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <prepare-step
                        :device="device"
                        :blob-store="blobStore"
                        :active="curStep === -1"
                    />
                </v-stepper-content>

                <v-stepper-content
                    step="0"
                    :class="
                        curStep === 0 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <install-type-step
                        :device="device"
                        :blob-store="blobStore"
                        :active="curStep === 0"
                    />
                </v-stepper-content>

                <v-stepper-content
                    step="1"
                    :class="
                        curStep === 1 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <connect-step
                        :device="device"
                        :blob-store="blobStore"
                        :active="curStep === 1"
                    />
                </v-stepper-content>

                <v-stepper-content
                    step="2"
                    :class="
                        curStep === 2 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <unlock-step
                        :device="device"
                        :blob-store="blobStore"
                        :curStep="curStep"
                        stepNum="2"
                    />
                </v-stepper-content>

                <v-stepper-content
                    step="3"
                    :class="
                        curStep === 3 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <download-step
                        :device="device"
                        :blob-store="blobStore"
                        :active="curStep === 3"
                    />
                </v-stepper-content>

                <v-stepper-content
                    step="4"
                    :class="
                        curStep === 4 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <install-step
                        :device="device"
                        :blob-store="blobStore"
                        :active="curStep === 4"
                    />
                </v-stepper-content>

                <v-stepper-content
                    step="5"
                    :class="
                        curStep === 5 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <finish-step
                        :device="device"
                        :blob-store="blobStore"
                        :active="curStep === 5"
                    />
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>

        <v-dialog v-model="udevDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline">Access denied</v-card-title>

                <v-card-text>
                    <p>
                        On Linux, users aren’t allowed to access USB devices by
                        default.
                    </p>
                    <p>
                        To fix this, install Android udev rules on your system:
                    </p>

                    <v-list-item two-line>
                        <v-list-item-content>
                            <v-list-item-title>Arch Linux</v-list-item-title>
                            <v-list-item-subtitle
                                >sudo pacman -S
                                android-udev</v-list-item-subtitle
                            >
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item two-line>
                        <v-list-item-content>
                            <v-list-item-title
                                >Debian, Ubuntu</v-list-item-title
                            >
                            <v-list-item-subtitle
                                >sudo apt install
                                android-sdk-platform-tools-common</v-list-item-subtitle
                            >
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item two-line>
                        <v-list-item-content>
                            <v-list-item-title
                                >Other distributions</v-list-item-title
                            >
                            <v-list-item-subtitle
                                >Instructions vary</v-list-item-subtitle
                            >
                        </v-list-item-content>
                    </v-list-item>

                    <p>
                        Once you’ve installed udev rules, unplug your device and
                        plug it back in for it to take effect.
                    </p>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="retryUdev">
                        Retry
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="claimDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline">
                    Can’t control device
                </v-card-title>

                <v-card-text>
                    <p>
                        Another app is taking control of your device, so we
                        can’t talk to it.
                    </p>
                    <p>
                        This is usually caused by having this installer open in
                        another browser tab.
                    </p>
                    <p>
                        To fix this, close all other web installer tabs in your
                        browser and make sure you don’t have any tabs remaining
                        in other windows.
                    </p>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="retryClaim">
                        Retry
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="disconnectDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline">
                    Device disconnected
                </v-card-title>

                <v-card-text>
                    <p>
                        Your device disconnected, so we can’t
                        continue installing.
                    </p>
                    <p>
                        To fix this:
                        <ul class="ml-4 mb-4">
                            <li>Don’t touch the device</li>
                            <li>Use a different cable</li>
                            <li>Clean your USB port</li>
                            <li>Don’t use USB hubs</li>
                            <li>Make sure the cable isn’t loose</li>
                        </ul>
                    </p>
                    <connect-banner
                        :device="device"
                        :connecting="disconnectReconnecting"
                        :error="disconnectReconnectError"
                    />
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="retryDisconnect">
                        Retry
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="storageDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline">Out of storage</v-card-title>

                <v-card-text>
                    <p>
                        There isn’t enough storage space available to download
                        and unpack the OS. You need at least 5 GB free.
                    </p>
                    <p>
                        If you’re not low on storage, this is caused by
                        using an incognito window or guest browser profile. These profiles have very storage limits, so
                        installing from them isn’t possible.
                    </p>
                    <p>
                        To fix this,
                        <strong>switch to a normal browser profile</strong>
                        and try again.
                    </p>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="retryStorage">
                        Retry
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="memoryDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline">Out of memory</v-card-title>

                <v-card-text>
                    <p>
                        There isn’t enough free memory (RAM) to unpack and
                        install the OS.
                    </p>
                    <p>
                        To fix this,
                        <strong>close some unused apps</strong> and try again.
                    </p>
                    <p>
                        If it still doesn’t work, you may need to install from
                        another computer or device with more memory.
                    </p>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="retryMemory">
                        Retry
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="reconnectDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline">Reconnect device</v-card-title>

                <v-card-text>
                    To continue installing, allow access to your device again.
                    <v-banner
                        single-line
                        outlined
                        rounded
                        class="mt-8"
                        v-if="reconnectError"
                    >
                        <v-icon slot="icon" color="red darken-3"
                            >mdi-close</v-icon
                        >
                        <div class="my-4">
                            <span
                                class="text-body-1 red--text text--darken-3"
                                >{{ reconnectError }}</span
                            >
                        </div>
                    </v-banner>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="requestReconnect">
                        Reconnect
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="timeoutDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline">Device is stuck</v-card-title>

                <v-card-text>
                    <p>
                        The connection to your device is stuck.
                    </p>
                    <p>
                        To fix this, use the volume buttons to highlight <strong>“Restart bootloader”</strong> in the bootloader menu, and press the power button to select it.
                    </p>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="retryTimeout">
                        Retry
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<style>
.v-stepper {
    box-shadow: none !important;
    border-radius: 8px !important;
}
.v-stepper__header {
    box-shadow: none !important;
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
}
.v-stepper__wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
</style>

<script>
import * as fastboot from "android-fastboot";
import { BlobStore } from "../core/download";
import ConnectBanner from "./ConnectBanner";
import PrepareStep from "./PrepareStep";
import InstallTypeStep from "./InstallTypeStep";
import ConnectStep from "./ConnectStep";
import UnlockStep from "./UnlockStep";
import DownloadStep from "./DownloadStep";
import InstallStep from "./InstallStep";
import FinishStep from "./FinishStep";

fastboot.setDebugLevel(1);

let device = new fastboot.FastbootDevice();
let blobStore = new BlobStore();

export default {
    name: "Installer",

    components: {
        PrepareStep,
        InstallTypeStep,
        ConnectStep,
        UnlockStep,
        DownloadStep,
        InstallStep,
        FinishStep,
        ConnectBanner,
    },

    data: () => ({
        device: device,
        blobStore: blobStore,
        curStep: -1,

        udevDialog: false,
        claimDialog: false,
        storageDialog: false,
        memoryDialog: false,
        timeoutDialog: false,
        retryCallbacks: [],

        disconnectDialog: false,
        disconnectReconnecting: false,
        disconnectReconnectError: null,

        reconnectDialog: false,
        reconnectError: null,
    }),

    methods: {
        handleSelfError(error, retryCallback) {
            this.$refs.stepper.$emit(error, retryCallback);
        },

        errorUdev(retry) {
            this.udevDialog = true;
            this.retryCallbacks.push(retry);
        },
        retryUdev() {
            this.udevDialog = false;
            this.retryCallbacks.pop()();
        },

        errorClaim(retry) {
            this.claimDialog = true;
            this.retryCallbacks.push(retry);
        },
        retryClaim() {
            this.claimDialog = false;
            this.retryCallbacks.pop()();
        },

        errorDisconnect(retry) {
            this.$root.$data.product = null;

            this.disconnectReconnecting = false;
            this.disconnectReconnectError = null;
            this.disconnectDialog = true;
            this.retryCallbacks.push(retry);
        },
        async retryDisconnect() {
            this.disconnectReconnecting = true;
            this.$root.$data.product = null;

            try {
                await this.device.connect();
                this.$root.$data.product = await this.device.getVariable(
                    "product"
                );
                this.disconnectReconnectError = null;
            } catch (e) {
                let [handled, message] = this.bubbleError(e, this.retryDisconnect);
                this.disconnectReconnectError = message;
                if (!handled) {
                    throw e;
                }

                this.disconnectReconnecting = false;
                return;
            }

            this.disconnectReconnecting = false;
            this.disconnectDialog = false;
            this.retryCallbacks.pop()();
        },

        errorStorage(retry) {
            this.storageDialog = true;
            this.retryCallbacks.push(retry);
        },
        retryStorage() {
            this.storageDialog = false;
            this.retryCallbacks.pop()();
        },

        errorMemory(retry) {
            this.memoryDialog = true;
            this.retryCallbacks.push(retry);

            this.saEvent("error__out_of_memory");
        },
        retryMemory() {
            this.memoryDialog = false;
            this.retryCallbacks.pop()();
        },

        reconnectCallback() {
            this.reconnectError = null;
            this.reconnectDialog = true;
        },
        async requestReconnect() {
            try {
                await this.device.connect();
                this.reconnectDialog = false;
                this.reconnectError = null;
            } catch (e) {
                this.reconnectError = e.message;
            }
        },

        errorTimeout(retry) {
            this.timeoutDialog = true;
            this.retryCallbacks.push(retry);
        },
        retryTimeout() {
            this.timeoutDialog = false;
            this.retryCallbacks.pop()();
        },
    },
};
</script>
