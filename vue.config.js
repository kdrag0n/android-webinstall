const OS_NAME = "ProtonAOSP";

module.exports = {
    transpileDependencies: ["vuetify"],
    chainWebpack: (config) => {
        config.plugin("html").tap((args) => {
            args[0].title = `${OS_NAME} web installer`;
            return args;
        });
    },
};
