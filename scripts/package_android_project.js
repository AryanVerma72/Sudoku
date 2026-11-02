import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function packageAndroid() {
  const rootDir = path.resolve('.');
  const distDir = path.resolve('dist');

  if (!fs.existsSync(distDir)) {
    console.error('dist/ does not exist. Please run npm run build first.');
    process.exit(1);
  }

  const zip = new JSZip();
  const folder = zip.folder('ZenSudoku-Android');

  // 1. settings.gradle
  folder.file(
    'settings.gradle',
    `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "ZenSudoku"
include ':app'
`
  );

  // 2. build.gradle (root)
  folder.file(
    'build.gradle',
    `plugins {
    id 'com.android.application' version '8.2.2' apply false
    id 'org.jetbrains.kotlin.android' version '1.9.22' apply false
}
`
  );

  // 3. gradle.properties
  folder.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
`
  );

  // 4. app/build.gradle
  folder.file(
    'app/build.gradle',
    `plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    namespace 'com.zensudoku.app'
    compileSdk 34

    defaultConfig {
        applicationId "com.zensudoku.app"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = '1.8'
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.webkit:webkit:1.10.0'
}
`
  );

  // 5. app/src/main/AndroidManifest.xml
  folder.file(
    'app/src/main/AndroidManifest.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="ZenSudoku"
        android:roundIcon="@mipmap/ic_launcher"
        android:supportsRtl="true"
        android:theme="@style/Theme.ZenSudoku">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:theme="@style/Theme.ZenSudoku.Fullscreen">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`
  );

  // 6. app/src/main/java/com/zensudoku/app/MainActivity.kt
  folder.file(
    'app/src/main/java/com/zensudoku/app/MainActivity.kt',
    `package com.zensudoku.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.View
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Hide status bar for clean fullscreen Android experience
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
        )

        webView = WebView(this)
        setContentView(webView)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            cacheMode = WebSettings.LOAD_DEFAULT
            useWideViewPort = true
            loadWithOverviewMode = true
            mediaPlaybackRequiresUserGesture = false
        }

        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()

        // Load the embedded high-speed offline bundle
        webView.loadUrl("file:///android_asset/index.html")
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
`
  );

  // 7. app/src/main/res/values/strings.xml
  folder.file(
    'app/src/main/res/values/strings.xml',
    `<resources>
    <string name="app_name">ZenSudoku</string>
</resources>
`
  );

  // 8. app/src/main/res/values/themes.xml
  folder.file(
    'app/src/main/res/values/themes.xml',
    `<resources>
    <style name="Theme.ZenSudoku" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="android:statusBarColor">#F8F8F6</item>
        <item name="android:navigationBarColor">#F8F8F6</item>
        <item name="android:windowLightStatusBar">true</item>
    </style>
    <style name="Theme.ZenSudoku.Fullscreen" parent="Theme.ZenSudoku">
        <item name="android:windowFullscreen">false</item>
    </style>
</resources>
`
  );

  // 9. Icons
  const iconPath = path.resolve('public/pwa-512x512.png');
  if (fs.existsSync(iconPath)) {
    const iconData = fs.readFileSync(iconPath);
    folder.file('app/src/main/res/mipmap/ic_launcher.png', iconData);
  }

  // 10. Assets (offline dist web files)
  function addDirToZip(zipFolder, currentPath, relPath = '') {
    const items = fs.readdirSync(currentPath);
    for (const item of items) {
      if (item.endsWith('.apk') || item.endsWith('.zip')) continue;
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subFolder = zipFolder.folder(item);
        addDirToZip(subFolder, fullPath, path.join(relPath, item));
      } else {
        const data = fs.readFileSync(fullPath);
        zipFolder.file(item, data);
      }
    }
  }

  const assetsFolder = folder.folder('app/src/main/assets');
  addDirToZip(assetsFolder, distDir);

  // Generate ZIP
  console.log('Generating ZenSudoku-Android-Project.zip...');
  const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const outZipPath = path.resolve('public/ZenSudoku-Android-Project.zip');
  fs.writeFileSync(outZipPath, content);
  console.log('Successfully created public/ZenSudoku-Android-Project.zip (' + (content.length / 1024 / 1024).toFixed(2) + ' MB)');
}

packageAndroid().catch(console.error);
