import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import Config from "./config";
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
