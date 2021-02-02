<template>
    <v-container>
        <v-btn elevation="2" @click="connect()">Connect</v-btn>
        <v-card outlined v-if="product !== null">
            <v-card-title>{{ DEVICE_NAMES[$root.$data.product] }}</v-card-title>
            <v-card-subtitle>{{ $root.$data.serial }}</v-card-subtitle>

            <v-card-actions>
                <v-btn outlined text @click="connect()">Change</v-btn>
            </v-card-actions>
        </v-card>
        <v-progress-circular
            v-else
            indeterminate
            color="primary"
        ></v-progress-circular>
    </v-container>
</template>

<script>
import { DEVICE_NAMES } from "../core/devices.js";

export default {
    name: "ConnectStep",

    props: ["device", "blobStore", "active"],

    data: () => ({
        DEVICE_NAMES: DEVICE_NAMES,
    }),

    methods: {
        async connect() {
            await this.device.connect();
            this.$root.$data.product = await this.device.getVariable("product");
            this.$root.$data.serial = await this.device.getVariable("serialno");
        },
    },
};
</script>
