<template>
    <v-container>
        <div class="mb-10 mt-n4">
            <h6 class="text-h6 pb-4">Installation complete</h6>

            <div class="text-body-1">
                <p>
                    Congratulations! Your
                    {{ $root.$data.DEVICE_NAMES[$root.$data.product] }} is now
                    running {{ $root.$data.OS_NAME }}
                    {{ $root.$data.release.version }}.
                </p>
                <p>
                    If you like {{ $root.$data.OS_NAME }}, please consider
                    donating to support development and cover maintenance costs:
                </p>
            </div>

            <div class="d-flex flex-wrap justify-space-around">
                <v-card
                    v-for="donation in $root.$data.DONATION_LINKS"
                    :key="donation.url"
                    outlined
                    max-width="16rem"
                    class="ma-4 d-flex flex-column justify-space-between"
                    ripple
                    :href="donation.url"
                >
                    <div>
                        <v-card-title class="mt-n2">
                            <v-icon
                                class="pr-2 py-2"
                                color="rgba(0, 0, 0, 0.87)"
                                >mdi-update</v-icon
                            >
                            {{ donation.title }}</v-card-title
                        >
                        <v-card-subtitle
                            >{{ donation.description }}
                        </v-card-subtitle>
                    </div>
                </v-card>
            </div>
        </div>

        <div class="d-flex justify-space-between">
            <v-btn text @click="$emit('prevStep')">Back</v-btn>
        </div>
    </v-container>
</template>

<script>
export default {
    name: "FinishStep",

    props: ["device", "blobStore", "active"],
};
</script>
