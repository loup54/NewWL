
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
      const codes = [];
      for (let i = 0; i < codeCount; i++) {
        const randomPart = Math.random().toString(36).substr(2, 8).toUpperCase();
        const code = `FREE-${randomPart}`;
        codes.push({
          code,
          value: 2.00,
          created_by: user.id
        });
      }

      const { error } = await supabase
        .from('voucher_codes')
        .insert(codes);

      if (error) {
        console.error('Error creating voucher:', error);
        toast({
          title: "Error",
          description: "Failed to generate voucher code",
          variant: "destructive"
        });
        return;
      }

      if (codeCount === 1) {
        setGeneratedCode(codes[0].code);
      }

      toast({
        title: "Success!",
        description: `Generated ${codeCount} voucher code${codeCount > 1 ? 's' : ''}`,
      });
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
          Free Voucher Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="count">Number of codes to generate</Label>
          <Input
            id="count"
            type="number"
            min="1"
            max="10"
            value={codeCount}
            onChange={(e) => setCodeCount(parseInt(e.target.value) || 1)}
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
              Generate Free Code{codeCount > 1 ? 's' : ''}
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
              This code can be redeemed for $2.00 value
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
