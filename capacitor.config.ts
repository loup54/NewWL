
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
    },
    App: {
      launchUrl: 'https://wordlens.app'
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
    webContentsDebuggingEnabled: false, // Disable in production
    icon: '/lovable-uploads/4db86d95-a95b-4027-a4b8-0ef0dbf7a9bb.png',
    adaptiveIcon: {
      foreground: '/lovable-uploads/4db86d95-a95b-4027-a4b8-0ef0dbf7a9bb.png',
      background: '#3b82f6'
    }
  }
};

export default config;
