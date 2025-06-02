
import { performanceMonitor } from './performanceUtils';

interface OptimizationConfig {
  enableVirtualization: boolean;
  enableLazyLoading: boolean;
  enableCaching: boolean;
  maxCacheSize: number;
  debounceDelay: number;
}

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private config: OptimizationConfig;
  private observer: IntersectionObserver | null = null;

  private constructor() {
    this.config = {
      enableVirtualization: true,
      enableLazyLoading: true,
      enableCaching: true,
      maxCacheSize: 100,
      debounceDelay: 300
    };
    this.initializeObserver();
  }

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  private initializeObserver(): void {
    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const element = entry.target as HTMLElement;
              const callback = element.dataset.lazyCallback;
              if (callback && (window as any)[callback]) {
                (window as any)[callback]();
                this.observer?.unobserve(element);
              }
            }
          });
        },
        { threshold: 0.1, rootMargin: '50px' }
      );
    }
  }

  optimizeComponent<T extends React.ComponentType<any>>(
    Component: T,
    options: Partial<OptimizationConfig> = {}
  ): T {
    const config = { ...this.config, ...options };
    
    return React.memo(Component, (prevProps, nextProps) => {
      // Custom comparison logic for performance
      const keys = Object.keys(nextProps);
      return keys.every(key => prevProps[key] === nextProps[key]);
    }) as T;
  }

  measureComponentRender<T>(
    Component: React.ComponentType<T>,
    displayName: string
  ): React.ComponentType<T> {
    const MeasuredComponent = (props: T) => {
      React.useEffect(() => {
        performanceMonitor.startTiming(`${displayName}-render`);
        return () => {
          performanceMonitor.endTiming(`${displayName}-render`);
        };
      });

      return React.createElement(Component, props);
    };

    MeasuredComponent.displayName = `Measured(${displayName})`;
    return MeasuredComponent;
  }

  observeForLazyLoading(element: HTMLElement, callback: string): void {
    if (this.observer && this.config.enableLazyLoading) {
      element.dataset.lazyCallback = callback;
      this.observer.observe(element);
    }
  }

  updateConfig(newConfig: Partial<OptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getOptimizationReport(): {
    config: OptimizationConfig;
    metrics: Record<string, any>;
  } {
    return {
      config: this.config,
      metrics: performanceMonitor.getMetrics()
    };
  }
}

export const performanceOptimizer = PerformanceOptimizer.getInstance();
