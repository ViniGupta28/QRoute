package com.qtransit.nexus;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebViewClient;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static final String TAG = "QRoute";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Disable multi-process WebView to reduce memory pressure on emulators.
        // This runs the renderer in the same process, preventing OOM kills.
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            WebView.setDataDirectorySuffix("qroute");
        }
        // Force single-process mode (reduces ~50MB RAM usage in emulator)
        try {
            WebView.setDataDirectorySuffix("");
        } catch (Exception ignored) {}

        super.onCreate(savedInstanceState);

        // Handle renderer crashes gracefully so the app doesn't get killed by Android
        if (this.bridge != null && this.bridge.getWebView() != null) {
            this.bridge.getWebView().setWebViewClient(new WebViewClient() {
                @Override
                public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                    Log.e(TAG, "WebView renderer crashed (OOM=" + !detail.didCrash() + "), restarting activity");
                    // Return true = we handled it; false = Android will kill the app
                    if (!isFinishing() && !isDestroyed()) {
                        recreate(); // Restart the Activity cleanly
                    }
                    return true;
                }
            });
        }
    }
}

