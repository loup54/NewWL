
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, Download, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface VoucherRecord {
  id: string;
  code: string;
  value: number;
  status: 'active' | 'used' | 'expired';
  created_at: string;
  used_at?: string;
  used_by?: string;
}

export const AdminVoucherPanel: React.FC = () => {
  const [vouchers, setVouchers] = useState<VoucherRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulkCount, setBulkCount] = useState(5);
  const [bulkValue, setBulkValue] = useState(2.00);
  const { user } = useAuth();

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const { data, error } = await supabase
        .from('voucher_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vouchers:', error);
        toast({
          title: "Error",
          description: "Failed to fetch voucher codes",
          variant: "destructive"
        });
        return;
      }

      setVouchers(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateBulkCodes = async () => {
    if (!user) return;

    try {
      const newVouchers = [];
      
      for (let i = 0; i < bulkCount; i++) {
        const randomPart = Math.random().toString(36).substr(2, 8).toUpperCase();
        const code = `FREE-${randomPart}`;
        
        newVouchers.push({
          code,
          value: bulkValue,
          created_by: user.id
        });
      }

      const { error } = await supabase
        .from('voucher_codes')
        .insert(newVouchers);

      if (error) {
        console.error('Error creating vouchers:', error);
        toast({
          title: "Error",
          description: "Failed to generate voucher codes",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Codes Generated",
        description: `Generated ${bulkCount} new voucher codes`,
      });

      fetchVouchers();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const exportCodes = () => {
    const activeCodes = vouchers.filter(v => v.status === 'active');
    const csvContent = activeCodes.map(v => v.code).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voucher-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteVoucher = async (id: string) => {
    try {
      const { error } = await supabase
        .from('voucher_codes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting voucher:', error);
        toast({
          title: "Error",
          description: "Failed to delete voucher code",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Code Deleted",
        description: "Voucher code has been removed",
      });

      fetchVouchers();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getStatusBadge = (status: VoucherRecord['status']) => {
    const variants = {
      active: 'default',
      used: 'secondary',
      expired: 'destructive'
    } as const;
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6">
          <div className="text-center">Loading voucher codes...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Admin Voucher Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Codes</TabsTrigger>
            <TabsTrigger value="manage">Manage Codes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="count">Number of codes</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="100"
                  value={bulkCount}
                  onChange={(e) => setBulkCount(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Value per code ($)</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  min="0"
                  value={bulkValue}
                  onChange={(e) => setBulkValue(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <Button onClick={generateBulkCodes} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Generate {bulkCount} Codes
            </Button>
          </TabsContent>
          
          <TabsContent value="manage" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Total: {vouchers.length} codes | 
                Active: {vouchers.filter(v => v.status === 'active').length} | 
                Used: {vouchers.filter(v => v.status === 'used').length}
              </div>
              <Button onClick={exportCodes} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Active Codes
              </Button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {vouchers.map((voucher) => (
                <div key={voucher.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {voucher.code}
                    </code>
                    {getStatusBadge(voucher.status)}
                    <span className="text-sm text-gray-600">
                      ${voucher.value.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {new Date(voucher.created_at).toLocaleDateString()}
                    </span>
                    {voucher.status === 'active' && (
                      <Button
                        onClick={() => deleteVoucher(voucher.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
