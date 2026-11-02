#!/bin/bash
set -e

ROOT_DIR="$(pwd)"

echo "=== Building Direct ZenSudoku APK ==="

BUILD_DIR="/tmp/apk_build"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/src/com/zensudoku/app"
mkdir -p "$BUILD_DIR/res/values"
mkdir -p "$BUILD_DIR/res/mipmap-hdpi"
mkdir -p "$BUILD_DIR/classes"

# 1. AndroidManifest.xml
cat << 'EOF' > "$BUILD_DIR/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.zensudoku.app"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="33" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:label="ZenSudoku"
        android:icon="@mipmap/ic_launcher"
        android:theme="@android:style/Theme.NoTitleBar">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

# 2. strings.xml
cat << 'EOF' > "$BUILD_DIR/res/values/strings.xml"
<resources>
    <string name="app_name">ZenSudoku</string>
</resources>
EOF

# 3. Copy icon
cp public/pwa-192x192.png "$BUILD_DIR/res/mipmap-hdpi/ic_launcher.png"

# 4. Java Activity
cat << 'EOF' > "$BUILD_DIR/src/com/zensudoku/app/MainActivity.java"
package com.zensudoku.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.Window;
import android.view.WindowManager;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.setBackgroundColor(0xFFF8F8F6);
        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());

        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
EOF

# 5. Compile Java with Java 8 compatibility for dx
javac -source 1.8 -target 1.8 -cp /tmp/android.jar -d "$BUILD_DIR/classes" "$BUILD_DIR/src/com/zensudoku/app/MainActivity.java"

# 6. Convert to classes.dex
/usr/bin/dalvik-exchange --dex --output="$BUILD_DIR/classes.dex" "$BUILD_DIR/classes"

# 7. Package initial APK with aapt (clean assets without recursive APK/ZIP files)
CLEAN_ASSETS="$BUILD_DIR/assets"
mkdir -p "$CLEAN_ASSETS"
cp -r "$ROOT_DIR/dist/"* "$CLEAN_ASSETS/"
rm -f "$CLEAN_ASSETS"/*.apk "$CLEAN_ASSETS"/*.zip

aapt package -f \
    -M "$BUILD_DIR/AndroidManifest.xml" \
    -S "$BUILD_DIR/res" \
    -I /tmp/android.jar \
    -A "$CLEAN_ASSETS" \
    -F "$BUILD_DIR/unaligned.apk"

# 8. Add classes.dex
cd "$BUILD_DIR"
aapt add unaligned.apk classes.dex

# 9. Zipalign
zipalign -f -p 4 "$BUILD_DIR/unaligned.apk" "$BUILD_DIR/aligned.apk"

# 10. Generate Keystore if not exists
KEYSTORE="/tmp/release.keystore"
if [ ! -f "$KEYSTORE" ]; then
    keytool -genkey -v -keystore "$KEYSTORE" -alias zensudoku \
        -keyalg RSA -keysize 2048 -validity 10000 \
        -storepass zensudoku123 -keypass zensudoku123 \
        -dname "CN=ZenSudoku, OU=Mobile, O=ZenSudoku, L=Global, ST=Earth, C=US"
fi

# 11. Sign APK
mkdir -p "$ROOT_DIR/public"
apksigner sign --ks "$KEYSTORE" --ks-pass pass:zensudoku123 --out "$ROOT_DIR/public/ZenSudoku.apk" "$BUILD_DIR/aligned.apk"
cp "$ROOT_DIR/public/ZenSudoku.apk" "$ROOT_DIR/ZenSudoku.apk"

# 12. Verify
apksigner verify "$ROOT_DIR/public/ZenSudoku.apk"
echo "SUCCESS! ZenSudoku.apk built and signed at public/ZenSudoku.apk and ZenSudoku.apk"
ls -lh "$ROOT_DIR/ZenSudoku.apk" "$ROOT_DIR/public/ZenSudoku.apk"
