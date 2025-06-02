export interface SecurityEvent {
  type: 'login_attempt' | 'voucher_generation' | 'voucher_redemption' | 'payment_attempt' | 'suspicious_activity' | 'rate_limit_exceeded' | 'validation_failure';
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details: Record<string, any>;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SuspiciousActivityPattern {
  pattern: string;
  threshold: number;
  timeWindowMs: number;
}

export class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000; // Keep last 1000 events in memory
  
  private suspiciousPatterns: SuspiciousActivityPattern[] = [
    { pattern: 'rapid_voucher_attempts', threshold: 10, timeWindowMs: 60000 }, // 10 attempts in 1 minute
    { pattern: 'multiple_payment_failures', threshold: 5, timeWindowMs: 300000 }, // 5 failures in 5 minutes
    { pattern: 'invalid_code_spam', threshold: 20, timeWindowMs: 300000 }, // 20 invalid codes in 5 minutes
  ];

  logEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now()
    };

    this.events.push(fullEvent);
    
    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Check for suspicious patterns
    this.detectSuspiciousActivity(fullEvent);

    // Log to console for development
    console.log('Security Event:', {
      type: fullEvent.type,
      severity: fullEvent.severity,
      userId: fullEvent.userId,
      timestamp: new Date(fullEvent.timestamp).toISOString(),
      details: fullEvent.details
    });

    // In production, you would send this to a logging service
    if (fullEvent.severity === 'critical') {
      this.handleCriticalEvent(fullEvent);
    }
  }

  private detectSuspiciousActivity(event: SecurityEvent): void {
    const now = Date.now();
    
    // Check rapid voucher generation attempts
    if (event.type === 'voucher_generation' || event.type === 'voucher_redemption') {
      const recentAttempts = this.events.filter(e => 
        (e.type === 'voucher_generation' || e.type === 'voucher_redemption') &&
        e.userId === event.userId &&
        now - e.timestamp < 60000
      ).length;

      if (recentAttempts >= 10) {
        this.logEvent({
          type: 'suspicious_activity',
          userId: event.userId,
          severity: 'high',
          details: {
            pattern: 'rapid_voucher_attempts',
            attemptCount: recentAttempts,
            timeWindow: '1 minute'
          }
        });
      }
    }

    // Check multiple payment failures
    if (event.type === 'payment_attempt' && event.details.success === false) {
      const recentFailures = this.events.filter(e => 
        e.type === 'payment_attempt' &&
        e.details.success === false &&
        e.userId === event.userId &&
        now - e.timestamp < 300000
      ).length;

      if (recentFailures >= 5) {
        this.logEvent({
          type: 'suspicious_activity',
          userId: event.userId,
          severity: 'high',
          details: {
            pattern: 'multiple_payment_failures',
            failureCount: recentFailures,
            timeWindow: '5 minutes'
          }
        });
      }
    }
  }

  private handleCriticalEvent(event: SecurityEvent): void {
    // In a production environment, this would:
    // 1. Send alerts to security team
    // 2. Potentially block the user temporarily
    // 3. Log to external security monitoring service
    console.error('CRITICAL SECURITY EVENT:', event);
  }

  getSecuritySummary(userId?: string): {
    totalEvents: number;
    recentEvents: SecurityEvent[];
    suspiciousActivityCount: number;
    criticalEventCount: number;
  } {
    const filteredEvents = userId 
      ? this.events.filter(e => e.userId === userId)
      : this.events;

    const last24Hours = Date.now() - (24 * 60 * 60 * 1000);
    const recentEvents = filteredEvents.filter(e => e.timestamp > last24Hours);

    return {
      totalEvents: filteredEvents.length,
      recentEvents: recentEvents.slice(-10), // Last 10 recent events
      suspiciousActivityCount: filteredEvents.filter(e => e.type === 'suspicious_activity').length,
      criticalEventCount: filteredEvents.filter(e => e.severity === 'critical').length
    };
  }

  exportAuditLog(startTime?: number, endTime?: number): SecurityEvent[] {
    const start = startTime || 0;
    const end = endTime || Date.now();
    
    return this.events.filter(e => 
      e.timestamp >= start && e.timestamp <= end
    ).sort((a, b) => b.timestamp - a.timestamp);
  }
}

// Singleton instance for global use
export const securityMonitor = new SecurityMonitor();

// Utility functions for common security events
export const logSecurityEvent = {
  loginAttempt: (userId: string, success: boolean, details: Record<string, any> = {}) => {
    securityMonitor.logEvent({
      type: 'login_attempt',
      userId,
      severity: success ? 'low' : 'medium',
      details: { success, ...details }
    });
  },

  voucherGeneration: (userId: string, codeCount: number, success: boolean) => {
    securityMonitor.logEvent({
      type: 'voucher_generation',
      userId,
      severity: 'medium',
      details: { codeCount, success }
    });
  },

  voucherRedemption: (userId: string, code: string, success: boolean, error?: string) => {
    securityMonitor.logEvent({
      type: 'voucher_redemption',
      userId,
      severity: success ? 'low' : 'medium',
      details: { code: code.substring(0, 8) + '...', success, error }
    });
  },

  paymentAttempt: (userId: string, amount: number, success: boolean, details: Record<string, any> = {}) => {
    securityMonitor.logEvent({
      type: 'payment_attempt',
      userId,
      severity: success ? 'low' : 'medium',
      details: { amount, success, ...details }
    });
  },

  rateLimitExceeded: (userId: string, endpoint: string, limit: number) => {
    securityMonitor.logEvent({
      type: 'rate_limit_exceeded',
      userId,
      severity: 'high',
      details: { endpoint, limit }
    });
  },

  validationFailure: (userId: string, field: string, value: any, error: string) => {
    securityMonitor.logEvent({
      type: 'validation_failure',
      userId,
      severity: 'medium',
      details: { field, value: typeof value === 'string' ? value.substring(0, 20) : value, error }
    });
  }
};
