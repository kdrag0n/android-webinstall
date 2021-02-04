<template>
    <v-stepper v-model="curStep" :alt-labels="!$vuetify.breakpoint.mobile">
        <v-stepper-header class="mb-3">
            <v-stepper-step :complete="curStep > 1" step="1">
                Connect
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="curStep > 2" step="2">
                Unlock
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="curStep > 3" step="3">
                Download
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="curStep > 4" step="4">
                Install
            </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
            <v-stepper-content step="0">
                <prepare-step
                    :device="device"
                    :blob-store="blobStore"
                    :active="curStep === 0"
                    @prevStep="curStep -= 1"
                    @nextStep="curStep += 1"
                />
            </v-stepper-content>

            <v-stepper-content step="1">
                <connect-step
                    :device="device"
                    :blob-store="blobStore"
                    :active="curStep === 1"
                    @prevStep="curStep -= 1"
                    @nextStep="curStep += 1"
                />
            </v-stepper-content>

            <v-stepper-content step="2">
                <unlock-step
                    :device="device"
                    :blob-store="blobStore"
                    :curStep="curStep"
                    stepNum="2"
                    @prevStep="curStep -= 1"
                    @nextStep="curStep += 1"
                />
            </v-stepper-content>

            <v-stepper-content step="3">
                <download-step
                    :device="device"
                    :blob-store="blobStore"
                    :active="curStep === 3"
                    @prevStep="curStep -= 1"
                    @nextStep="curStep += 1"
                />
            </v-stepper-content>

            <v-stepper-content step="4">
                <install-step
                    :device="device"
                    :blob-store="blobStore"
                    :active="curStep === 4"
                    @prevStep="curStep -= 1"
                    @nextStep="curStep += 1"
                />
            </v-stepper-content>

            <v-stepper-content step="5">
                <finish-step
                    :device="device"
                    :blob-store="blobStore"
                    :active="curStep === 5"
                    @prevStep="curStep -= 1"
                    @nextStep="curStep += 1"
                />
            </v-stepper-content>
        </v-stepper-items>
    </v-stepper>
</template>

<style>
.v-stepper {
    box-shadow: none !important;
}
.v-stepper__header {
    box-shadow: none !important;
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
}
</style>

<script>
import * as fastboot from "fastboot";
import { BlobStore } from "../core/download";
import PrepareStep from "./PrepareStep";
import ConnectStep from "./ConnectStep";
import UnlockStep from "./UnlockStep";
import DownloadStep from "./DownloadStep";
import InstallStep from "./InstallStep";
import FinishStep from "./FinishStep";

fastboot.setDebugMode(true);

let device = new fastboot.FastbootDevice();
let blobStore = new BlobStore();

export default {
    name: "Installer",

    components: {
        PrepareStep,
        ConnectStep,
        UnlockStep,
        DownloadStep,
        InstallStep,
        FinishStep,
    },

    data: () => ({
        device: device,
        blobStore: blobStore,
        curStep: 0,
    }),
};
</script>
