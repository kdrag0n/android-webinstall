<template>
    <v-container>
        <div class="mb-10" flat>
            <h6 class="text-h6 pb-4">Install {{ $root.$data.OS_NAME }}</h6>
            <div class="text-body-1">
                <p>
                    You’re about install {{ $root.$data.OS_NAME }}
                    {{ $root.$data.osVersion }} on your
                    {{ DEVICE_NAMES[$root.$data.product] }}. Press the button
                    below to continue.
                </p>
                <p>
                    <strong class="red--text text--darken-2"
                        >All data on your device will be lost.</strong
                    >
                </p>
            </div>

            <v-btn
                color="primary"
                @click="install()"
                :disabled="installProgress !== null"
                >Install</v-btn
            >

            <v-banner>{{ installStatus }}</v-banner>

            <v-progress-linear
                v-if="installProgress !== null"
                buffer-value="0"
                :value="installProgress"
            ></v-progress-linear>

            <v-dialog v-model="reconnectDialog" width="500">
                <v-card>
                    <v-card-title class="headline grey lighten-2">
                        Reconnect device
                    </v-card-title>

                    <v-card-text>
                        To continue flashing, allow access to your device again.
                    </v-card-text>

                    <v-divider></v-divider>

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
                :disabled="installProgress < 100"
                >Next</v-btn
            >
            <v-btn text @click="$emit('prevStep')">Back</v-btn>
        </div>
    </v-container>
</template>

<style>
.v-progress-linear__determinate {
    transition: none !important;
}
</style>

<script>
import * as fastboot from "fastboot";
import { DEVICE_NAMES } from "../core/devices.js";

fastboot.FactoryImages.configureZip({
    workerScripts: {
        inflate: ["/js/vendor/z-worker-pako.js", "pako_inflate.min.js"],
    },
});

export default {
    name: "InstallStep",

    props: ["device", "blobStore", "active"],

    data: () => ({
        DEVICE_NAMES: DEVICE_NAMES,
        installProgress: null,
        installStatus: "",
        reconnectDialog: false,
        installed: false,
    }),

    methods: {
        async reconnectCallback() {
            this.reconnectDialog = true;
        },

        async requestReconnect() {
            await this.device.connect();
            this.reconnectDialog = false;
        },

        async install() {
            let blob = this.$root.$data.zipBlob;
            this.installed = false;
            await fastboot.FactoryImages.flashZip(
                this.device,
                blob,
                true,
                this.reconnectCallback,
                (action, item, progress) => {
                    let userAction =
                        fastboot.FactoryImages.USER_ACTION_MAP[action];
                    let userItem =
                        item === "avb_custom_key" ? "verified boot key" : item;
                    this.installProgress = progress * 100;
                    this.installStatus = `${userAction} ${userItem}...`;
                }
            );
            await this.device.reboot();
            this.installed = true;
        },
    },
};
</script>
