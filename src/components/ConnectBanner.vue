<template>
    <v-banner single-line outlined rounded class="mt-8" v-if="connecting">
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
        v-else-if="this.device.isConnected && $root.$data.product !== null"
    >
        <v-icon slot="icon" color="green darken-3">mdi-check</v-icon>
        <span class="text-body-1 green--text text--darken-3"
            >Connected to {{ getDeviceName($root.$data.product) }}</span
        >
    </v-banner>
    <v-banner single-line outlined rounded class="mt-8" v-else-if="error">
        <v-icon slot="icon" color="red darken-3">mdi-close</v-icon>
        <span class="text-body-1 red--text text--darken-3">{{ error }}</span>
    </v-banner>
</template>

<script>
import { getDeviceName } from "../core/devices";

export default {
    name: "ConnectBanner",

    props: ["device", "connecting", "error"],

    methods: {
        getDeviceName,
    },
};
</script>
