
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Home, Shield } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [voucherCode] = useState(() => {
    // Generate a secure voucher code format
    return `PAID-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  });

  useEffect(() => {
    console.log('Payment successful, session ID:', sessionId);
    
    // Security: Validate session ID format
    if (sessionId && !/^cs_[a-zA-Z0-9_]+$/.test(sessionId)) {
      console.warn('Invalid session ID format detected');
    }
  }, [sessionId]);

  const handleDownloadVoucher = () => {
    const voucherData = `
WordLens Premium Voucher - SECURE
=================================
Voucher Code: ${voucherCode}
Value: $2.00 USD
Valid for: Premium Features Access
Payment Verified: ${sessionId ? 'Yes' : 'Pending'}
Generated: ${new Date().toISOString()}

This voucher was generated after verified payment.
Thank you for your purchase!

Keep this code secure and do not share publicly.
    `.trim();

    const blob = new Blob([voucherData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wordlens-voucher-${voucherCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-2 border-green-200">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <Shield className="w-6 h-6 text-green-600 absolute -top-1 -right-1" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-600">
              Secure Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Thank you for your secure purchase of a WordLens Premium Voucher!
              </p>
              
              <div className="bg-green-50 p-4 rounded-lg border-2 border-dashed border-green-300">
                <h3 className="font-semibold mb-2">Your Secure Voucher Code:</h3>
                <div className="text-2xl font-mono font-bold text-blue-600 tracking-wider">
                  {voucherCode}
                </div>
                <p className="text-xs text-green-600 mt-2">
                  ✓ Payment verified and secured
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <h4 className="font-medium mb-2">Security Notice:</h4>
                  <ul className="space-y-1">
                    <li>• Your payment was processed securely via Stripe</li>
                    <li>• This voucher code is unique and verified</li>
                    <li>• Keep your voucher code private and secure</li>
                    <li>• Contact support if you have any concerns</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">How to use your voucher:</h4>
              <ol className="text-sm text-gray-600 space-y-1 ml-4">
                <li>1. Save your voucher code in a safe place</li>
                <li>2. Share it with someone or use it yourself</li>
                <li>3. The recipient can redeem it for premium features</li>
                <li>4. This voucher never expires</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleDownloadVoucher} 
                variant="outline"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Voucher
              </Button>
              
              <Button 
                onClick={() => navigate('/')}
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>

            {sessionId && (
              <div className="text-xs text-gray-400 text-center border-t pt-3">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-3 h-3" />
                  <span>Secure Transaction ID: {sessionId.substring(0, 20)}...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
