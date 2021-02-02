<template>
    <v-container>
        <v-skeleton-loader v-if="latestReleases === null"
          type="article, actions"
        ></v-skeleton-loader>

        <template v-else>
            <v-card outlined v-for="release in latestReleases" :key="release.url">
                <v-card-title>{{ release.version }}</v-card-title>
                <v-card-subtitle>{{ release.variant }}</v-card-subtitle>

                <v-card-actions>
                    <v-btn outlined text @click="download(release)">Download</v-btn>
                </v-card-actions>
            </v-card>
        </template>

        <v-progress-linear v-if="downloadProgress !== null"
            buffer-value="0"
            :value="downloadProgress"
            stream
        ></v-progress-linear>
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
            let blob = await this.blobStore.download(release.url, (progress) => {
                this.downloadProgress = progress * 100;
            });
            this.downloadProgress = 100;

            this.$root.$data.zipBlob = blob;
        },
    },
};
</script>
