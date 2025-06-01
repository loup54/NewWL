
import React from 'react';
import { HelpCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HelpTooltipProps {
  content: string;
  children?: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ 
  content, 
  children, 
  side = 'top' 
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        {children || <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />}
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        <p className="text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

interface FeatureTooltipProps {
  title: string;
  description: string;
  children: React.ReactNode;
  isNew?: boolean;
}

export const FeatureTooltip: React.FC<FeatureTooltipProps> = ({
  title,
  description,
  children,
  isNew = false
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative">
          {children}
          {isNew && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-blue-500" />
            <h4 className="font-medium">{title}</h4>
            {isNew && <span className="text-xs bg-green-100 text-green-800 px-1 rounded">NEW</span>}
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
