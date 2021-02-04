<template>
    <v-container>
        <div class="mb-10 mt-n4">
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
                                .description
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
                        {{ release.version }}-{{ release.variant }}</span
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
                <v-icon slot="icon" color="primary">mdi-download</v-icon>
                <span class="text-body-1">Downloading…</span>
                <v-progress-linear
                    class="my-3"
                    buffer-value="0"
                    :value="downloadProgress"
                    stream
                ></v-progress-linear>
            </v-banner>
            <v-banner
                single-line
                outlined
                rounded
                class="mt-8"
                v-else-if="error"
            >
                <v-icon slot="icon" color="red darken-3">mdi-close</v-icon>
                <div class="my-4">
                    <span class="text-body-1 red--text text--darken-3">{{
                        error
                    }}</span>
                </div>
            </v-banner>
        </div>

        <div class="d-flex justify-space-between flex-row-reverse">
            <v-btn
                color="primary"
                @click="$emit('nextStep')"
                :disabled="$root.$data.zipBlob === null"
                >Next <v-icon dark right>mdi-arrow-right</v-icon></v-btn
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
        releaseIndex: undefined,
        latestReleases: undefined,
        downloadProgress: null,
        downloading: false,
        error: null,
    }),

    watch: {
        active: async function (newState) {
            if (newState && this.releaseIndex === undefined) {
                let indexResp = await fetch("/releases/index.json");
                this.releaseIndex = await indexResp.json();
            }

            this.latestReleases = this.releaseIndex.latest[
                this.$root.$data.product
            ];
        },
    },

    methods: {
        async download(release) {
            this.downloadProgress = 0;
            this.downloading = true;
            this.$root.$data.release = null;

            try {
                await this.blobStore.init();
                let blob = await this.blobStore.download(
                    release.url,
                    (progress) => {
                        this.downloadProgress = progress * 100;
                    }
                );

                this.downloadProgress = 100;
                this.$root.$data.zipBlob = blob;
                this.$root.$data.release = release;
                this.error = null;
            } catch (e) {
                this.error = e.message;
                this.downloadProgress = null;
                throw e;
            } finally {
                this.downloading = false;
            }
        },
    },
};
</script>
