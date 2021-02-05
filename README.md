# Android web installer

This is an easy-to-use web installer for Android-based operating systems that runs entirely in the browser. It uses WebUSB, which is supported by Chromium and its derivatives, and my [fastboot.js](https://github.com/kdrag0n/fastboot.js) library for flashing. This allows it to work on computers and Android devices software with no additional software or command-line tools.

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

### Mobile

![Step](https://user-images.githubusercontent.com/7930239/106990556-51e1ba80-6729-11eb-86ed-15df1e4857c9.png)
![Step](https://user-images.githubusercontent.com/7930239/106990563-54441480-6729-11eb-94b6-a9b502bf7015.png)
![Step](https://user-images.githubusercontent.com/7930239/106990566-55754180-6729-11eb-9878-96c32d5ce3ad.png)
![Step](https://user-images.githubusercontent.com/7930239/106990569-56a66e80-6729-11eb-90f9-c0d1ec048e05.png)
![Step](https://user-images.githubusercontent.com/7930239/106990574-59a15f00-6729-11eb-970c-3f916ea4c4a3.png)
![Step](https://user-images.githubusercontent.com/7930239/106990580-5ad28c00-6729-11eb-8d8f-2ef543361ed1.png)
![Step](https://user-images.githubusercontent.com/7930239/106990597-5f974000-6729-11eb-9c46-4b60e3466109.png)
![Step](https://user-images.githubusercontent.com/7930239/106990599-60c86d00-6729-11eb-934b-05c85a1c4c64.png)

## Adapting for other ROMs

By default, this installer is configured for the ProtonAOSP production environment. It is built to be reusable for other projects with only configuration changes, but documentation isn't available yet. There are also more components that need to be separated and refactored for more reusability.

You can start with the following Yarn commands:

- `yarn install`
- `yarn serve`
- `yarn build`
- `yarn lint`

The crux of the configuration is currently in `src/main.js`, and the release index at `public/releases/index.json` is fetched from the root of the domain hosting the installer.

It's possible to use this for other ROMs at this point, but I would recommend waiting for that use case to be better supported officially.

## Contributing

Contributions are welcome! If you adapt this installer or make other improvements to it, please contribute the improvements back to the official repository instead of forking it and keeping the changes to yourself. There are many rough edges that need to be improved upon.
