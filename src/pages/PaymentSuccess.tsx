
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Home } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [voucherCode] = useState(() => {
    // Generate a simple voucher code
    return `WL-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  });

  useEffect(() => {
    console.log('Payment successful, session ID:', sessionId);
  }, [sessionId]);

  const handleDownloadVoucher = () => {
    const voucherData = `
WordLens Premium Voucher
========================
Voucher Code: ${voucherCode}
Value: $2.00 USD
Valid for: Premium Features Access

Thank you for your purchase!
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
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Thank you for purchasing a WordLens Premium Voucher!
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                <h3 className="font-semibold mb-2">Your Voucher Code:</h3>
                <div className="text-2xl font-mono font-bold text-blue-600 tracking-wider">
                  {voucherCode}
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
              <div className="text-xs text-gray-400 text-center">
                Transaction ID: {sessionId}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
