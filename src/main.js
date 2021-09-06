import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import Config from "./config";
import * as common from "./core/common";
import * as errors from "./core/errors";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

Vue.config.productionTip = false;

Vue.mixin({
    methods: {
        saEvent: common.logEvent,

        $bubble(event, ...args) {
            let component = this;
            do {
                component.$emit(event, ...args);
                component = component.$parent;
            } while (component);
        },

        bubbleError(err, retryCallback = undefined) {
            let errEvent = null;
            let errMessage = err.message;
            if (errors.isConnectSelectError(err)) {
                errEvent = "ConnectSelect";
                errMessage = "No device selected";
            } else if (errors.isConnectUdevError(err)) {
                errEvent = "ConnectUdev";
                errMessage = "Access denied";
            } else if (errors.isClaimError(err)) {
                errEvent = "Claim";
                errMessage = "Can’t control device";
            } else if (errors.isDisconnectError(err)) {
                errEvent = "Disconnect";
                errMessage = "Device disconnected";
            } else if (errors.isStorageError(err)) {
                errEvent = "Storage";
                errMessage = "Out of storage";
            } else if (errors.isMemoryError(err)) {
                errEvent = "Memory";
                errMessage = "Out of memory";
            } else if (errors.isTimeoutError(err)) {
                errEvent = "Timeout";
                errMessage = "Device is stuck";
            }

            if (errEvent !== null) {
                if ("handleSelfError" in this) {
                    this.handleSelfError(
                        `error${errEvent}`,
                        retryCallback || this.errorRetry
                    );
                }

                this.$bubble(
                    `error${errEvent}`,
                    retryCallback || this.errorRetry
                );
            }

            return [errEvent !== null, errMessage];
        },
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
