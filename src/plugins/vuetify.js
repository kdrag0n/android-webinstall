import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import Config from "../config";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: Config.ACCENT_COLOR,
            },
        },
    },
});
