<template>
    <v-container>
        <div class="mb-10">
            <h6 class="text-h6 pb-4">Download a build</h6>

            <div class="text-body-1">
                <p>
                    Pick a build of {{ $root.$data.OS_NAME }} to download and
                    install.
                </p>
            </div>

            <v-skeleton-loader
                v-if="latestReleases === null"
                type="article, actions"
            ></v-skeleton-loader>

            <div v-else class="d-flex flex-wrap justify-space-around">
                <v-card
                    outlined
                    max-width="16rem"
                    class="ma-4 d-flex flex-column justify-space-between"
                    v-for="release in latestReleases"
                    :key="release.url"
                >
                    <div>
                        <v-card-title>{{ release.version }}</v-card-title>
                        <v-card-subtitle>{{
                            $root.$data.RELEASE_VARIANTS[release.variant]
                        }}</v-card-subtitle>
                    </div>

                    <v-card-actions
                        class="d-flex justify-space-between flex-row-reverse"
                    >
                        <v-btn
                            outlined
                            text
                            @click="download(release)"
                            :disabled="downloading"
                            >Download</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </div>

            <v-banner
                single-line
                outlined
                rounded
                class="mt-8"
                v-if="downloadProgress >= 100"
            >
                <v-icon slot="icon" color="green darken-3">mdi-check</v-icon>
                <div class="my-4">
                    <span class="text-body-1 green--text text--darken-3"
                        >Downloaded {{ $root.$data.OS_NAME }}
                        {{ release.version }}-{{ release.variant }}.</span
                    >
                </div>
            </v-banner>
            <v-banner
                single-line
                outlined
                rounded
                class="mt-8 pt-1"
                v-else-if="downloadProgress !== null"
            >
                <span class="text-body-1">Downloading…</span>
                <v-progress-linear
                    class="my-3"
                    buffer-value="0"
                    :value="downloadProgress"
                    stream
                ></v-progress-linear>
            </v-banner>
        </div>

        <div class="d-flex justify-space-between flex-row-reverse">
            <v-btn
                color="primary"
                @click="$emit('nextStep')"
                :disabled="$root.$data.zipBlob === null"
                >Next</v-btn
            >
            <v-btn text @click="$emit('prevStep')">Back</v-btn>
        </div>
    </v-container>
</template>

<script>
export default {
    name: "DownloadStep",

    props: ["device", "blobStore", "active"],

    data: () => ({
        curStep: 1,
        latestReleases: null,
        downloadProgress: null,
        downloading: false,
        release: null,
    }),

    watch: {
        active: async function (newState) {
            if (newState) {
                let indexResp = await fetch("/releases/index.json");
                let index = await indexResp.json();

                this.latestReleases = index.latest[this.$root.$data.product];
            }
        },
    },

    methods: {
        async download(release) {
            await this.blobStore.init();
            this.downloadProgress = 0;
            this.downloading = true;
            this.release = release;
            let blob = await this.blobStore.download(
                release.url,
                (progress) => {
                    this.downloadProgress = progress * 100;
                }
            );
            this.downloadProgress = 100;
            this.downloading = false;
            this.osVersion = release.version;

            this.$root.$data.zipBlob = blob;
        },
    },
};
</script>
