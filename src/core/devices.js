const DEVICE_NAMES = {
    sailfish: "Pixel",
    marlin: "Pixel XL",
    walleye: "Pixel 2",
    taimen: "Pixel 2 XL",
    blueline: "Pixel 3",
    crosshatch: "Pixel 3 XL",
    sargo: "Pixel 3a",
    bonito: "Pixel 3a XL",
    flame: "Pixel 4",
    coral: "Pixel 4 XL",
    sunfish: "Pixel 4a",
    bramble: "Pixel 4a 5G",
    redfin: "Pixel 5",
};

export function getDeviceName(device) {
    return device in DEVICE_NAMES ? DEVICE_NAMES[device] : device;
}
