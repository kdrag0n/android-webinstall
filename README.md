# Android web installer

This is an easy-to-use web installer for Android-based operating systems that runs entirely in the browser. It uses WebUSB, which is supported by Chromium and its derivatives, and my [fastboot.js](https://github.com/kdrag0n/fastboot.js) library for flashing. This allows it to work on computers and Android devices software with no additional software or command-line tools.

If you have a device officially supported by [ProtonAOSP](https://github.com/ProtonAOSP), you can try flashing it with the official instance of this web installer at [ProtonAOSP web installer](https://protonaosp.kdrag0n.dev/install/web/?utm_source=github&utm_campaign=android-webinstall).

![Screenshot of an install in progress on a desktop computer](https://user-images.githubusercontent.com/7930239/107459937-10c41e80-6b0c-11eb-8fbc-6882145f164f.png)

## Install process

The following screenshots show the entire installation process, from start to finish:

### Desktop

![Step: Prepare your device](https://user-images.githubusercontent.com/7930239/107459556-516f6800-6b0b-11eb-93b6-a3726c1d6256.png)
![Step: Choose an install type](https://user-images.githubusercontent.com/7930239/107459558-5207fe80-6b0b-11eb-80b7-5597e640bb0c.png)
![Step: Connect your device](https://user-images.githubusercontent.com/7930239/107459568-56341c00-6b0b-11eb-9f44-2760d873c8d7.png)
![Step: Unlock your bootloader](https://user-images.githubusercontent.com/7930239/107459571-57654900-6b0b-11eb-9a6e-1b83a9c8bb7b.png)
![Step: Download a build](https://user-images.githubusercontent.com/7930239/107459576-57fddf80-6b0b-11eb-82cb-731b35c6a10b.png)
![Step: Install ProtonAOSP](https://user-images.githubusercontent.com/7930239/107459937-10c41e80-6b0c-11eb-8fbc-6882145f164f.png)
![Step: Installation complete](https://user-images.githubusercontent.com/7930239/107459580-59c7a300-6b0b-11eb-831f-8d55e7c4c5ef.png)

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
