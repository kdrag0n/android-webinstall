<template>
    <v-container>
        <div class="mb-10">
            <h6 class="text-h6 pb-4">Prepare your device</h6>

            <div class="text-body-1">
                <p>
                    This is an easy way to install
                    {{ $root.$data.OS_NAME }} onto your device. You’ll need an
                    <strong>unlocked</strong> model of one of the supported
                    devices:
                </p>
            </div>

            <v-list-item
                two-line
                v-for="device in $root.$data.SUPPORTED_DEVICES"
                :key="device.model"
            >
                <v-list-item-content>
                    <v-list-item-title>{{ device.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                        device.model
                    }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <div class="text-body-1 mt-4">
                <p>
                    Put your device into bootloader mode by turning it off, then
                    holding the
                    <strong>power</strong> and
                    <strong>volume down</strong> buttons together until you see
                    a <span class="red--text text--darken-3">red</span> warning
                    sign.
                </p>
            </div>
        </div>

        <div class="d-flex justify-space-between flex-row-reverse">
            <v-btn color="primary" @click="$emit('nextStep')">
                Start
                <v-icon dark right>mdi-arrow-right</v-icon>
            </v-btn>
        </div>
    </v-container>
</template>

<script>
export default {
    props: ["device", "blobStore", "active"],
};
</script>
