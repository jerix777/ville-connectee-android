import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.villeconnectee.app',
  appName: 'Ville Connectée',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#ffffff',
      overlaysWebView: false
    },
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
