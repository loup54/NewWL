import { useEffect, useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

const SESSION_WARNING_TIME = 5 * 60 * 1000; // 5 minutes before expiry
const SESSION_CHECK_INTERVAL = 60 * 1000; // Check every minute

export const useSessionManagement = () => {
  const { session, user } = useAuth();
  const [sessionWarningShown, setSessionWarningShown] = useState(false);

  const refreshSession = useCallback(async () => {
    try {
      const { error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Session refresh error:', error);
        toast({
          title: "Session Error",
          description: "Unable to refresh your session. Please sign in again.",
          variant: "destructive",
        });
      } else {
        console.log('Session refreshed successfully');
        setSessionWarningShown(false);
      }
    } catch (error) {
      console.error('Session refresh exception:', error);
    }
  }, []);

  const checkSessionExpiry = useCallback(() => {
    if (!session?.expires_at) return;

    const expiryTime = new Date(session.expires_at * 1000).getTime();
    const currentTime = Date.now();
    const timeUntilExpiry = expiryTime - currentTime;

    // Show warning if session expires within 5 minutes
    if (timeUntilExpiry <= SESSION_WARNING_TIME && timeUntilExpiry > 0 && !sessionWarningShown) {
      setSessionWarningShown(true);
      
      toast({
        title: "Session Expiring Soon",
        description: "Your session will expire in a few minutes. Click to extend.",
        action: <ToastAction altText="Extend Session" onClick={refreshSession}>Extend Session</ToastAction>,
      });
    }

    // Auto-refresh if session is about to expire (within 1 minute)
    if (timeUntilExpiry <= 60000 && timeUntilExpiry > 0) {
      refreshSession();
    }
  }, [session, sessionWarningShown, refreshSession]);

  useEffect(() => {
    if (!user || !session) return;

    const interval = setInterval(checkSessionExpiry, SESSION_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [user, session, checkSessionExpiry]);

  // Handle visibility change to sync sessions across tabs
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        // Check if session is still valid when tab becomes visible
        setTimeout(() => {
          checkSessionExpiry();
        }, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user, checkSessionExpiry]);

  return {
    refreshSession,
    sessionWarningShown,
  };
};
