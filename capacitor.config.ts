
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.wordlens',
  appName: 'WordLens Insight Engine',
  webDir: 'dist',
  server: {
    // Production URL - update this when you have your custom domain
    url: 'https://wordlens.app',
    cleartext: false, // Force HTTPS in production
    allowNavigation: [
      'https://wordlens.app',
      'https://ccmyjrgrdymwraiuauoq.supabase.co'
    ]
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
      splashImageSource: 'icon-512.png',
      splashImageSourceDark: 'icon-512.png'
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
    },
    App: {
      launchUrl: 'https://wordlens.app'
    }
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    backgroundColor: '#ffffff',
    icon: 'public/icon-1024.png'
  },
  android: {
    backgroundColor: '#ffffff',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // Disable in production
    icon: 'public/icon-512.png',
    adaptiveIcon: {
      foreground: 'public/icon-512.png',
      background: '#3b82f6'
    }
  }
};

export default config;
