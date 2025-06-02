
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, CheckCircle, AlertCircle, RefreshCw, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface RedemptionResponse {
  success: boolean;
  value?: number;
  error?: string;
}

export const VoucherRedemption: React.FC = () => {
  const [voucherCode, setVoucherCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{ remaining?: number; resetTime?: number }>({});
  const { user } = useAuth();
  const { handleError } = useErrorHandler();

  const validateCode = (code: string): boolean => {
    // Enhanced validation - starts with FREE- or PAID- and has correct format
    return /^(FREE|PAID)-[A-Z0-9]{8}$/.test(code);
  };

  const sanitizeCode = (code: string): string => {
    return code.toUpperCase().trim().replace(/[^A-Z0-9-]/g, '');
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

    const sanitizedCode = sanitizeCode(voucherCode);
    
    if (!validateCode(sanitizedCode)) {
      toast({
        title: "Invalid Code Format",
        description: "Please enter a valid voucher code (e.g., FREE-XXXXXXXX)",
        variant: "destructive"
      });
      return;
    }

    setIsRedeeming(true);
    
    try {
      console.log('Attempting to redeem voucher with enhanced security checks');
      
      const { data, error } = await supabase.rpc('redeem_voucher_code', {
        _code: sanitizedCode,
        _user_id: user.id
      });

      if (error) {
        console.error('Redemption error:', error);
        
        // Handle specific error types
        if (error.message?.includes('rate limit')) {
          toast({
            title: "Too Many Attempts", 
            description: "Please wait before trying again",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Redemption Failed", 
            description: "Failed to redeem voucher code",
            variant: "destructive"
          });
        }
        return;
      }

      // Safely parse the JSON response
      const response = data as unknown as RedemptionResponse;

      if (response?.success) {
        toast({
          title: "Success!",
          description: `Voucher redeemed successfully! You received $${response.value} in premium access.`,
        });
        setVoucherCode('');
        setRateLimitInfo({});
      } else {
        const errorMessage = response?.error || "This code may have already been used or is invalid";
        
        toast({
          title: "Redemption Failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Voucher redemption error:', error);
      handleError(error instanceof Error ? error : new Error('Failed to redeem voucher code'));
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeCode(e.target.value);
    setVoucherCode(sanitized);
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
            onChange={handleCodeChange}
            className="font-mono"
            maxLength={13}
          />
          {voucherCode && !validateCode(voucherCode) && (
            <p className="text-sm text-red-600">
              Invalid format. Code should be FREE-XXXXXXXX or PAID-XXXXXXXX
            </p>
          )}
        </div>

        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Login Required</p>
              <p>Please sign in to redeem voucher codes securely.</p>
            </div>
          </div>
        )}

        {rateLimitInfo.remaining !== undefined && rateLimitInfo.remaining < 3 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Limited Attempts Remaining</p>
              <p>You have {rateLimitInfo.remaining} redemption attempts left.</p>
            </div>
          </div>
        )}

        <Button 
          onClick={redeemVoucher}
          disabled={!voucherCode || !user || isRedeeming || !validateCode(voucherCode)}
          className="w-full"
        >
          {isRedeeming ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Redeeming Securely...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Redeem Voucher
            </>
          )}
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
