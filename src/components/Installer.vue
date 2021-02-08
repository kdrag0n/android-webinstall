<template>
    <div class="d-flex flex-column flex-grow-1">
        <v-stepper
            v-model="curStep"
            :alt-labels="!$vuetify.breakpoint.mobile"
            class="d-flex flex-column flex-grow-1"
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
                        ref="prepareStep"
                        :device="device"
                        :blob-store="blobStore"
                        :active="curStep === -1"
                        @prevStep="curStep -= 1"
                        @nextStep="curStep += 1"
                    />
                </v-stepper-content>

                <v-stepper-content
                    step="0"
                    :class="
                        curStep === 0 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <install-type-step
                        ref="installTypeStep"
                        :device="device"
                        :blob-store="blobStore"
                        :active="curStep === 0"
                        @prevStep="curStep -= 1"
                        @nextStep="curStep += 1"
                    />
                </v-stepper-content>

                <v-stepper-content
                    step="1"
                    :class="
                        curStep === 1 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <connect-step
                        ref="connectStep"
                        :device="device"
                        :blob-store="blobStore"
                        :active="curStep === 1"
                        @prevStep="curStep -= 1"
                        @nextStep="curStep += 1"
                    />
                </v-stepper-content>

                <v-stepper-content
                    step="2"
                    :class="
                        curStep === 2 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <unlock-step
                        ref="unlockStep"
                        :device="device"
                        :blob-store="blobStore"
                        :curStep="curStep"
                        stepNum="2"
                        @prevStep="curStep -= 1"
                        @nextStep="curStep += 1"
                    />
                </v-stepper-content>

                <v-stepper-content
                    step="3"
                    :class="
                        curStep === 3 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <download-step
                        ref="downloadStep"
                        :device="device"
                        :blob-store="blobStore"
                        :active="curStep === 3"
                        @prevStep="curStep -= 1"
                        @nextStep="curStep += 1"
                    />
                </v-stepper-content>

                <v-stepper-content
                    step="4"
                    :class="
                        curStep === 4 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <install-step
                        ref="installStep"
                        :device="device"
                        :blob-store="blobStore"
                        :active="curStep === 4"
                        @prevStep="curStep -= 1"
                        @nextStep="curStep += 1"
                    />
                </v-stepper-content>

                <v-stepper-content
                    step="5"
                    :class="
                        curStep === 5 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <finish-step
                        ref="finishStep"
                        :device="device"
                        :blob-store="blobStore"
                        :active="curStep === 5"
                        @prevStep="curStep -= 1"
                        @nextStep="curStep += 1"
                    />
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>

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
                    <v-btn color="primary" text @click="retryClaim()">
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
                        Your device unexpectedly disconnected during the
                        install, so we can’t continue installing.
                    </p>
                    <p>
                        This is usually caused by a low-quality cable, loose
                        connection, dirty USB port on your device or computer,
                        or unreliable USB port on your computer.
                    </p>
                    <p>
                        To fix this, try unplugging your device and plugging it
                        back in with a different cable and port. If it still
                        doesn’t work, try cleaning your USB ports on both sides.
                    </p>
                    <p>
                        After reconnecting, you need to
                        <strong>restart your device’s bootloader</strong>
                        using the volume and power buttons before retrying.
                    </p>
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
                    <v-btn color="primary" text @click="retryDisconnect()">
                        Retry
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="storageDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline">
                    Out of storage space
                </v-card-title>

                <v-card-text>
                    <p>
                        There isn’t enough storage space available to download
                        and unpack the OS.
                    </p>
                    <p>
                        If you’re not low on storage space, this is usually
                        caused by using an incognito window or guest profile in
                        your browser. These profiles have very storage limits,
                        so installing from them isn’t possible.
                    </p>
                    <p>
                        To fix this,
                        <strong>switch to a normal browser profile</strong>
                        and try again.
                    </p>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="retryStorage()">
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
import * as fastboot from "fastboot";
import { BlobStore } from "../core/download";
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
    },

    data: () => ({
        device: device,
        blobStore: blobStore,
        curStep: -1,

        claimDialog: false,
        claimVm: null,

        disconnectDialog: false,
        disconnectVm: null,
        reconnectError: null,

        storageDialog: false,
        storageVm: null,
    }),

    // eslint-disable-next-line no-unused-vars
    errorCaptured(err, vm, info) {
        if (
            err instanceof DOMException &&
            err.code === DOMException.NETWORK_ERR &&
            err.message === "Unable to claim interface."
        ) {
            this.claimDialog = true;
            this.claimVm = vm;
            return false;
        } else if (
            err instanceof DOMException &&
            err.code === DOMException.NETWORK_ERR &&
            err.message === "A transfer error has occurred."
        ) {
            this.disconnectDialog = true;
            this.disconnectVm = vm;
            return false;
        } else if (
            err instanceof DOMException &&
            err.code === 0 &&
            err.message.startsWith("The requested file could not be read")
        ) {
            this.storageDialog = true;
            this.storageVm = vm;
            return false;
        }

        return true;
    },

    methods: {
        async retryClaim() {
            this.claimDialog = false;
            if ("trigger" in this.claimVm.$attrs) {
                await this.$refs[this.claimVm.$attrs.trigger].errorRetry();
            }
        },

        async retryDisconnect() {
            this.disconnectDialog = false;

            try {
                await this.device.connect();
                this.reconnectError = null;
            } catch (e) {
                this.reconnectError = e.message;
                throw e;
            }

            if ("trigger" in this.disconnectVm.$attrs) {
                await this.$refs[this.disconnectVm.$attrs.trigger].errorRetry();
            }
        },

        async retryStorage() {
            this.storageDialog = false;
            if ("trigger" in this.storageVm.$attrs) {
                await this.$refs[this.storageVm.$attrs.trigger].errorRetry();
            }
        },
    },
};
</script>
