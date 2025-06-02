
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.83239b5384804243b2ddd190bf041317',
  appName: 'wordlens-theme-tracker',
  webDir: 'dist',
  server: {
    url: 'https://83239b53-8480-4243-b2dd-d190bf041317.lovableproject.com',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3b82f6',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff',
      splashFullScreen: true,
      splashImmersive: true,
      splashImageSource: '/lovable-uploads/4db86d95-a95b-4027-a4b8-0ef0dbf7a9bb.png',
      splashImageSourceDark: '/lovable-uploads/4db86d95-a95b-4027-a4b8-0ef0dbf7a9bb.png'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#ffffff',
      overlay: false
    },
    Keyboard: {
      resize: 'ionic',
      style: 'dark',
      resizeOnFullScreen: true
    }
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    backgroundColor: '#ffffff',
    icon: '/lovable-uploads/a302bbe2-3648-416f-9636-28183914d117.png'
  },
  android: {
    backgroundColor: '#ffffff',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    icon: '/lovable-uploads/4db86d95-a95b-4027-a4b8-0ef0dbf7a9bb.png',
    adaptiveIcon: {
      foreground: '/lovable-uploads/4db86d95-a95b-4027-a4b8-0ef0dbf7a9bb.png',
      background: '#3b82f6'
    }
  }
};

export default config;
