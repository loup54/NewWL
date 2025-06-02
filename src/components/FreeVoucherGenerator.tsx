
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Gift, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const FreeVoucherGenerator: React.FC = () => {
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [codeCount, setCodeCount] = useState<number>(1);
  const [voucherValue, setVoucherValue] = useState<number>(2.00);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();

  const generateVoucherCode = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to generate voucher codes",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-voucher', {
        body: { 
          codeCount,
          value: voucherValue 
        }
      });

      if (error) {
        console.error('Error generating voucher:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to generate voucher code",
          variant: "destructive"
        });
        return;
      }

      if (data?.success) {
        if (codeCount === 1 && data.codes?.[0]) {
          setGeneratedCode(data.codes[0].code);
        }

        toast({
          title: "Success!",
          description: `Generated ${data.count} secure voucher code${data.count > 1 ? 's' : ''}`,
        });
      } else {
        throw new Error(data?.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate voucher code",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedCode) {
      await navigator.clipboard.writeText(generatedCode);
      toast({
        title: "Copied!",
        description: "Voucher code copied to clipboard",
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Secure Voucher Generator
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
            onChange={(e) => setCodeCount(parseInt(e.target.value) || 1)}
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
            onChange={(e) => setVoucherValue(parseFloat(e.target.value) || 2.00)}
          />
        </div>

        <Button 
          onClick={generateVoucherCode}
          className="w-full"
          variant="outline"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
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
                className="font-mono"
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

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Codes are generated using cryptographic randomness</p>
          <p>• Server-side generation ensures security</p>
          <p>• Admin access required for generation</p>
        </div>
      </CardContent>
    </Card>
  );
};
