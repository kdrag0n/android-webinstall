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
        DEVICE_NAMES: {
            sailfish: "Pixel",
            marlin: "Pixel XL",
            walleye: "Pixel 2",
            taimen: "Pixel 2 XL",
            blueline: "Pixel 3",
            crosshatch: "Pixel 3 XL",
            sargo: "Pixel 3a",
            bonito: "Pixel 3a XL",
            flame: "Pixel 4",
            coral: "Pixel 4 XL",
            sunfish: "Pixel 4a",
            bramble: "Pixel 4a 5G",
            redfin: "Pixel 5",
        },
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
