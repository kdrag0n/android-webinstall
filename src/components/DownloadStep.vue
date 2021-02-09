<template>
    <v-container class="d-flex justify-space-between flex-column flex-grow-1">
        <div class="mt-n4">
            <h6 class="text-h6 pb-4">Download a build</h6>

            <div class="text-body-1">
                <p>
                    Pick a build of {{ $root.$data.OS_NAME }} to download and
                    install.
                </p>
            </div>
        </div>

        <v-skeleton-loader
            v-if="latestReleases === null"
            type="article, actions"
        ></v-skeleton-loader>
        <div class="text-center" v-else-if="latestReleases === undefined">
            <p class="text-h5 red--text text--darken-3">
                Your device isn’t supported
            </p>
            <p class="text-body-1">We only support these devices:</p>

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
        </div>
        <div v-else class="d-flex flex-wrap justify-space-around">
            <v-card
                v-for="release in latestReleases"
                :key="release.url"
                outlined
                max-width="16rem"
                class="ma-4 d-flex flex-column"
                ripple
                :color="
                    downloadingRelease === release ? 'grey lighten-4' : null
                "
                :class="
                    downloadingRelease === release ? 'v-card--selected' : null
                "
                :disabled="downloading"
                @click="download(release)"
            >
                <v-card-title>{{ release.version }}</v-card-title>
                <v-card-subtitle>{{
                    $root.$data.RELEASE_VARIANTS[release.variant].description
                }}</v-card-subtitle>
            </v-card>
        </div>

        <div>
            <v-banner
                single-line
                outlined
                rounded
                v-if="downloadProgress >= 100"
            >
                <v-icon slot="icon" color="green darken-3">mdi-check</v-icon>
                <div class="my-4">
                    <span class="text-body-1 green--text text--darken-3"
                        >Downloaded {{ $root.$data.OS_NAME }}
                        {{ $root.$data.release.version }}-{{
                            $root.$data.release.variant
                        }}</span
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
                @click="$bubble('nextStep')"
                :disabled="$root.$data.zipBlob === null"
                >Next <v-icon dark right>mdi-arrow-right</v-icon></v-btn
            >
            <v-btn text @click="$bubble('prevStep')">Back</v-btn>
        </div>
    </v-container>
</template>

<style>
.theme--light.v-sheet--outlined {
    border-width: 2px;
}

.theme--light.v-sheet--outlined.v-card--selected {
    border: 2px solid rgba(0, 0, 0, 0.77) !important;
}
</style>

<script>
export default {
    name: "DownloadStep",

    props: ["device", "blobStore", "active"],

    data: () => ({
        releaseIndex: undefined,
        latestReleases: null,
        downloadProgress: null,
        downloadingRelease: null,
        downloading: false,
        firstDownload: true,
        error: null,
    }),

    watch: {
        active: async function (newState) {
            if (newState) {
                this.saEvent("step_download");

                if (this.releaseIndex === undefined) {
                    let indexResp = await fetch("/releases/index.json");
                    this.releaseIndex = await indexResp.json();
                }

                this.latestReleases = this.releaseIndex.latest[
                    this.$root.$data.product
                ];
            }
        },
    },

    methods: {
        async errorRetry() {
            await this.download(this.$root.$data.release);
        },

        async download(release) {
            this.$root.$data.release = release;
            this.downloadProgress = 0;
            this.downloading = true;
            this.downloadingRelease = release;

            try {
                this.saEvent(
                    `download_build__${this.$root.$data.product}_${release.version}_${release.variant}`
                );
                await this.blobStore.init();
                let blob = await this.blobStore.download(
                    release.url,
                    (progress) => {
                        this.downloadProgress = progress * 100;
                    }
                );

                this.downloadProgress = 100;
                this.$root.$data.zipBlob = blob;
                this.error = null;

                if (this.firstDownload) {
                    this.firstDownload = false;
                    this.$bubble("nextStep");
                }
            } catch (e) {
                this.downloadProgress = null;

                let [handled, message] = this.bubbleError(e);
                this.error = message;
                if (!handled) {
                    throw e;
                }
            } finally {
                this.downloading = false;
            }
        },
    },
};
</script>
