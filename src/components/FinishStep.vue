<template>
    <v-container>
        <div class="mb-10">
            <span class="headline mb-1">Installation complete</span>

            <div class="text-body-1">
                <p>
                    Congratulations! Your
                    {{ $root.$data.DEVICE_NAMES[$root.$data.product] }} is now running
                    {{ $root.$data.OS_NAME }} {{ $root.$data.osVersion }}.
                </p>
                <p><strong>Enjoy!</strong></p>
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
