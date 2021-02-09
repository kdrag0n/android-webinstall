<template>
    <v-container class="d-flex justify-space-between flex-column flex-grow-1">
        <div class="mb-10 mt-n4">
            <h6 class="text-h6 pb-4">Connect your device</h6>

            <div class="text-body-1">
                <p>
                    Put your device into bootloader mode by turning it off, then
                    holding the
                    <strong>power</strong> and
                    <strong>volume down</strong> buttons together until you see
                    a <span class="red--text text--darken-3">red</span> warning
                    sign or
                    <span class="green--text text--darken-3">green</span>
                    Android robot.
                </p>
                <p>
                    Once your device is in bootloader mode, plug it into the
                    computer or device you’re installing from. Make sure you use
                    a
                    <strong>high-quality</strong> USB cable, as many cables will
                    cause issues. Don’t use USB hubs if possible.
                </p>
                <p>
                    Your USB cable needs to be able to copy files. Charging-only
                    cables won’t work for this.
                </p>
            </div>

            <v-btn
                trigger="connectStep"
                :color="$root.$data.product === null ? 'primary' : null"
                @click="connect()"
                :disabled="connecting"
                >Connect</v-btn
            >
        </div>

        <div class="mb-4">
            <v-banner
                single-line
                outlined
                rounded
                class="mt-8"
                v-if="connecting"
            >
                <v-progress-circular
                    slot="icon"
                    indeterminate
                    color="primary"
                ></v-progress-circular>
                <span class="text-body-1">Connecting to device…</span>
            </v-banner>
            <v-banner
                single-line
                outlined
                rounded
                class="mt-8"
                v-else-if="$root.$data.product !== null"
            >
                <v-icon slot="icon" color="green darken-3">mdi-check</v-icon>
                <span class="text-body-1 green--text text--darken-3"
                    >Connected to {{ getDeviceName($root.$data.product) }}</span
                >
            </v-banner>
            <v-banner
                single-line
                outlined
                rounded
                class="mt-8"
                v-else-if="error"
            >
                <v-icon slot="icon" color="red darken-3">mdi-close</v-icon>
                <span class="text-body-1 red--text text--darken-3">{{
                    error
                }}</span>
            </v-banner>
        </div>

        <div class="d-flex justify-space-between flex-row-reverse">
            <v-btn
                color="primary"
                @click="$emit('nextStep')"
                :disabled="$root.$data.product === null"
                >Next <v-icon dark right>mdi-arrow-right</v-icon></v-btn
            >
            <v-btn text @click="$emit('prevStep')">Back</v-btn>
        </div>

        <v-dialog v-model="udevDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline">Access denied</v-card-title>

                <v-card-text>
                    <p>
                        On Linux, users aren’t allowed to access USB devices by
                        default.
                    </p>
                    <p>
                        To fix this, you need to install udev rules for Android
                        devices. The way to do this varies by distribution, but
                        here are the commands for some common distributions:
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

                    <p>
                        Once you’ve installed udev rules, unplug your device and
                        plug it back in for it to take effect.
                    </p>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        trigger="connectStep"
                        color="primary"
                        text
                        @click="retryUdev()"
                    >
                        Retry
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { getDeviceName } from "../core/devices";
import * as errors from "../core/errors";

export default {
    name: "ConnectStep",

    props: ["device", "blobStore", "active"],

    data: () => ({
        connecting: false,
        error: null,
        firstConnect: true,
        udevDialog: false,
    }),

    watch: {
        active: async function (newState) {
            if (newState) {
                this.saEvent("step_connect");
            }
        },
    },

    methods: {
        getDeviceName,

        async retryUdev() {
            this.udevDialog = false;
            await this.connect();
        },

        async errorRetry() {
            await this.connect();
        },

        async connect() {
            this.connecting = true;

            try {
                await this.device.connect();
                this.$root.$data.product = await this.device.getVariable(
                    "product"
                );
                this.error = null;

                if (this.firstConnect) {
                    this.firstConnect = false;
                    this.$emit("nextStep");
                }

                this.saEvent(`device_connect__${this.$root.$data.product}`);
            } catch (e) {
                if (errors.isConnectSelectError(e)) {
                    this.error = e.message;
                } else if (errors.isConnectUdevError(e)) {
                    this.udevDialog = true;
                } else {
                    this.error = e.message;
                    throw e;
                }
            } finally {
                this.connecting = false;
            }
        },
    },
};
</script>
