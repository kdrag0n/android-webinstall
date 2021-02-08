<template>
    <v-container class="d-flex justify-space-between flex-column flex-grow-1">
        <div class="mt-n4 flex-grow-1" v-if="$root.$data.release !== null">
            <h6 class="text-h6 pb-4">Install {{ $root.$data.OS_NAME }}</h6>

            <div class="text-body-1">
                <p>
                    This will install {{ $root.$data.OS_NAME }}
                    {{ $root.$data.release.version
                    }}{{
                        $root.$data.RELEASE_VARIANTS[
                            $root.$data.release.variant
                        ].suffix
                    }}
                    on your
                    {{ getDeviceName($root.$data.product) }}.
                </p>
                <p v-if="$root.$data.installType === 'clean'">
                    Because you’re doing a clean install to switch from another
                    OS,
                    <strong class="red--text text--darken-3"
                        >all data on your device will be permanently
                        lost.</strong
                    >
                </p>
                <p>
                    Don’t touch or unplug your device during the install. Make
                    sure you don’t press any buttons — everything is automatic.
                </p>
            </div>

            <v-btn
                trigger="installStep"
                :color="installed ? null : 'primary'"
                :disabled="installProgress !== null"
                @click="install()"
                >Install</v-btn
            >
        </div>

        <div class="pb-8">
            <v-banner single-line outlined rounded v-if="installed">
                <v-icon slot="icon" color="green darken-3">mdi-check</v-icon>
                <div class="my-4">
                    <span class="text-body-1 green--text text--darken-3"
                        >Installed {{ $root.$data.OS_NAME }}
                        {{ $root.$data.release.version }}</span
                    >
                </div>
            </v-banner>
            <v-banner
                single-line
                outlined
                rounded
                class="mt-8 pt-1"
                v-else-if="installProgress !== null"
            >
                <v-icon slot="icon" color="primary">{{
                    installStatusIcon
                }}</v-icon>
                <span class="text-body-1">{{ installStatus }}</span>
                <v-progress-linear
                    class="my-3"
                    buffer-value="0"
                    :value="installProgress"
                    stream
                ></v-progress-linear>
            </v-banner>
            <v-banner
                single-line
                outlined
                rounded
                class="mt-8"
                v-else-if="error"
            >
                <v-icon slot="icon" color="red darken-3">mdi-close</v-icon>
                <div class="my-4">
                    <span class="text-body-1 red--text text--darken-3">{{
                        error
                    }}</span>
                </div>
            </v-banner>
        </div>

        <div class="d-flex justify-space-between flex-row-reverse">
            <v-btn
                color="primary"
                @click="$emit('nextStep')"
                :disabled="installing || !installed"
                >Next <v-icon dark right>mdi-arrow-right</v-icon></v-btn
            >
            <v-btn text @click="$emit('prevStep')" :disabled="installing"
                >Back</v-btn
            >
        </div>

        <v-dialog v-model="reconnectDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline"> Reconnect device </v-card-title>

                <v-card-text>
                    To continue flashing, allow access to your device again.
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
                    <v-btn
                        trigger="installStep"
                        color="primary"
                        text
                        @click="requestReconnect"
                    >
                        Reconnect
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="memoryDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline"> Out of memory </v-card-title>

                <v-card-text>
                    <p>
                        There isn’t enough free memory (RAM) to unpack and
                        install the OS.
                    </p>
                    <p>
                        To fix this,
                        <strong>close some unused apps</strong> and try again.
                        If it still doesn’t work, you may need to install from
                        another computer or device with more memory.
                    </p>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        trigger="installStep"
                        color="primary"
                        text
                        @click="retryMemory()"
                    >
                        Retry
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<style>
.v-progress-linear__determinate {
    transition: none !important;
}

.v-banner--single-line .v-banner__text {
    white-space: normal !important;
}
</style>

<script>
import * as fastboot from "fastboot";
import { getDeviceName } from "../core/devices";

fastboot.configureZip({
    workerScripts: {
        inflate: ["js/vendor/z-worker-pako.js", "pako_inflate.min.js"],
    },
});

const INSTALL_STATUS_ICONS = {
    load: "mdi-archive-arrow-down-outline",
    unpack: "mdi-archive-arrow-down-outline",
    flash: "mdi-cellphone-arrow-down",
    wipe: "mdi-cellphone-erase",
    reboot: "mdi-restart",
};

export default {
    name: "InstallStep",

    props: ["device", "blobStore", "active"],

    data: () => ({
        installProgress: null,
        installStatus: "",
        installStatusIcon: null,
        installed: false,
        installing: false,
        firstInstall: true,
        error: null,

        reconnectDialog: false,
        reconnectError: null,

        memoryDialog: false,
    }),

    watch: {
        active: async function (newState) {
            if (newState) {
                this.saEvent("step_install");
            }
        },
    },

    methods: {
        getDeviceName,

        async reconnectCallback() {
            this.reconnectDialog = true;
        },

        async requestReconnect() {
            try {
                await this.device.connect();
                this.reconnectDialog = false;
                this.reconnectError = null;
            } catch (e) {
                this.reconnectError = e.message;
                throw e;
            }
        },

        async retryMemory() {
            this.memoryDialog = false;
            await this.install();
        },

        async errorRetry() {
            await this.install();
        },

        async install() {
            this.installed = false;
            this.installing = true;

            try {
                if (!this.device.isConnected) {
                    await this.device.connect();
                }

                this.saEvent(
                    `install_build__${this.$root.$data.product}_${this.$root.$data.release.version}_${this.$root.$data.release.variant}`
                );
                let blob = this.$root.$data.zipBlob;
                await this.device.flashFactoryZip(
                    blob,
                    this.$root.$data.installType === "clean",
                    this.reconnectCallback,
                    (action, item, progress) => {
                        let userAction = fastboot.USER_ACTION_MAP[action];
                        let userItem =
                            item === "avb_custom_key"
                                ? "verified boot key"
                                : item;
                        this.installStatus = `${userAction} ${userItem}`;
                        this.installStatusIcon = INSTALL_STATUS_ICONS[action];
                        this.installProgress = progress * 100;
                    }
                );

                this.installStatus = `Restarting into ${this.$root.$data.OS_NAME}`;
                await this.device.reboot("");

                this.installed = true;
                this.error = null;

                if (this.firstInstall) {
                    this.firstInstall = false;
                    this.$emit("nextStep");
                }
            } catch (e) {
                this.installed = false;
                this.installProgress = null;

                if (
                    e instanceof DOMException &&
                    e.code === DOMException.NETWORK_ERR &&
                    e.message === "A transfer error has occurred."
                ) {
                    this.error = "Device unexpectedly disconnected";
                    // Handled by parent
                    throw e;
                } else if (
                    e instanceof DOMException &&
                    e.code === 0 &&
                    e.message.startsWith("The requested file could not be read")
                ) {
                    this.error = "Out of storage space";
                    // Handled by parent
                    throw e;
                } else if (
                    e instanceof RangeError &&
                    e.message.includes("allocation failed")
                ) {
                    this.error = "Out of memory";
                    this.memoryDialog = true;
                } else if (
                    e instanceof DOMException &&
                    e.code === DOMException.NOT_FOUND_ERR &&
                    e.message === "No device selected."
                ) {
                    this.error = e.message;
                } else {
                    this.error = e.message;
                    throw e;
                }
            } finally {
                this.installing = false;
            }
        },
    },
};
</script>
