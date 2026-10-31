# Apple-style Gallery (Expo / React Native)

## Run
    npm install
    npx expo install --fix      # aligns versions to your Expo SDK
    npx expo prebuild -p android && npx expo run:android   # dev build on a device/emulator

(Expo Go cannot grant full media-library access on Android, so use a dev build or the APK.)

## Build the APK (cloud, no Android Studio needed)
    npm i -g eas-cli
    eas login
    eas build -p android --profile preview     # outputs an installable .apk

## Build the APK locally (needs JDK 17 + Android SDK)
    npx expo prebuild -p android
    cd android && ./gradlew assembleRelease
    # -> android/app/build/outputs/apk/release/app-release.apk

## Easiest: build the APK with GitHub Actions (no local setup, no Expo account)
1. Create a new GitHub repo and push this folder to the `main` branch.
2. Open the repo > Actions > "Build Android APK" > Run workflow (it also runs on every push).
3. When it finishes (~10 min), download `Gallery-apk` from the run's Artifacts, unzip, and install `app-release.apk`.
Targets Android 13 (API 33+) devices including ColorOS 13; min Android 7.
