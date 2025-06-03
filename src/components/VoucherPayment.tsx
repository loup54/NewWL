
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, AlertCircle, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const VoucherPayment: React.FC = () => {
  const handlePurchaseVoucher = async () => {
    console.log('Purchase voucher clicked - disabled in Phase 1');
    toast({
      title: "Feature Disabled",
      description: "Payment functionality is disabled in Phase 1",
      variant: "destructive"
    });
    return;
  };

  return (
    <Card className="w-full max-w-md border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Premium Voucher
          <Shield className="w-4 h-4 text-green-600" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">$2.00</div>
            <p className="text-sm text-gray-600">One-time secure payment</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">What you get:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Premium document analysis features</li>
              <li>• Advanced keyword insights</li>
              <li>• Export capabilities</li>
              <li>• Priority support</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Phase 1 - Feature Disabled</p>
              <p>Payment features are temporarily disabled.</p>
            </div>
          </div>

          <Button 
            onClick={handlePurchaseVoucher}
            disabled={true}
            className="w-full"
            size="lg"
          >
            Feature Disabled (Phase 1)
          </Button>
          
          <p className="text-xs text-center text-gray-500">
            Payment features will be enabled in future phases
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
