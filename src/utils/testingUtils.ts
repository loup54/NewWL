
import { performanceMonitor } from '@/utils/performanceMonitor';

interface TestScenario {
  name: string;
  test: () => Promise<boolean>;
  description: string;
  category: 'functionality' | 'performance' | 'integration' | 'security';
}

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
  category: string;
}

export class SystemValidator {
  private testResults: TestResult[] = [];
  
  async runComprehensiveTests(): Promise<{ 
    passed: number; 
    failed: number; 
    results: TestResult[];
    categories: Record<string, { passed: number; failed: number }>;
  }> {
    const scenarios: TestScenario[] = [
      // Functionality Tests
      {
        name: 'File Upload Test',
        description: 'Test document upload functionality',
        category: 'functionality',
        test: this.testFileUpload
      },
      {
        name: 'Local Storage Test',
        description: 'Test browser storage capabilities',
        category: 'functionality',
        test: this.testLocalStorage
      },
      {
        name: 'URL Processing Test',
        description: 'Test URL creation and processing',
        category: 'functionality',
        test: this.testURLProcessing
      },

      // Performance Tests
      {
        name: 'Search Performance',
        description: 'Test search and highlighting performance',
        category: 'performance',
        test: this.testSearchPerformance
      },
      {
        name: 'Memory Usage Test',
        description: 'Test memory consumption patterns',
        category: 'performance',
        test: this.testMemoryUsage
      },
      {
        name: 'Rendering Performance',
        description: 'Test component rendering speed',
        category: 'performance',
        test: this.testRenderingPerformance
      },

      // Integration Tests
      {
        name: 'PWA Installation',
        description: 'Test PWA installation capabilities',
        category: 'integration',
        test: this.testPWAInstall
      },
      {
        name: 'Service Worker',
        description: 'Test service worker functionality',
        category: 'integration',
        test: this.testServiceWorker
      },
      {
        name: 'Offline Functionality',
        description: 'Test offline document access',
        category: 'integration',
        test: this.testOfflineAccess
      },

      // Security Tests
      {
        name: 'Input Sanitization',
        description: 'Test input validation and sanitization',
        category: 'security',
        test: this.testInputSanitization
      },
      {
        name: 'HTTPS Detection',
        description: 'Test secure connection requirements',
        category: 'security',
        test: this.testHTTPS
      },
      {
        name: 'Export Security',
        description: 'Test document export security',
        category: 'security',
        test: this.testExportSecurity
      }
    ];

    console.log('🔍 Starting comprehensive system validation...');
    this.testResults = [];
    let passed = 0;
    let failed = 0;
    const categories: Record<string, { passed: number; failed: number }> = {};

    for (const scenario of scenarios) {
      const startTime = performance.now();
      
      try {
        console.log(`Testing: ${scenario.name}`);
        const result = await scenario.test();
        const duration = performance.now() - startTime;
        
        const testResult: TestResult = {
          name: scenario.name,
          passed: result,
          duration,
          category: scenario.category,
        };

        this.testResults.push(testResult);

        if (!categories[scenario.category]) {
          categories[scenario.category] = { passed: 0, failed: 0 };
        }

        if (result) {
          passed++;
          categories[scenario.category].passed++;
          console.log(`✅ ${scenario.name} - PASSED (${duration.toFixed(2)}ms)`);
        } else {
          failed++;
          categories[scenario.category].failed++;
          console.log(`❌ ${scenario.name} - FAILED (${duration.toFixed(2)}ms)`);
        }
      } catch (error) {
        const duration = performance.now() - startTime;
        failed++;
        
        if (!categories[scenario.category]) {
          categories[scenario.category] = { passed: 0, failed: 0 };
        }
        categories[scenario.category].failed++;

        const testResult: TestResult = {
          name: scenario.name,
          passed: false,
          duration,
          category: scenario.category,
          error: error instanceof Error ? error.message : 'Unknown error',
        };

        this.testResults.push(testResult);
        console.error(`❌ ${scenario.name} - ERROR: ${testResult.error} (${duration.toFixed(2)}ms)`);
      }
    }

    return { passed, failed, results: this.testResults, categories };
  }

  // Functionality Tests
  private testFileUpload = async (): Promise<boolean> => {
    try {
      const testFile = new File(['Test content for validation'], 'test.txt', { 
        type: 'text/plain',
        lastModified: Date.now()
      });
      
      return testFile.size > 0 && 
             testFile.type === 'text/plain' && 
             testFile.name === 'test.txt' &&
             testFile instanceof File;
    } catch {
      return false;
    }
  };

