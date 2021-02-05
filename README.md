# Android web installer

This is an easy-to-use web installer for Android-based operating systems that runs entirely in the browser. It uses WebUSB, which is supported by Chromium and its derivatives, and my [fastboot.js](https://github.com/kdrag0n/fastboot.js) library for flashing. This allows it to work on computers and Android devices software with no additional software or command-line tools.

If you have a device officially supported by [ProtonAOSP](https://github.com/ProtonAOSP), you can try flashing it with the official instance of this web installer at [ProtonAOSP web installer](https://protonaosp.kdrag0n.dev/install/web/).

![Screenshot of an install in progress on a desktop computer](https://user-images.githubusercontent.com/7930239/106990006-3f1ab600-6728-11eb-96a8-d1da5c60fbbf.png)

## Install process

The following screenshots show the entire installation process, from start to finish:

### Desktop

![Step 0](https://user-images.githubusercontent.com/7930239/106990511-4098ae00-6729-11eb-9393-7c8381a1a135.png)
![Step 1](https://user-images.githubusercontent.com/7930239/106990512-41314480-6729-11eb-95f0-e5ebd62863c8.png)
![Step 2](https://user-images.githubusercontent.com/7930239/106990517-42627180-6729-11eb-886b-4a7e50a7a780.png)
![Step 3](https://user-images.githubusercontent.com/7930239/106990520-42fb0800-6729-11eb-906a-76a9dd8df301.png)
![Step 4](https://user-images.githubusercontent.com/7930239/106990521-43939e80-6729-11eb-8bfd-fcc9d62e4d0b.png)
![Step 5](https://user-images.githubusercontent.com/7930239/106990523-442c3500-6729-11eb-9bd7-99931ba6224e.png)

## Adapting for other ROMs

By default, this installer is configured for the ProtonAOSP production environment. It is built to be reusable for other projects with only configuration changes, but documentation isn't available yet. There are also more components that need to be separated and refactored for more reusability.

You can start with the following Yarn commands:

- `yarn install`
- `yarn serve`
- `yarn build`
- `yarn lint`

The crux of the configuration is currently in `src/main.js`, and the release index at `public/releases/index.json` is fetched from the root of the domain hosting the installer.

It's possible to adapt this for other ROMs in its current state, but I would recommend waiting for that use case to be better supported officially before doing so.

## Contributing

Contributions are welcome! If you adapt this installer or make other improvements to it, please contribute the improvements back to the official repository instead of forking it and keeping the changes to yourself. There are many rough edges that need to be improved upon.
