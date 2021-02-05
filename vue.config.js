const OS_NAME = "ProtonAOSP";
const SA_DOMAIN = "api.protonaosp.kdrag0n.dev";

module.exports = {
    transpileDependencies: ["vuetify"],
    chainWebpack: (config) => {
        config.plugin("html").tap((args) => {
            args[0].title = `${OS_NAME} web installer`;
            args[0].analyticsDomain = SA_DOMAIN;
            return args;
        });
    },
};
