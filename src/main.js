import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import SimpleAnalytics from "simple-analytics-vue";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

Vue.config.productionTip = false;

if (process.env.VUE_APP_SA_DOMAIN !== undefined) {
    Vue.use(SimpleAnalytics, {
        skip: process.env.NODE_ENV !== "production",
        domain: process.env.VUE_APP_SA_DOMAIN,
    });
}

if (process.env.VUE_APP_SENTRY_DSN !== undefined) {
    Sentry.init({
        Vue,
        dsn: process.env.VUE_APP_SENTRY_DSN,
        integrations: [
            new Integrations.BrowserTracing(),
        ],
        tracesSampleRate: 1.0,
        attachProps: true,
        logErrors: true,
    });
}

new Vue({
    vuetify,
    data: {
        product: null,
        zipBlob: null,
        release: null,
        installType: null,
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
            minimal: {
                description: "Minimal version without Google apps or services.",
                suffix: "",
            },
            gapps: {
                description:
                    "Version with Google services included, so the apps you’re familiar with will work. Recommended for most users.",
                suffix: " with Google services",
            },
        },
        DONATION_LINKS: [
            {
                title: "Recurring donation",
                description:
                    "If you are able to, please consider making a recurring donation through Liberapay. This allows us to support the project sustainably in the future.",
                highlight: true,
                url: "https://liberapay.com/kdrag0n/",
                icon: "liberapay",
            },
            {
                title: "One-time donation",
                description:
                    "You can also make a one-time donation through PayPal. It doesn’t help with sustainable support, but every little bit is appreciated!",
                highlight: false,
                url: "https://paypal.me/kdrag0ndonate",
                icon: "paypal",
            },
        ],
    },
    render: (h) => h(App),
}).$mount("#app");
