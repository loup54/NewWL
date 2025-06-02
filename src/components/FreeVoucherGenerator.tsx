
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Gift, RefreshCw, Shield, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export const FreeVoucherGenerator: React.FC = () => {
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [codeCount, setCodeCount] = useState<number>(1);
  const [voucherValue, setVoucherValue] = useState<number>(2.00);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{ remaining?: number; resetTime?: number }>({});
  const { user } = useAuth();
  const { handleError } = useErrorHandler();

  const validateInputs = (): boolean => {
    if (codeCount < 1 || codeCount > 100) {
      toast({
        title: "Invalid Code Count",
        description: "Please enter a number between 1 and 100",
        variant: "destructive"
      });
      return false;
    }

    if (voucherValue < 0.01 || voucherValue > 1000) {
      toast({
        title: "Invalid Voucher Value",
        description: "Please enter a value between $0.01 and $1000",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const generateVoucherCode = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to generate voucher codes",
        variant: "destructive"
      });
      return;
    }

    if (!validateInputs()) {
      return;
    }

    setIsGenerating(true);

    try {
      console.log('Generating voucher with enhanced security validation');
      
      const { data, error } = await supabase.functions.invoke('generate-voucher', {
        body: { 
          codeCount: Math.floor(codeCount), // Ensure integer
          value: Math.round(voucherValue * 100) / 100 // Round to 2 decimal places
        }
      });

      if (error) {
        console.error('Error generating voucher:', error);
        
        // Handle specific error types
        if (error.message?.includes('rate limit') || error.message?.includes('Rate limit')) {
          const resetTime = data?.resetTime;
          const resetDate = resetTime ? new Date(resetTime) : null;
          
          toast({
            title: "Rate Limit Exceeded",
            description: resetDate 
              ? `Too many requests. Try again after ${resetDate.toLocaleTimeString()}`
              : "Too many requests. Please wait before trying again.",
            variant: "destructive"
          });
          
          if (resetTime) {
            setRateLimitInfo({ resetTime });
          }
        } else if (error.message?.includes('Admin access required')) {
          toast({
            title: "Access Denied",
            description: "Admin privileges required to generate voucher codes",
            variant: "destructive"
          });
        } else if (error.message?.includes('Validation failed')) {
          toast({
            title: "Input Validation Failed",
            description: "Please check your input values and try again",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Generation Failed",
            description: error.message || "Failed to generate voucher code",
            variant: "destructive"
          });
        }
        return;
      }

      if (data?.success) {
        if (codeCount === 1 && data.codes?.[0]) {
          setGeneratedCode(data.codes[0].code);
        }

        toast({
          title: "Success!",
          description: data.message || `Generated ${data.count} secure voucher code${data.count > 1 ? 's' : ''}`,
        });
        
        setRateLimitInfo({});
      } else {
        throw new Error(data?.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      handleError(error instanceof Error ? error : new Error('Failed to generate voucher code'));
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedCode) {
      try {
        await navigator.clipboard.writeText(generatedCode);
        toast({
          title: "Copied!",
          description: "Voucher code copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Could not copy to clipboard",
          variant: "destructive"
        });
      }
    }
  };

  const isRateLimited = rateLimitInfo.resetTime && Date.now() < rateLimitInfo.resetTime;

  return (
    <Card className="w-full max-w-md border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Secure Voucher Generator
          <Shield className="w-4 h-4 text-green-600" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="count">Number of codes to generate</Label>
          <Input
            id="count"
            type="number"
            min="1"
            max="100"
            value={codeCount}
            onChange={(e) => setCodeCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            disabled={isGenerating}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">Voucher Value ($)</Label>
          <Input
            id="value"
            type="number"
            min="0.01"
            max="1000"
            step="0.01"
            value={voucherValue}
            onChange={(e) => setVoucherValue(Math.max(0.01, Math.min(1000, parseFloat(e.target.value) || 2.00)))}
            disabled={isGenerating}
          />
        </div>

        {isRateLimited && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-medium">Rate Limited</p>
              <p>Please wait until {new Date(rateLimitInfo.resetTime!).toLocaleTimeString()} before generating more codes.</p>
            </div>
          </div>
        )}

        <Button 
          onClick={generateVoucherCode}
          className="w-full"
          variant="outline"
          disabled={isGenerating || isRateLimited}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating Securely...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Secure Code{codeCount > 1 ? 's' : ''}
            </>
          )}
        </Button>

        {generatedCode && codeCount === 1 && (
          <div className="space-y-2">
            <Label>Generated Voucher Code:</Label>
            <div className="flex items-center gap-2">
              <Input
                value={generatedCode}
                readOnly
                className="font-mono bg-green-50"
              />
              <Button
                onClick={copyToClipboard}
                size="icon"
                variant="outline"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              This code can be redeemed for ${voucherValue.toFixed(2)} value
            </p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
          <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 space-y-1">
            <p className="font-medium">Security Features</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Cryptographic random generation</li>
              <li>Rate limiting (10 requests/minute)</li>
              <li>Input validation & sanitization</li>
              <li>Admin access verification</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
