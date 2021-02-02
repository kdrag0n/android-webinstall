<template>
    <v-container>
        <v-card outlined>
            <v-card-title
                >Installing Android 11.3.1 on
                {{ DEVICE_NAMES[$root.$data.product] }}</v-card-title
            >
            <v-card-subtitle>{{ $root.$data.serial }}</v-card-subtitle>

            <v-card-actions>
                <v-btn outlined text @click="install()">Confirm</v-btn>
            </v-card-actions>
        </v-card>

        <v-banner>{{ installStatus }}</v-banner>

        <v-progress-linear
            v-if="installProgress !== null"
            buffer-value="0"
            :value="installProgress"
            stream
        ></v-progress-linear>

        <v-dialog v-model="reconnectDialog" width="500">
            <v-card>
                <v-card-title class="headline grey lighten-2">
                    Reconnect device
                </v-card-title>

                <v-card-text>
                    To continue flashing, reconnect your device.
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="requestReconnect">
                        I accept
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
        },
    },
};
</script>
