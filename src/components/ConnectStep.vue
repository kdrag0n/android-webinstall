<template>
    <v-container>
        <div class="mb-10 mt-n4">
            <h6 class="text-h6 pb-4">Connect your device</h6>

            <div class="text-body-1">
                <p>
                    Plug your device into the computer you’re installing from.
                    Make sure you use a <strong>high-quality</strong> USB cable,
                    as many cables will cause issues. Similarly, try not to use
                    USB hubs.
                </p>
                <p>
                    Your USB cable needs to be able to copy files. Charging-only
                    cables won’t work for this.
                </p>
            </div>

            <v-btn
                :color="$root.$data.product === null ? 'primary' : null"
                @click="connect()"
                :disabled="connecting"
                >Connect</v-btn
            >

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
                    >Connected to
                    {{ $root.$data.DEVICE_NAMES[$root.$data.product] }}</span
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
    </v-container>
</template>

<script>
export default {
    name: "ConnectStep",

    props: ["device", "blobStore", "active"],

    data: () => ({
        connecting: false,
        error: null,
    }),

    methods: {
        async connect() {
            this.connecting = true;

            try {
                await this.device.connect();
                this.$root.$data.product = await this.device.getVariable(
                    "product"
                );
                this.error = null;
            } catch (e) {
                this.error = e.message;
                throw e;
            } finally {
                this.connecting = false;
            }
        },
    },
};
</script>
