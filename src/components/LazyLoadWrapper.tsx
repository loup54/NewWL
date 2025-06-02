
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { LoadingState } from './LoadingStates';
import { useLazyLoading } from '@/hooks/useLazyLoading';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
}

export const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = '50px',
  onLoad
}) => {
  const { elementRef, isVisible } = useLazyLoading({ threshold, rootMargin });

  useEffect(() => {
    if (isVisible && onLoad) {
      onLoad();
    }
  }, [isVisible, onLoad]);

  return (
    <div ref={elementRef as React.RefObject<HTMLDivElement>}>
      {isVisible ? (
        <Suspense fallback={fallback || <LoadingState type="processing" message="Loading content..." />}>
          {children}
        </Suspense>
      ) : (
        fallback || <LoadingState type="processing" message="Loading content..." />
      )}
    </div>
  );
};

export const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}> = ({ src, alt, className, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { elementRef, isVisible } = useLazyLoading();

  useEffect(() => {
    if (isVisible && !isLoaded && !hasError) {
      const img = new Image();
      img.onload = () => {
        setIsLoaded(true);
        onLoad?.();
      };
      img.onerror = () => setHasError(true);
      img.src = src;
    }
  }, [isVisible, isLoaded, hasError, src, onLoad]);

  return (
    <div ref={elementRef as React.RefObject<HTMLDivElement>} className={className}>
      {isVisible && isLoaded && !hasError ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : hasError ? (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Failed to load</span>
        </div>
      ) : (
        <div className="w-full h-full bg-gray-100 animate-pulse" />
      )}
    </div>
  );
};
