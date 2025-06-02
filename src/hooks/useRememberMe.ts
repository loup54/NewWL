
import { useState, useEffect } from 'react';

const REMEMBER_ME_KEY = 'wordlens_remember_me';
const REMEMBERED_EMAIL_KEY = 'wordlens_remembered_email';

export const useRememberMe = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [rememberedEmail, setRememberedEmail] = useState('');

  useEffect(() => {
    // Load remember me preference and email on mount
    const savedRememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY) || '';
    
    setRememberMe(savedRememberMe);
    if (savedRememberMe) {
      setRememberedEmail(savedEmail);
    }
  }, []);

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
    localStorage.setItem(REMEMBER_ME_KEY, checked.toString());
    
    if (!checked) {
      // Clear remembered email if remember me is disabled
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      setRememberedEmail('');
    }
  };

  const saveEmailIfRemembered = (email: string) => {
    if (rememberMe) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
      setRememberedEmail(email);
    }
  };

  const clearRememberedData = () => {
    localStorage.removeItem(REMEMBER_ME_KEY);
    localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    setRememberMe(false);
    setRememberedEmail('');
  };

  return {
    rememberMe,
    rememberedEmail,
    handleRememberMeChange,
    saveEmailIfRemembered,
    clearRememberedData,
  };
};
