import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

new Vue({
    vuetify,
    data: {
        product: null,
        zipBlob: null,
        osVersion: null,
        OS_NAME: "ProtonAOSP",
        SUPPORTED_DEVICES: [
            {
                name: "Pixel 2",
                model: "walleye",
            },
            {
                name: "Pixel 2 XL",
                model: "taimen",
            },
            {
                name: "Pixel 4a 5G",
                model: "bramble",
            },
            {
                name: "Pixel 5",
                model: "redfin",
            },
        ],
        RELEASE_VARIANTS: {
            minimal: "Minimal version without Google apps or services.",
            gapps:
                "Version with Google services included, so the apps you’re familiar with will work. Recommended for most users.",
        },
    },
    render: (h) => h(App),
}).$mount("#app");
