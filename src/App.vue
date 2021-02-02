<template>
    <v-app id="inspire">
        <v-app-bar app color="white" flat>
            <v-container class="py-0 fill-height">
                <v-avatar
                    class="mr-10"
                    color="grey darken-1"
                    size="32"
                ></v-avatar>

                <v-btn v-for="link in links" :key="link" text>
                    {{ link }}
                </v-btn>
            </v-container>
        </v-app-bar>

        <v-main class="grey lighten-3">
            <v-container>
                <v-row>
                    <v-col cols="12" sm="2"> </v-col>

                    <v-col cols="12" sm="8">
                        <v-sheet min-height="70vh" rounded="lg">
                            <!--  -->
                        </v-sheet>
                    </v-col>

                    <v-col cols="12" sm="2"> </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: "App",

    components: {},

    data: () => ({
        links: ["Home", "Install"],
    }),
};
</script>
