<template>
    <v-container>
        <div class="mb-10">
            <h6 class="text-h6 pb-4">Connect your device</h6>
            <div class="text-body-1">
                <p>
                    Plug your device into the computer you’re installing from.
                    Make sure you use a <strong>high-quality</strong> USB cable,
                    as many cables will cause issues. Similarly, try not to use
                    USB hubs.
                </p>
                <p>
                    Your USB cable needs to work for copying files.
                    Charging-only cables won’t work for this.
                </p>
            </div>

            <v-btn color="primary" @click="connect()">Connect</v-btn>

            <v-card outlined class="mt-6" v-if="$root.$data.product !== null">
                <v-card-text>
                    <span>Connected to</span>
                </v-card-text>

                <v-card-title>{{
                    DEVICE_NAMES[$root.$data.product]
                }}</v-card-title>
                <v-card-subtitle>{{ $root.$data.serial }}</v-card-subtitle>

                <v-card-actions>
                    <v-btn outlined text @click="connect()">Change</v-btn>
                </v-card-actions>
            </v-card>
            <v-banner single-line outlined rounded class="mt-8" v-else-if="connecting">
                <v-progress-circular
                    slot="icon"
                    indeterminate
                    color="primary"
                ></v-progress-circular>
                <span class="text-body-1"
                    >Connecting to device…</span
                >
            </v-banner>
        </div>

        <div class="d-flex justify-space-between flex-row-reverse">
            <v-btn
                color="primary"
                @click="$emit('nextStep')"
                :disabled="$root.$data.product === null"
                >Next</v-btn
            >
            <v-btn text @click="$emit('prevStep')">Back</v-btn>
        </div>
    </v-container>
</template>

<script>
import { DEVICE_NAMES } from "../core/devices.js";

export default {
    name: "ConnectStep",

    props: ["device", "blobStore", "active"],

    data: () => ({
        DEVICE_NAMES: DEVICE_NAMES,
        connecting: false,
    }),

    methods: {
        async connect() {
            this.connecting = true;
            await this.device.connect();
            this.$root.$data.product = await this.device.getVariable("product");
            this.$root.$data.serial = await this.device.getVariable("serialno");
            this.connecting = false;
        },
    },
};
</script>
