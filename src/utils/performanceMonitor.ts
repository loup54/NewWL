
import config from './environment';

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(label: string): void {
    if (config.isDevelopment) {
      console.time(label);
    }
    this.metrics.set(`${label}_start`, performance.now());
  }

  endTiming(label: string): number {
    const startTime = this.metrics.get(`${label}_start`);
    if (!startTime) {
      console.warn(`No start time found for ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.set(`${label}_duration`, duration);

    if (config.isDevelopment) {
      console.timeEnd(label);
      console.log(`${label} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  measureDocumentProcessing<T>(fn: () => T, label: string = 'document-processing'): T {
    this.startTiming(label);
    try {
      const result = fn();
      this.endTiming(label);
      return result;
    } catch (error) {
      this.endTiming(label);
      throw error;
    }
  }

  async measureAsyncOperation<T>(
    fn: () => Promise<T>, 
    label: string = 'async-operation'
  ): Promise<T> {
    this.startTiming(label);
    try {
      const result = await fn();
      this.endTiming(label);
      return result;
    } catch (error) {
      this.endTiming(label);
      throw error;
    }
  }

  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  logPerformanceReport(): void {
    if (config.isDevelopment) {
      console.group('Performance Report');
      console.table(this.getMetrics());
      console.groupEnd();
    }
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
