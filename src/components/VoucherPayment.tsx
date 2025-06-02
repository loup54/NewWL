
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Gift, Loader2, AlertCircle, LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { AuthModal } from '@/components/AuthModal';

export const VoucherPayment: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const handlePurchaseVoucher = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      setLoading(true);
      console.log('Creating payment session for voucher...');
      
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { voucherType: 'premium' }
      });

      if (error) {
        console.error('Payment error:', error);
        toast({
          title: "Payment Error",
          description: error.message || "Failed to create payment session",
          variant: "destructive"
        });
        return;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Voucher purchase error:', error);
      toast({
        title: "Error",
        description: "Failed to start payment process",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Premium Voucher
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">$2.00</div>
              <p className="text-sm text-gray-600">One-time payment</p>
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

            {!user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Login Required</p>
                  <p>Please sign in to purchase a voucher.</p>
                </div>
              </div>
            )}

            <Button 
              onClick={handlePurchaseVoucher}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : !user ? (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In to Purchase
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Purchase Voucher
                </>
              )}
            </Button>
            
            <p className="text-xs text-center text-gray-500">
              Secure payment powered by Stripe
            </p>
          </div>
        </CardContent>
      </Card>

      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
      />
    </>
  );
};
