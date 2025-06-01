
import React, { useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { toast } from 'sonner';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isInstalled || isDismissed) {
    return null;
  }

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      toast.success('App installed successfully!');
    } else {
      toast.info('Installation cancelled');
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 p-4 shadow-lg border-blue-200 bg-blue-50 z-50">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-blue-100 rounded-full">
          <Smartphone className="w-5 h-5 text-blue-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-blue-900 mb-1">
            Install WordLens
          </h4>
          <p className="text-xs text-blue-700 mb-3">
            Add to your home screen for quick access and offline use
          </p>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleInstall}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="w-3 h-3 mr-1" />
              Install
            </Button>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
            >
              Later
            </Button>
          </div>
        </div>
        
        <Button
          onClick={handleDismiss}
          variant="ghost"
          size="sm"
          className="text-blue-500 hover:text-blue-700 p-1"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
