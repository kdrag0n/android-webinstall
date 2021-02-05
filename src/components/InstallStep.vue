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
                    onto your
                    {{ $root.$data.DEVICE_NAMES[$root.$data.product] }}.
                </p>
                <p v-if="$root.$data.installType === 'clean'">
                    Because you’re doing a clean install to switch from another
                    OS,
                    <strong class="red--text text--darken-3"
                        >all data on your device will be permanently
                        lost.</strong
                    >
                </p>
                <p>Don’t unplug your device during the install.</p>
            </div>

            <v-btn
                :color="installed ? null : 'primary'"
                @click="install()"
                :disabled="installProgress !== null"
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

            <v-dialog v-model="reconnectDialog" width="500" persistent>
                <v-card>
                    <v-card-title class="headline">
                        Reconnect device
                    </v-card-title>

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
                        <v-btn color="primary" text @click="requestReconnect">
                            Reconnect
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
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

fastboot.FactoryImages.configureZip({
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
    }),

    methods: {
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

        async install() {
            this.installed = false;
            this.installing = true;

            try {
                if (!this.device.isConnected) {
                    await this.device.connect();
                }

                let blob = this.$root.$data.zipBlob;
                await fastboot.FactoryImages.flashZip(
                    this.device,
                    blob,
                    this.$root.$data.installType === "clean",
                    this.reconnectCallback,
                    (action, item, progress) => {
                        let userAction =
                            fastboot.FactoryImages.USER_ACTION_MAP[action];
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
                this.error = e.message;
                throw e;
            } finally {
                this.installing = false;
            }
        },
    },
};
</script>
