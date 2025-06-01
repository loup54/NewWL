
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online! Your data will sync automatically.', {
        duration: 3000,
        icon: <Wifi className="w-4 h-4" />
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastOnlineTime(new Date());
      toast.warning('You\'re offline. Your work is being saved locally.', {
        duration: 5000,
        icon: <WifiOff className="w-4 h-4" />
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return (
      <div className="fixed top-16 right-4 z-40">
        <Badge 
          variant="default" 
          className="bg-green-100 text-green-800 border-green-200 shadow-sm"
        >
          <Cloud className="w-3 h-3 mr-1" />
          Online
        </Badge>
      </div>
    );
  }

  return (
    <div className="fixed top-16 right-4 z-40">
      <Badge 
        variant="secondary" 
        className="bg-orange-100 text-orange-800 border-orange-200 shadow-lg animate-pulse"
      >
        <CloudOff className="w-3 h-3 mr-1" />
        Offline Mode
        {lastOnlineTime && (
          <span className="ml-1 text-xs">
            (since {lastOnlineTime.toLocaleTimeString()})
          </span>
        )}
      </Badge>
    </div>
  );
};
