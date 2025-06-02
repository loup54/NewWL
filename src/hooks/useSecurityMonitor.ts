
import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { securityMonitor, logSecurityEvent } from '@/utils/securityMonitor';
import { rateLimiters } from '@/utils/rateLimiter';
import { toast } from '@/hooks/use-toast';

export const useSecurityMonitor = () => {
  const { user } = useAuth();

  const checkRateLimit = useCallback((action: string, identifier?: string) => {
    const userId = identifier || user?.id || 'anonymous';
    
    let rateLimiter;
    switch (action) {
      case 'auth':
        rateLimiter = rateLimiters.auth;
        break;
      case 'voucher_generation':
        rateLimiter = rateLimiters.voucherGeneration;
        break;
      case 'voucher_redemption':
        rateLimiter = rateLimiters.voucherRedemption;
        break;
      case 'payment':
        rateLimiter = rateLimiters.payment;
        break;
      default:
        return { allowed: true };
    }

    const result = rateLimiter.checkLimit(userId);
    
    if (!result.allowed) {
      logSecurityEvent.rateLimitExceeded(userId, action, rateLimiter.config?.maxRequests || 0);
      
      toast({
        title: "Rate Limit Exceeded",
        description: "Too many requests. Please wait before trying again.",
        variant: "destructive",
      });
    }

    return result;
  }, [user]);

  const logUserAction = useCallback((action: string, details: Record<string, any> = {}) => {
    if (!user?.id) return;

    switch (action) {
      case 'login_success':
        logSecurityEvent.loginAttempt(user.id, true, details);
        break;
      case 'login_failure':
        logSecurityEvent.loginAttempt(user.id, false, details);
        break;
      case 'voucher_generated':
        logSecurityEvent.voucherGeneration(user.id, details.codeCount || 1, true);
        break;
      case 'voucher_redeemed':
        logSecurityEvent.voucherRedemption(user.id, details.code || '', details.success || false, details.error);
        break;
      case 'payment_attempt':
        logSecurityEvent.paymentAttempt(user.id, details.amount || 0, details.success || false, details);
        break;
      default:
        console.warn('Unknown security action:', action);
    }
  }, [user]);

  const getSecuritySummary = useCallback(() => {
    return securityMonitor.getSecuritySummary(user?.id);
  }, [user]);

  return {
    checkRateLimit,
    logUserAction,
    getSecuritySummary,
  };
};
