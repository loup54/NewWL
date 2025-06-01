
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export const DocumentSkeleton: React.FC = () => (
  <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
    <div className="space-y-4">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      {/* Content lines */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
      
      {/* Paragraph break */}
      <div className="py-2" />
      
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i % 4 === 3 ? 'w-3/4' : 'w-full'}`} />
        ))}
      </div>
    </div>
  </Card>
);

export const KeywordManagerSkeleton: React.FC = () => (
  <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-16" />
      </div>
      
      <Skeleton className="h-10 w-full" />
      
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-6 w-8" />
          </div>
        ))}
      </div>
    </div>
  </Card>
);
