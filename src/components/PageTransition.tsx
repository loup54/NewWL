
import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`animate-fade-in ${className}`}>
    {children}
  </div>
);

export const SlideTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`animate-slide-in-right ${className}`}>
    {children}
  </div>
);

export const ScaleTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`animate-scale-in ${className}`}>
    {children}
  </div>
);
