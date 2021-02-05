import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import Config from "./config";
import * as common from "./core/common";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

Vue.config.productionTip = false;

Vue.mixin({
    methods: {
        saEvent: common.logEvent,
    },
});

if (
    process.env.VUE_APP_SENTRY_DSN !== undefined &&
    process.env.NODE_ENV === "production"
) {
    Sentry.init({
        Vue,
        dsn: process.env.VUE_APP_SENTRY_DSN,
        integrations: [new Integrations.BrowserTracing()],
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
        ...Config,
    },
    render: (h) => h(App),
}).$mount("#app");
