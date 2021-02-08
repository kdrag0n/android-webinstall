<template>
    <v-stepper
        v-model="curStep"
        :alt-labels="!$vuetify.breakpoint.mobile"
        class="d-flex flex-column flex-grow-1"
    >
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

        <v-stepper-items class="d-flex flex-column flex-grow-1">
            <v-stepper-content
                step="-1"
                :class="
                    curStep === -1 ? 'd-flex flex-column flex-grow-1' : null
                "
            >
                <prepare-step
                    :device="device"
                    :blob-store="blobStore"
                    :active="curStep === -1"
                    @prevStep="curStep -= 1"
                    @nextStep="curStep += 1"
                />
            </v-stepper-content>

            <v-stepper-content
                step="0"
                :class="curStep === 0 ? 'd-flex flex-column flex-grow-1' : null"
            >
                <install-type-step
                    :device="device"
                    :blob-store="blobStore"
                    :active="curStep === 0"
                    @prevStep="curStep -= 1"
                    @nextStep="curStep += 1"
                />
            </v-stepper-content>

            <v-stepper-content
                step="1"
                :class="curStep === 1 ? 'd-flex flex-column flex-grow-1' : null"
            >
                <connect-step
                    :device="device"
                    :blob-store="blobStore"
                    :active="curStep === 1"
                    @prevStep="curStep -= 1"
                    @nextStep="curStep += 1"
                />
            </v-stepper-content>

            <v-stepper-content
                step="2"
                :class="curStep === 2 ? 'd-flex flex-column flex-grow-1' : null"
            >
                <unlock-step
                    :device="device"
                    :blob-store="blobStore"
                    :curStep="curStep"
                    stepNum="2"
                    @prevStep="curStep -= 1"
                    @nextStep="curStep += 1"
                />
            </v-stepper-content>

            <v-stepper-content
                step="3"
                :class="curStep === 3 ? 'd-flex flex-column flex-grow-1' : null"
            >
                <download-step
                    :device="device"
                    :blob-store="blobStore"
                    :active="curStep === 3"
                    @prevStep="curStep -= 1"
                    @nextStep="curStep += 1"
                />
            </v-stepper-content>

            <v-stepper-content
                step="4"
                :class="curStep === 4 ? 'd-flex flex-column flex-grow-1' : null"
            >
                <install-step
                    :device="device"
                    :blob-store="blobStore"
                    :active="curStep === 4"
                    @prevStep="curStep -= 1"
                    @nextStep="curStep += 1"
                />
            </v-stepper-content>

            <v-stepper-content
                step="5"
                :class="curStep === 5 ? 'd-flex flex-column flex-grow-1' : null"
            >
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
    border-radius: 8px !important;
}
.v-stepper__header {
    box-shadow: none !important;
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
}
.v-stepper__wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
</style>

<script>
import * as fastboot from "fastboot";
import { BlobStore } from "../core/download";
import PrepareStep from "./PrepareStep";
import InstallTypeStep from "./InstallTypeStep";
import ConnectStep from "./ConnectStep";
import UnlockStep from "./UnlockStep";
import DownloadStep from "./DownloadStep";
import InstallStep from "./InstallStep";
import FinishStep from "./FinishStep";

fastboot.setDebugLevel(1);

let device = new fastboot.FastbootDevice();
let blobStore = new BlobStore();

export default {
    name: "Installer",

    components: {
        PrepareStep,
        InstallTypeStep,
        ConnectStep,
        UnlockStep,
        DownloadStep,
        InstallStep,
        FinishStep,
    },

    data: () => ({
        device: device,
        blobStore: blobStore,
        curStep: -1,
    }),
};
</script>
