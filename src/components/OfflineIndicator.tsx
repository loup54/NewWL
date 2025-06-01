
import React from 'react';
import { Wifi, WifiOff, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OfflineIndicatorProps {
  isOnline: boolean;
  hasOfflineDocuments?: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  isOnline,
  hasOfflineDocuments = false
}) => {
  if (isOnline && !hasOfflineDocuments) return null;

  return (
    <Card className="fixed top-20 right-4 p-3 shadow-lg z-40 bg-white/90 backdrop-blur-sm border-gray-200">
      <div className="flex items-center space-x-2">
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4 text-green-600" />
            <Badge variant="outline" className="text-green-700 border-green-300">
              Online
            </Badge>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-orange-600" />
            <Badge variant="outline" className="text-orange-700 border-orange-300">
              Offline
            </Badge>
          </>
        )}
        
        {hasOfflineDocuments && (
          <div className="flex items-center space-x-1 text-blue-600">
            <Download className="w-3 h-3" />
            <span className="text-xs font-medium">Saved</span>
          </div>
        )}
      </div>
    </Card>
  );
};
