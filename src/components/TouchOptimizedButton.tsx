
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TouchOptimizedButtonProps extends ButtonProps {
  touchTarget?: 'small' | 'medium' | 'large';
  hapticFeedback?: boolean;
}

export const TouchOptimizedButton: React.FC<TouchOptimizedButtonProps> = ({
  children,
  className,
  touchTarget = 'medium',
  hapticFeedback = false,
  onClick,
  ...props
}) => {
  const touchTargetClasses = {
    small: 'min-h-[36px] min-w-[36px] p-2',
    medium: 'min-h-[44px] min-w-[44px] p-3',
    large: 'min-h-[56px] min-w-[56px] p-4'
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Add haptic feedback for mobile devices
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    onClick?.(e);
  };

  return (
    <Button
      className={cn(
        touchTargetClasses[touchTarget],
        'touch-target active:scale-95 transition-transform duration-150',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
};
