module.exports = {
    publicPath:
        process.env.NODE_ENV === "production"
            ? "/ii/android-webinstall"
            : "/",
    transpileDependencies: ["vuetify"],
    chainWebpack: (config) => {
        config.plugin("html").tap((args) => {
            args[0].title = `${process.env.VUE_APP_OS_NAME} web installer`;
            args[0].osName = process.env.VUE_APP_OS_NAME;
            args[0].osDesc = process.env.VUE_APP_OS_DESC;
            args[0].analyticsDomain = process.env.VUE_APP_SA_DOMAIN;
            return args;
        });
    },
};
