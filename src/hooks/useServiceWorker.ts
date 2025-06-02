
import { useState, useEffect } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isUpdateAvailable: boolean;
  isOffline: boolean;
  registration: ServiceWorkerRegistration | null;
}

export const useServiceWorker = () => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isRegistered: false,
    isUpdateAvailable: false,
    isOffline: !navigator.onLine,
    registration: null
  });

  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOffline: false }));
    const handleOffline = () => setState(prev => ({ ...prev, isOffline: true }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!state.isSupported) return;

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        setState(prev => ({
          ...prev,
          isRegistered: true,
          registration
        }));

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, isUpdateAvailable: true }));
              }
            });
          }
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    registerServiceWorker();
  }, [state.isSupported]);

  const updateServiceWorker = async () => {
    if (state.registration) {
      const newWorker = state.registration.waiting;
      if (newWorker) {
        newWorker.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  };

  const unregisterServiceWorker = async () => {
    if (state.registration) {
      await state.registration.unregister();
      setState(prev => ({
        ...prev,
        isRegistered: false,
        registration: null
      }));
    }
  };

  return {
    ...state,
    updateServiceWorker,
    unregisterServiceWorker
  };
};
