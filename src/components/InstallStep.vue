<template>
    <v-container>
        <div class="mb-10">
            <h6 class="text-h6 pb-4">Install {{ $root.$data.OS_NAME }}</h6>

            <div class="text-body-1">
                <p>
                    You’re about to install {{ $root.$data.OS_NAME }}
                    {{ $root.$data.osVersion }} on your
                    {{ $root.$data.DEVICE_NAMES[$root.$data.product] }}. Press the button
                    below to continue.
                </p>
                <p>
                    <strong class="red--text text--darken-3"
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

            <v-banner
                single-line
                outlined
                rounded
                class="mt-8"
                v-if="installed"
            >
                <v-icon slot="icon" color="green darken-3">mdi-check</v-icon>
                <div class="my-4">
                    <span class="text-body-1 green--text text--darken-3"
                        >Installed {{ $root.$data.OS_NAME }} {{ $root.$data.osVersion }}</span
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
                <span class="text-body-1">{{ installStatus }}</span>
                <v-progress-linear
                    v-if="installProgress !== null"
                    class="my-3"
                    buffer-value="0"
                    :value="installProgress"
                ></v-progress-linear>
            </v-banner>

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
                :disabled="installing || !installed"
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

fastboot.FactoryImages.configureZip({
    workerScripts: {
        inflate: ["/js/vendor/z-worker-pako.js", "pako_inflate.min.js"],
    },
});

export default {
    name: "InstallStep",

    props: ["device", "blobStore", "active"],

    data: () => ({
        installProgress: null,
        installStatus: "",
        reconnectDialog: false,
        installed: false,
        installing: true,
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
            this.installing = true;
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
                    this.installStatus = `${userAction} ${userItem}`;
                }
            );
            this.installStatus = `Restarting into ${this.$root.$data.OS_NAME}`;
            await this.device.reboot("");
            this.installed = true;
            this.installing = false;
        },
    },
};
</script>
