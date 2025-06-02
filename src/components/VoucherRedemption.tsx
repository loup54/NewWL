
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const VoucherRedemption: React.FC = () => {
  const [voucherCode, setVoucherCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const { user } = useAuth();

  const validateCode = (code: string): boolean => {
    // Simple validation - starts with FREE- and has correct format
    return /^FREE-[A-Z0-9]{8}$/.test(code);
  };

  const redeemVoucher = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to redeem a voucher",
        variant: "destructive"
      });
      return;
    }

    if (!validateCode(voucherCode)) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid voucher code",
        variant: "destructive"
      });
      return;
    }

    setIsRedeeming(true);
    
    try {
      const { data, error } = await supabase.rpc('redeem_voucher_code', {
        _code: voucherCode,
        _user_id: user.id
      });

      if (error) {
        console.error('Redemption error:', error);
        toast({
          title: "Redemption Failed", 
          description: "Failed to redeem voucher code",
          variant: "destructive"
        });
        return;
      }

      if (data?.success) {
        toast({
          title: "Success!",
          description: `Voucher redeemed successfully! You received $${data.value} in premium access.`,
        });
        setVoucherCode('');
      } else {
        toast({
          title: "Redemption Failed",
          description: data?.error || "This code may have already been used or is invalid",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Voucher redemption error:', error);
      toast({
        title: "Error",
        description: "Failed to redeem voucher code",
        variant: "destructive"
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Redeem Voucher Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Enter voucher code</Label>
          <Input
            id="code"
            placeholder="FREE-XXXXXXXX"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
            className="font-mono"
          />
        </div>

        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Login Required</p>
              <p>Please sign in to redeem voucher codes.</p>
            </div>
          </div>
        )}

        <Button 
          onClick={redeemVoucher}
          disabled={!voucherCode || !user || isRedeeming}
          className="w-full"
        >
          {isRedeeming ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Redeeming...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Redeem Voucher
            </>
          )}
        </Button>

        <p className="text-xs text-center text-gray-500">
          Free voucher codes provide $2.00 worth of premium features
        </p>
      </CardContent>
    </Card>
  );
};
