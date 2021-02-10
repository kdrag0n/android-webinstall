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
                    cause issues. Avoid USB hubs if possible.
                </p>
                <p>
                    Your USB cable needs to be able to copy files. Charging-only
                    cables won’t work.
                </p>
            </div>

            <v-btn
                :color="$root.$data.product === null ? 'primary' : null"
                @click="connect"
                :disabled="connecting"
                >Connect</v-btn
            >
        </div>

        <div class="mb-4">
            <connect-banner
                :device="device"
                :connecting="connecting"
                :error="error"
            />
        </div>

        <div class="d-flex justify-space-between flex-row-reverse">
            <v-btn
                color="primary"
                @click="$bubble('nextStep')"
                :disabled="$root.$data.product === null"
                >Next <v-icon dark right>mdi-arrow-right</v-icon></v-btn
            >
            <v-btn text @click="$bubble('prevStep')">Back</v-btn>
        </div>
    </v-container>
</template>

<script>
import ConnectBanner from "./ConnectBanner";
import { getDeviceName } from "../core/devices";

export default {
    name: "ConnectStep",

    components: {
        ConnectBanner,
    },

    props: ["device", "blobStore", "active"],

    data: () => ({
        connecting: false,
        error: null,
        firstConnect: true,
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
                    this.$bubble("nextStep");
                }

                this.saEvent(`device_connect__${this.$root.$data.product}`);
            } catch (e) {
                let [handled, message] = this.bubbleError(e);
                this.error = message;
                if (!handled) {
                    throw e;
                }
            } finally {
                this.connecting = false;
            }
        },
    },
};
</script>
