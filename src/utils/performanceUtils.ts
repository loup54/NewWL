
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(label: string): void {
    performance.mark(`${label}-start`);
  }

  endTiming(label: string): number {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label, 'measure')[0];
    const duration = measure?.duration || 0;
    
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(duration);
    
    return duration;
  }

  getAverageTime(label: string): number {
    const times = this.metrics.get(label) || [];
    if (times.length === 0) return 0;
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  getMetrics(): Record<string, { average: number; count: number; total: number }> {
    const result: Record<string, { average: number; count: number; total: number }> = {};
    
    this.metrics.forEach((times, label) => {
      const total = times.reduce((sum, time) => sum + time, 0);
      result[label] = {
        average: total / times.length,
        count: times.length,
        total
      };
    });
    
    return result;
  }

  clearMetrics(): void {
    this.metrics.clear();
    performance.clearMarks();
    performance.clearMeasures();
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

export const withPerformanceTracking = <T extends (...args: any[]) => any>(
  fn: T,
  label: string
): T => {
  return ((...args: Parameters<T>) => {
    performanceMonitor.startTiming(label);
    const result = fn(...args);
    performanceMonitor.endTiming(label);
    return result;
  }) as T;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
};

export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};
