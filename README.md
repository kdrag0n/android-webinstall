# Android web installer

This is an easy-to-use web installer for Android-based operating systems that runs entirely in the browser. It uses WebUSB, which is supported by Chromium and its derivatives, and my [fastboot.js](https://github.com/kdrag0n/fastboot.js) library for flashing. This allows it to work on computers and Android devices software with no additional software or command-line tools.

If you have a device officially supported by [ProtonAOSP](https://github.com/ProtonAOSP), you can try flashing it with the official instance of this web installer at [ProtonAOSP web installer](https://protonaosp.kdrag0n.dev/install/web/).

![Screenshot of an install in progress on a desktop computer](https://user-images.githubusercontent.com/7930239/107443954-9638d600-6aee-11eb-9848-5d0502fecfa9.png)

## Install process

The following screenshots show the entire installation process, from start to finish:

### Desktop

![Step: Prepare your device](https://user-images.githubusercontent.com/7930239/107443939-90db8b80-6aee-11eb-88e6-a6bb6625ec1f.png)
![Step: Choose an install type](https://user-images.githubusercontent.com/7930239/107443941-920cb880-6aee-11eb-829c-a4d876d72c28.png)
![Step: Connect your device](https://user-images.githubusercontent.com/7930239/107445466-56272280-6af1-11eb-925b-fe6d3cffc05b.png)
![Step: Unlock your bootloader](https://user-images.githubusercontent.com/7930239/107443949-946f1280-6aee-11eb-83d5-7b2f0f597ee2.png)
![Step: Download a build](https://user-images.githubusercontent.com/7930239/107443952-95a03f80-6aee-11eb-9528-15e3e0e996b3.png)
![Step: Install ProtonAOSP](https://user-images.githubusercontent.com/7930239/107443954-9638d600-6aee-11eb-9848-5d0502fecfa9.png)
![Step: Installation complete](https://user-images.githubusercontent.com/7930239/107443959-96d16c80-6aee-11eb-9424-a4acd7db2b7c.png)

## Adapting for other ROMs

By default, this installer is configured for the ProtonAOSP production environment, but it was built with reusability in mind. It can be adapted to other ROM projects with only configuration changes.

You can start with the following Yarn commands:

- `yarn install`
- `yarn serve`
- `yarn build`
- `yarn lint`

All configuration is in `src/config.js` and `.env`, and the release index at `public/releases/index.json` is fetched from the root of the domain hosting the installer. You may also want to change the favicon at `public/favicon.png`.

## Contributing

Contributions are welcome! If you adapt this installer or make other improvements to it, please contribute the improvements back to the official repository instead of forking it and keeping the changes to yourself. There are many rough edges that need to be improved upon.
