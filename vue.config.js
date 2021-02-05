const OS_NAME = "ProtonAOSP";
const OS_DESC =
    "a minimal custom Android ROM focused on UI/UX and performance with a touch of privacy";
const SA_DOMAIN = "api.protonaosp.kdrag0n.dev";
const PROD_URL = "https://protonaosp.kdrag0n.dev/install/web/";

module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? PROD_URL : "/",
    transpileDependencies: ["vuetify"],
    chainWebpack: (config) => {
        config.plugin("html").tap((args) => {
            args[0].title = `${OS_NAME} web installer`;
            args[0].analyticsDomain = SA_DOMAIN;
            args[0].osName = OS_NAME;
            args[0].osDesc = OS_DESC;
            return args;
        });
    },
};
