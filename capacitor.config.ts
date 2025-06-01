
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.83239b5384804243b2ddd190bf041317',
  appName: 'wordlens-theme-tracker',
  webDir: 'dist',
  server: {
    url: 'https://83239b53-8480-4243-b2dd-d190bf041317.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3b82f6',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#ffffff'
    }
  }
};

export default config;
