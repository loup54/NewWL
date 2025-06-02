
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthErrorHandler } from '@/hooks/useAuthErrorHandler';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Mail, RefreshCw, CheckCircle } from 'lucide-react';

export const EmailVerification: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { handleAuthError } = useAuthErrorHandler();

  // Check if user email is already confirmed
  const isEmailConfirmed = user?.email_confirmed_at || user?.confirmed_at;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleResendVerification = async () => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "No email address found",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        handleAuthError(error);
      } else {
        toast({
          title: "Verification email sent",
          description: "Check your email for a new verification link.",
        });
        setCooldown(60); // 60 second cooldown
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (isEmailConfirmed) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Your email address has been verified.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-yellow-200 bg-yellow-50">
      <Mail className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        <div className="space-y-2">
          <p>Your email address ({user.email}) needs to be verified.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResendVerification}
            disabled={loading || cooldown > 0}
            className="bg-white hover:bg-gray-50"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {cooldown > 0 
              ? `Resend in ${cooldown}s` 
              : 'Resend verification email'
            }
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
