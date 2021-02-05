<template>
    <v-app id="inspire">
        <v-main class="grey lighten-3">
            <v-container fill-height>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="2"></v-col>

                    <v-col cols="12" sm="8" class="d-flex flex-row justify-center">
                        <v-sheet
                            :min-height="
                                $vuetify.breakpoint.mobile ? '100vh' : '75vh'
                            "
                            width="50rem"
                            :rounded="$vuetify.breakpoint.mobile ? null : 'lg'"
                            :elevation="$vuetify.breakpoint.mobile ? 0 : 4"
                            class="d-flex flex-column"
                        >
                            <Installer />
                        </v-sheet>
                    </v-col>

                    <v-col cols="12" sm="2"></v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<style>
.col-xl,
.col-xl-auto,
.col-xl-12,
.col-xl-11,
.col-xl-10,
.col-xl-9,
.col-xl-8,
.col-xl-7,
.col-xl-6,
.col-xl-5,
.col-xl-4,
.col-xl-3,
.col-xl-2,
.col-xl-1,
.col-lg,
.col-lg-auto,
.col-lg-12,
.col-lg-11,
.col-lg-10,
.col-lg-9,
.col-lg-8,
.col-lg-7,
.col-lg-6,
.col-lg-5,
.col-lg-4,
.col-lg-3,
.col-lg-2,
.col-lg-1,
.col-md,
.col-md-auto,
.col-md-12,
.col-md-11,
.col-md-10,
.col-md-9,
.col-md-8,
.col-md-7,
.col-md-6,
.col-md-5,
.col-md-4,
.col-md-3,
.col-md-2,
.col-md-1,
.col-sm,
.col-sm-auto,
.col-sm-12,
.col-sm-11,
.col-sm-10,
.col-sm-9,
.col-sm-8,
.col-sm-7,
.col-sm-6,
.col-sm-5,
.col-sm-4,
.col-sm-3,
.col-sm-2,
.col-sm-1,
.col,
.col-auto,
.col-12,
.col-11,
.col-10,
.col-9,
.col-8,
.col-7,
.col-6,
.col-5,
.col-4,
.col-3,
.col-2,
.col-1 {
    padding: 0 !important;
}
</style>

<script>
import Installer from "./components/Installer";

export default {
    name: "App",

    components: {
        Installer,
    },

    data: () => ({
        links: ["Home", "Install"],
    }),
};
</script>
