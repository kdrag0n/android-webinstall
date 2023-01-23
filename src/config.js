export default {
    OS_NAME: process.env.VUE_APP_OS_NAME,
    ACCENT_COLOR: "#0366d6",
    SUPPORTED_DEVICES: [
        // {
        //     name: "Pixel 4",
        //     model: "flame",
        // },
        // {
        //     name: "Pixel 4 XL",
        //     model: "coral",
        // },
        // {
        //     name: "Pixel 4a 5G",
        //     model: "bramble",
        // },
        // {
        //     name: "Pixel 5",
        //     model: "redfin",
        // },
        // {
        //     name: "Pixel 6",
        //     model: "oriole",
        // },
        // {
        //     name: "Pixel 6 Pro",
        //     model: "raven",
        // },
        {
            name: "Pixel 6a",
            model: "bluejay",
        }
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
        test: {
            description: "Experimental version for testing only.",
            suffix: "experimental",
        },
        beta: {
            description: "Beta version for testing only.",
            suffix: "beta",
        },
    },
    DONATION_LINKS: [
        {
            title: "Recurring donation",
            description:
                "Please consider making a recurring donation on Patreon for benefits such as early access to updates, exclusive behind-the-scenes development news, and priority support. This allows us to support the project sustainably in the future.",
            highlight: true,
            url: "https://patreon.com/kdrag0n",
            icon: "patreon",
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
};
