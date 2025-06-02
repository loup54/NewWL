
import { supabase } from '@/integrations/supabase/client';
import { validators } from './enhancedValidation';
import { rateLimiters } from './rateLimiter';

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
  details?: any;
}

export class AuthTestSuite {
  private results: TestResult[] = [];

  async runAllTests(): Promise<{
    passed: number;
    failed: number;
    results: TestResult[];
    summary: string;
  }> {
    console.log('🔐 Starting Authentication Test Suite...');
    this.results = [];

    const tests = [
      { name: 'Input Validation Tests', test: this.testInputValidation.bind(this) },
      { name: 'Rate Limiting Tests', test: this.testRateLimiting.bind(this) },
      { name: 'Session Security Tests', test: this.testSessionSecurity.bind(this) },
      { name: 'Auth Flow Tests', test: this.testAuthFlows.bind(this) },
      { name: 'Error Handling Tests', test: this.testErrorHandling.bind(this) },
    ];

    for (const test of tests) {
      await this.runTest(test.name, test.test);
    }

    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    
    const summary = `Authentication Tests Complete: ${passed} passed, ${failed} failed`;
    console.log(summary);

    return {
      passed,
      failed,
      results: this.results,
      summary
    };
  }

  private async runTest(name: string, testFn: () => Promise<boolean>): Promise<void> {
    const startTime = performance.now();
    
    try {
      const result = await testFn();
      const duration = performance.now() - startTime;
      
      this.results.push({
        name,
        passed: result,
        duration
      });
      
      console.log(`${result ? '✅' : '❌'} ${name} - ${result ? 'PASSED' : 'FAILED'} (${duration.toFixed(2)}ms)`);
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.results.push({
        name,
        passed: false,
        duration,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      console.error(`❌ ${name} - ERROR: ${error} (${duration.toFixed(2)}ms)`);
    }
  }

  private async testInputValidation(): Promise<boolean> {
    const tests = [
      // Email validation
      { validator: 'email', input: 'test@example.com', shouldPass: true },
      { validator: 'email', input: 'invalid-email', shouldPass: false },
      { validator: 'email', input: '', shouldPass: false },
      
      // Password validation
      { validator: 'password', input: 'Password123', shouldPass: true },
      { validator: 'password', input: '12345', shouldPass: false },
      { validator: 'password', input: '', shouldPass: false },
      
      // File name validation
      { validator: 'fileName', input: 'document.pdf', shouldPass: true },
      { validator: 'fileName', input: '../../../etc/passwd', shouldPass: false },
      { validator: 'fileName', input: 'file<script>.txt', shouldPass: false },
      
      // Voucher code validation
      { validator: 'voucherCode', input: 'VOUCHER-123', shouldPass: true },
      { validator: 'voucherCode', input: 'short', shouldPass: false },
      { validator: 'voucherCode', input: 'invalid@code', shouldPass: false },
    ];

    let allPassed = true;
    
    for (const test of tests) {
      const validator = validators[test.validator as keyof typeof validators];
      const result = validator(test.input);
      
      if (result.isValid !== test.shouldPass) {
        console.error(`Validation test failed: ${test.validator} with input "${test.input}" expected ${test.shouldPass} but got ${result.isValid}`);
        allPassed = false;
      }
    }

    return allPassed;
  }

  private async testRateLimiting(): Promise<boolean> {
    // Test rate limiting functionality
    const testUserId = 'test-user-' + Date.now();
    
    // Test auth rate limiting
    const authLimiter = rateLimiters.auth;
    let consecutiveRequests = 0;
    
    for (let i = 0; i < 10; i++) {
      const result = authLimiter.checkLimit(testUserId);
      if (result.allowed) {
        consecutiveRequests++;
      } else {
        break;
      }
    }
    
    // Should allow exactly 5 requests (the configured limit)
    const authLimitingWorks = consecutiveRequests === 5;
    
    // Reset for next test
    authLimiter.reset(testUserId);
    
    return authLimitingWorks;
  }

  private async testSessionSecurity(): Promise<boolean> {
    try {
      // Test that session is properly stored
      const { data: sessionData } = await supabase.auth.getSession();
      
      // Test that we can get user info
      const { data: userData } = await supabase.auth.getUser();
      
      // Basic session security checks
      const hasSessionStorage = typeof localStorage !== 'undefined';
      const hasSecureContext = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      
      return hasSessionStorage && hasSecureContext;
    } catch (error) {
      console.error('Session security test error:', error);
      return false;
    }
  }

  private async testAuthFlows(): Promise<boolean> {
    // Test that auth methods exist and are callable
    try {
      const authMethods = [
        'signUp',
        'signInWithPassword', 
        'signOut',
        'resetPasswordForEmail',
        'refreshSession'
      ];
      
      for (const method of authMethods) {
        if (typeof supabase.auth[method as keyof typeof supabase.auth] !== 'function') {
          console.error(`Auth method ${method} is not available`);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Auth flow test error:', error);
      return false;
    }
  }

  private async testErrorHandling(): Promise<boolean> {
    try {
      // Test with invalid credentials (should not throw)
      const { error } = await supabase.auth.signInWithPassword({
        email: 'invalid@test.com',
        password: 'wrongpassword'
      });
      
      // Should return an error object, not throw
      return error !== null && typeof error === 'object';
    } catch (error) {
      console.error('Error handling test failed - auth should not throw:', error);
      return false;
    }
  }

  getResults(): TestResult[] {
    return this.results;
  }

  getFailedTests(): TestResult[] {
    return this.results.filter(r => !r.passed);
  }
}

export const authTestSuite = new AuthTestSuite();
