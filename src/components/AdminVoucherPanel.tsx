import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Gift, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type VoucherStatus = 'active' | 'used' | 'expired';

interface VoucherRecord {
  id: string;
  code: string;
  value: number;
  status: VoucherStatus;
  created_at: string;
  created_by: string | null;
  used_at: string | null;
  used_by: string | null;
  expires_at: string | null;
}

export const AdminVoucherPanel: React.FC = () => {
  const [vouchers, setVouchers] = useState<VoucherRecord[]>([]);
  const [newVoucherCode, setNewVoucherCode] = useState('');
  const [newVoucherValue, setNewVoucherValue] = useState<number>(2);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchVouchers();
  }, []);

  if (!user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Admin Voucher Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">
            Login required to view this panel.
          </p>
        </CardContent>
      </Card>
    );
  }

  const createVoucher = async () => {
    if (!newVoucherCode || !newVoucherValue) {
      toast({
        title: "Error",
        description: "Please enter a voucher code and value",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    try {
      const { error } = await supabase
        .from('voucher_codes')
        .insert({
          code: newVoucherCode,
          value: newVoucherValue,
          created_by: user.id
        });

      if (error) {
        console.error('Error creating voucher:', error);
        toast({
          title: "Error",
          description: "Failed to create voucher code",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success!",
        description: "Voucher code created successfully!",
      });

      setNewVoucherCode('');
      setNewVoucherValue(2);
      fetchVouchers();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to create voucher code",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const deleteVoucher = async (voucherId: string) => {
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('voucher_codes')
        .delete()
        .eq('id', voucherId);

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
        title: "Success!",
        description: "Voucher code deleted successfully!",
      });

      fetchVouchers();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to delete voucher code",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

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

      // Type assertion since we know the data structure matches our interface
      setVouchers(data as VoucherRecord[]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Admin Voucher Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="code">Voucher Code</Label>
            <Input
              id="code"
              placeholder="FREE-XXXXXXXX"
              value={newVoucherCode}
              onChange={(e) => setNewVoucherCode(e.target.value.toUpperCase())}
              className="font-mono"
            />
          </div>
          <div>
            <Label htmlFor="value">Voucher Value</Label>
            <Input
              id="value"
              type="number"
              value={newVoucherValue}
              onChange={(e) => setNewVoucherValue(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <Button 
          onClick={createVoucher}
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Voucher"
          )}
        </Button>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vouchers.map((voucher) => (
              <TableRow key={voucher.id}>
                <TableCell className="font-mono">{voucher.code}</TableCell>
                <TableCell>${voucher.value.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {voucher.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(voucher.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteVoucher(voucher.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
