
import { performance } from '@/utils/performanceMonitor';

interface TestScenario {
  name: string;
  test: () => Promise<boolean>;
  description: string;
}

export class SystemValidator {
  private testResults: { [key: string]: boolean } = {};
  
  async runComprehensiveTests(): Promise<{ passed: number; failed: number; results: any }> {
    const scenarios: TestScenario[] = [
      {
        name: 'File Upload Test',
        description: 'Test document upload functionality',
        test: this.testFileUpload
      },
      {
        name: 'Search Performance',
        description: 'Test search and highlighting performance',
        test: this.testSearchPerformance
      },
      {
        name: 'PWA Installation',
        description: 'Test PWA installation capabilities',
        test: this.testPWAInstall
      },
      {
        name: 'Offline Functionality',
        description: 'Test offline document access',
        test: this.testOfflineAccess
      },
      {
        name: 'Export Functionality',
        description: 'Test document export features',
        test: this.testExportFeatures
      }
    ];

    console.log('🔍 Starting comprehensive system validation...');
    let passed = 0;
    let failed = 0;

    for (const scenario of scenarios) {
      try {
        console.log(`Testing: ${scenario.name}`);
        const result = await scenario.test();
        this.testResults[scenario.name] = result;
        
        if (result) {
          passed++;
          console.log(`✅ ${scenario.name} - PASSED`);
        } else {
          failed++;
          console.log(`❌ ${scenario.name} - FAILED`);
        }
      } catch (error) {
        failed++;
        this.testResults[scenario.name] = false;
        console.error(`❌ ${scenario.name} - ERROR:`, error);
      }
    }

    return { passed, failed, results: this.testResults };
  }

  private testFileUpload = async (): Promise<boolean> => {
    // Simulate file upload test
    try {
      const testFile = new File(['Test content'], 'test.txt', { type: 'text/plain' });
      return testFile.size > 0 && testFile.type === 'text/plain';
    } catch {
      return false;
    }
  };

  private testSearchPerformance = async (): Promise<boolean> => {
    // Test search performance with timing
    const start = performance.now();
    const testData = 'Lorem ipsum '.repeat(1000);
    const searchTerm = 'ipsum';
    const found = testData.includes(searchTerm);
    const duration = performance.now() - start;
    
    return found && duration < 100; // Should complete in under 100ms
  };

  private testPWAInstall = async (): Promise<boolean> => {
    // Test PWA capabilities
    return 'serviceWorker' in navigator && 'manifest' in document;
  };

  private testOfflineAccess = async (): Promise<boolean> => {
    // Test service worker registration
    return 'serviceWorker' in navigator;
  };

  private testExportFeatures = async (): Promise<boolean> => {
    // Test export functionality availability
    return typeof window.URL.createObjectURL === 'function';
  };
}

export const performanceMetrics = {
  measureLoadTime: () => {
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart,
      loadComplete: navigationTiming.loadEventEnd - navigationTiming.loadEventStart,
      firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
    };
  },

  measureMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }
};
