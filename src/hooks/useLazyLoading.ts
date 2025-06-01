
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useLazyLoading = (options: UseLazyLoadingOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  const { threshold = 0.1, rootMargin = '50px' } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, hasLoaded]);

  return { elementRef, isVisible, hasLoaded };
};

export const useVirtualScroll = <T>(
  items: T[],
  containerHeight: number,
  itemHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);

  const visibleStartIndex = Math.floor(scrollTop / itemHeight);
  const visibleEndIndex = Math.min(
    visibleStartIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length - 1
  );

  const visibleItems = items.slice(visibleStartIndex, visibleEndIndex + 1);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStartIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    setContainerRef,
    visibleStartIndex,
    visibleEndIndex
  };
};

export const useImageLazyLoading = () => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const loadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (loadedImages.has(src)) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(src));
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }, [loadedImages]);

  return { loadImage, isImageLoaded: (src: string) => loadedImages.has(src) };
};
