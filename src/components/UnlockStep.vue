<template>
    <v-container>
        <div class="mb-10">
            <h6 class="text-h6 pb-4">Unlock your bootloader</h6>
            <div class="text-body-1">
                <p>
                    In order to install custom software, you need to unlock your
                    device’s bootloader.
                </p>
                <p>If you haven’t already turned on OEM unlocking:</p>
                <ol class="ml-4 mb-8">
                    <li>Restart back to Android</li>
                    <li>
                        Go to Settings → “About phone” and scroll to the bottom
                    </li>
                    <li>
                        Tap “Build number” repeatedly until developer options is
                        enabled
                    </li>
                    <li>
                        Go to Settings → System → Advanced → “Developer options”
                    </li>
                    <li>Turn on “OEM unlocking”</li>
                    <li>Restart back to the bootloader</li>
                </ol>
            </div>
            <v-btn elevation="2" @click="unlock()" :disabled="unlocking"
                >Unlock</v-btn
            >
            <v-banner single-line class="mt-8" elevation="2" v-if="unlocked">
                <v-icon slot="icon" color="green darken-2">mdi-check</v-icon>
                <span class="text-body-1 green--text text--darken-2"
                    >Your bootloader is now unlocked.</span
                >
            </v-banner>
            <v-row class="mt-6" v-else-if="unlocking">
                <v-progress-circular
                    indeterminate
                    color="primary"
                ></v-progress-circular>
                <span class="text-body-1"
                    >Unlocking bootloader… Confirm using the volume and power
                    buttons.</span
                >
            </v-row>
        </div>

        <div class="d-flex justify-space-between flex-row-reverse">
            <v-btn
                color="primary"
                @click="$emit('nextStep')"
                :disabled="!unlocked"
                >Next</v-btn
            >
            <v-btn text @click="$emit('prevStep')">Back</v-btn>
        </div>
    </v-container>
</template>

<script>
import { DEVICE_NAMES } from "../core/devices.js";

export default {
    name: "UnlockStep",

    props: ["device", "blobStore", "curStep", "stepNum"],

    data: () => ({
        DEVICE_NAMES: DEVICE_NAMES,
        unlocking: false,
        unlocked: false,
    }),

    watch: {
        curStep: async function (newStep, oldStep) {
            if (newStep == this.stepNum) {
                this.unlocked =
                    (await this.device.getVariable("unlocked")) === "yes";
                if (this.unlocked) {
                    if (newStep > oldStep) {
                        this.$emit("nextStep");
                    } else {
                        this.$emit("prevStep");
                    }
                }
            }
        },
    },

    methods: {
        async unlock() {
            this.unlocking = true;
            await this.device.runCommand("flashing unlock");
            this.unlocking = false;
            this.unlocked = true;
        },
    },
};
</script>