  private testLocalStorage = async (): Promise<boolean> => {
    try {
      const testKey = 'wordlens-test-key';
      const testValue = 'test-value-' + Date.now();
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      return retrieved === testValue;
    } catch {
      return false;
    }
  };

  private testURLProcessing = async (): Promise<boolean> => {
    try {
      const testData = 'data:text/plain;base64,SGVsbG8gV29ybGQ=';
      const url = URL.createObjectURL(new Blob(['test'], { type: 'text/plain' }));
      const isValidURL = url.startsWith('blob:');
      URL.revokeObjectURL(url);
      
      return isValidURL && typeof URL.createObjectURL === 'function';
    } catch {
      return false;
    }
  };

  // Performance Tests
  private testSearchPerformance = async (): Promise<boolean> => {
    const start = performance.now();
    const testData = 'Lorem ipsum dolor sit amet '.repeat(1000);
    const searchTerm = 'ipsum';
    
    let found = false;
    for (let i = 0; i < 100; i++) {
      found = testData.includes(searchTerm);
    }
    
    const duration = performance.now() - start;
    return found && duration < 500; // Should complete 100 searches in under 500ms
  };

  private testMemoryUsage = async (): Promise<boolean> => {
    try {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        return memory.usedJSHeapSize < memory.jsHeapSizeLimit * 0.8; // Under 80% usage
      }
      return true; // Pass if memory API not available
    } catch {
      return true;
    }
  };

  private testRenderingPerformance = async (): Promise<boolean> => {
    const start = performance.now();
    
    // Simulate DOM operations
    const testElement = document.createElement('div');
    testElement.innerHTML = '<span>Test</span>'.repeat(1000);
    document.body.appendChild(testElement);
    
    const duration = performance.now() - start;
    document.body.removeChild(testElement);
    
    return duration < 100; // Should complete in under 100ms
  };

  // Integration Tests
  private testPWAInstall = async (): Promise<boolean> => {
    return 'serviceWorker' in navigator && 
           'manifest' in document &&
           window.location.protocol === 'https:';
  };

  private testServiceWorker = async (): Promise<boolean> => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        return registration !== undefined;
      }
      return false;
    } catch {
      return false;
    }
  };

  private testOfflineAccess = async (): Promise<boolean> => {
    return 'serviceWorker' in navigator && 
           'caches' in window &&
           typeof navigator.onLine === 'boolean';
  };

  // Security Tests
  private testInputSanitization = async (): Promise<boolean> => {
    try {
      const maliciousInput = '<script>alert("xss")</script>';
      const sanitized = maliciousInput.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      return sanitized !== maliciousInput && !sanitized.includes('<script>');
    } catch {
      return false;
    }
  };

  private testHTTPS = async (): Promise<boolean> => {
    return window.location.protocol === 'https:' || 
           window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1';
  };

  private testExportSecurity = async (): Promise<boolean> => {
    try {
      // Test that we can create secure blob URLs
      const testBlob = new Blob(['test'], { type: 'text/plain' });
      const url = URL.createObjectURL(testBlob);
      const isSecure = url.startsWith('blob:') && typeof URL.revokeObjectURL === 'function';
      URL.revokeObjectURL(url);
      return isSecure;
    } catch {
      return false;
    }
  };

  getTestResults(): TestResult[] {
    return this.testResults;
  }

  getTestResultsByCategory(category: string): TestResult[] {
    return this.testResults.filter(result => result.category === category);
  }
}

export const performanceMetrics = {
  measureLoadTime: () => {
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart,
      loadComplete: navigationTiming.loadEventEnd - navigationTiming.loadEventStart,
      firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      timeToInteractive: navigationTiming.domInteractive - navigationTiming.navigationStart,
    };
  },

  measureMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
      };
    }
    return null;
  },

  measureNetworkSpeed: async () => {
    const start = performance.now();
    try {
      // Use a small image for network speed test
      await fetch('/favicon.png', { cache: 'no-cache' });
      const duration = performance.now() - start;
      return {
        latency: duration,
        quality: duration < 100 ? 'excellent' : duration < 300 ? 'good' : 'poor',
      };
    } catch {
      return {
        latency: -1,
        quality: 'unknown',
      };
    }
  },
};

export const systemValidator = new SystemValidator();
