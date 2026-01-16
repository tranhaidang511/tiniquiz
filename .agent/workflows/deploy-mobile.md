---
description: How to build and deploy the iOS and Android applications
---

This workflow describes the steps to build the web assets and deploy them to the iOS and Android native projects.

## Prerequisites

- **Android Studio** (for Android build)
- **Xcode** (for iOS build - macOS only)
- **CocoaPods** (for iOS dependencies)

## 1. Build Web Assets

First, you must build the web application to generate the `dist/` directory containing all game assets.

```bash
// turbo
npm run build
```

## 2. Sync with Native Projects

Copy the built web assets from `dist/` to the native iOS and Android project directories (`ios/` and `android/`). This also updates any native plugins.

```bash
// turbo
npx cap sync
```

## 3. Build & Run Android App

Open the project in Android Studio.

```bash
npx cap open android
```

**In Android Studio:**

1.  Wait for Gradle sync to finish.
2.  Select a device or emulator from the device dropdown.
3.  Click the **Run** button (green play icon) or press `Shift + F10`.

## 4. Build & Run iOS App (macOS only)

Open the project in Xcode.

```bash
npx cap open ios
```

**In Xcode:**

1.  Select a simulator or connected device from the scheme menu (top left).
2.  Click the **Run** button (play icon) or press `Cmd + R`.