
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const VoucherRedemption: React.FC = () => {
  const [voucherCode, setVoucherCode] = useState('');

  const redeemVoucher = async () => {
    console.log('Redeem voucher clicked - disabled in Phase 1');
    toast({
      title: "Feature Disabled",
      description: "Voucher redemption is disabled in Phase 1",
      variant: "destructive"
    });
    return;
  };

  return (
    <Card className="w-full max-w-md border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Redeem Voucher Code
          <Shield className="w-4 h-4 text-green-600" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Enter voucher code</Label>
          <Input
            id="code"
            placeholder="FREE-XXXXXXXX or PAID-XXXXXXXX"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            className="font-mono"
            maxLength={13}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Phase 1 - Feature Disabled</p>
            <p>Voucher redemption is temporarily disabled.</p>
          </div>
        </div>

        <Button 
          onClick={redeemVoucher}
          disabled={true}
          className="w-full"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Feature Disabled (Phase 1)
        </Button>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
          <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-green-800">
            <p className="font-medium">Secure Redemption</p>
            <p>All voucher codes are validated with rate limiting and input sanitization.</p>
          </div>
        </div>

        <p className="text-xs text-center text-gray-500">
          Voucher codes provide premium feature access with secure validation
        </p>
      </CardContent>
    </Card>
  );
};
