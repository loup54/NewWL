
import { useState, useEffect, useCallback, useMemo } from 'react';
import { performanceOptimizer } from '@/utils/performanceOptimizer';
import { performanceMonitor } from '@/utils/performanceUtils';

export const usePerformanceOptimization = (componentName: string) => {
  const [isOptimized, setIsOptimized] = useState(false);
  const [metrics, setMetrics] = useState<Record<string, any>>({});

  useEffect(() => {
    performanceMonitor.startTiming(`${componentName}-mount`);
    setIsOptimized(true);

    return () => {
      performanceMonitor.endTiming(`${componentName}-mount`);
    };
  }, [componentName]);

  const trackOperation = useCallback((operationName: string, operation: () => void) => {
    performanceMonitor.startTiming(`${componentName}-${operationName}`);
    operation();
    performanceMonitor.endTiming(`${componentName}-${operationName}`);
  }, [componentName]);

  const getPerformanceReport = useCallback(() => {
    const report = performanceOptimizer.getOptimizationReport();
    setMetrics(report.metrics);
    return report;
  }, []);

  return {
    isOptimized,
    metrics,
    trackOperation,
    getPerformanceReport
  };
};

export const useMemorizedValue = <T>(
  computeValue: () => T,
  dependencies: React.DependencyList
): T => {
  return useMemo(() => {
    performanceMonitor.startTiming('memoized-computation');
    const result = computeValue();
    performanceMonitor.endTiming('memoized-computation');
    return result;
  }, dependencies);
};

export const useOptimizedState = <T>(
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] => {
  const [state, setState] = useState(initialValue);

  const optimizedSetState = useCallback((value: T | ((prev: T) => T)) => {
    setState(prev => {
      const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
      // Only update if value actually changed
      return Object.is(prev, newValue) ? prev : newValue;
    });
  }, []);

  return [state, optimizedSetState];
};
