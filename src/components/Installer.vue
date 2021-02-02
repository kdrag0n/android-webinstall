<template>
    <v-stepper v-model="curStep">
        <v-stepper-header class="mb-3">
            <v-stepper-step :complete="curStep > 1" step="1">
                Connect
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="curStep > 2" step="2">
                Download
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3">Install</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
            <v-stepper-content step="1">
                <v-card class="mb-12" flat>
                    <connect-step :device="device" :blob-store="blobStore" :active="curStep === 1" />
                </v-card>

                <v-btn color="primary" @click="curStep = 2">Continue</v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
                <v-card class="mb-12" flat>
                    <download-step :device="device" :blob-store="blobStore" :active="curStep === 2" />
                </v-card>

                <v-btn color="primary" @click="curStep = 3">Continue</v-btn>

                <v-btn text @click="curStep = 1">Back</v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
                <v-card class="mb-12" flat>
                    <install-step :device="device" :blob-store="blobStore" :active="curStep === 3" />
                </v-card>

                <v-btn text @click="curStep = 2">Back</v-btn>
            </v-stepper-content>
        </v-stepper-items>
    </v-stepper>
</template>

<script>
import * as fastboot from "fastboot";
import { BlobStore } from "../core/download";
import ConnectStep from "./ConnectStep";
import DownloadStep from "./DownloadStep";
import InstallStep from "./InstallStep";

fastboot.setDebugMode(true);

let device = new fastboot.FastbootDevice();
let blobStore = new BlobStore();

export default {
    name: "Installer",

    components: {
        ConnectStep,
        DownloadStep,
        InstallStep,
    },

    data: () => ({
        device: device,
        blobStore: blobStore,
        curStep: 1,
    }),
};
</script>
