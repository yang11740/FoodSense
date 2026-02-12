# FoodSense Android App Design

  This is a code bundle for FoodSense Android App Design. The original project is available at https://www.figma.com/design/hF9UeIvqDGc6rC1rzZGKYZ/FoodSense-Android-App-Design.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## Packaging as Desktop Application (Electron)

  This project is configured to be packaged as a desktop application using Electron.

  1.  Ensure dependencies are installed:
      ```bash
      npm install
      ```
  2.  To run the desktop application in development mode:
      ```bash
      npm run electron:dev
      ```
  3.  To build the final executable (e.g., .exe for Windows):
      ```bash
      npm run electron:build
      ```
      The output executable will be located in the `dist_electron` directory.

## Packaging as Android App

  To convert this project into an Android app, we use **Capacitor**.

  1.  **Prerequisites**:
      *   Install [Android Studio](https://developer.android.com/studio).
      *   Ensure `npm install` has been run.

  2.  **Generate the Android Project**:
      Run the following command to build the web assets and sync them to the Android project:
      ```bash
      npm run android
      ```
      This command will:
      *   Build the Vite project.
      *   Copy the assets to the `android/` folder.
      *   Try to open the project in Android Studio.

  3.  **Build APK**:
      *   In Android Studio, verify the build executes correctly.
      *   Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
      *   Once finished, locate the APK file (usually in `android/app/build/outputs/apk/debug/app-debug.apk`) to install on your phone.
