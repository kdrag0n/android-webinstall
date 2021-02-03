<template>
    <v-app id="inspire">
        <v-main class="grey lighten-3">
            <v-container fill-height>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="2"></v-col>

                    <v-col cols="12" sm="8">
                        <v-sheet min-height="70vh" rounded="lg" elevation="4">
                            <Installer />
                        </v-sheet>
                    </v-col>

                    <v-col cols="12" sm="2"></v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

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
