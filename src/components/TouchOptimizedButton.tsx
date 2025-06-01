
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TouchOptimizedButtonProps extends ButtonProps {
  touchTarget?: 'small' | 'medium' | 'large';
}

export const TouchOptimizedButton: React.FC<TouchOptimizedButtonProps> = ({
  className,
  touchTarget = 'medium',
  children,
  ...props
}) => {
  const touchSizes = {
    small: 'min-h-[44px] min-w-[44px] px-4 py-2',
    medium: 'min-h-[48px] min-w-[48px] px-6 py-3',
    large: 'min-h-[56px] min-w-[56px] px-8 py-4'
  };

  return (
    <Button
      className={cn(
        'touch-manipulation select-none active:scale-95 transition-transform',
        touchSizes[touchTarget],
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};
