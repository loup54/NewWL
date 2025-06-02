
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es' | 'fr' | 'de';
  documentView: 'compact' | 'comfortable' | 'spacious';
  autoSave: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  privacy: {
    analytics: boolean;
    crashReports: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  documentView: 'comfortable',
  autoSave: true,
  notifications: {
    email: true,
    push: false,
    inApp: true,
  },
  privacy: {
    analytics: true,
    crashReports: true,
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
  },
};

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  isLoading: boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = () => {
      setIsLoading(true);
      try {
        const storageKey = user?.id ? `user-preferences-${user.id}` : 'user-preferences-guest';
        const stored = localStorage.getItem(storageKey);
        
        if (stored) {
          const parsedPreferences = JSON.parse(stored);
          setPreferences({ ...defaultPreferences, ...parsedPreferences });
        } else {
          setPreferences(defaultPreferences);
        }
      } catch (error) {
        console.error('Failed to load user preferences:', error);
        setPreferences(defaultPreferences);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);

    try {
      const storageKey = user?.id ? `user-preferences-${user.id}` : 'user-preferences-guest';
      localStorage.setItem(storageKey, JSON.stringify(newPreferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    try {
      const storageKey = user?.id ? `user-preferences-${user.id}` : 'user-preferences-guest';
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to reset user preferences:', error);
    }
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        resetPreferences,
        isLoading,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
