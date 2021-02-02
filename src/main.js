import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

new Vue({
    vuetify,
    data: {
        product: null,
        serial: null,
        zipBlob: null,
    },
    render: (h) => h(App),
}).$mount("#app");
