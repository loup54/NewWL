
import React from 'react';
import { AdminVoucherPanel } from '@/components/AdminVoucherPanel';
import { FreeVoucherGenerator } from '@/components/FreeVoucherGenerator';
import { SecurityDashboard } from '@/components/SecurityDashboard';
import { PerformanceDashboard } from '@/components/PerformanceDashboard';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Settings, Activity, Gauge } from 'lucide-react';
import { useUserRoles } from '@/hooks/useUserRoles';
import { PageLoader } from '@/components/LoadingStates';

const AdminPanel = () => {
  const { isAdmin, loading } = useUserRoles();

  console.log('AdminPanel: Checking admin access', { isAdmin, loading });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <PageLoader />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Shield className="w-5 h-5" />
                Access Denied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>You don't have permission to access the admin panel.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Admin Panel
          </h1>
          <p className="text-gray-600 mt-2">
            Manage voucher codes, security monitoring, performance optimization, and system administration
          </p>
        </div>

        <Tabs defaultValue="vouchers" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vouchers">Voucher Management</TabsTrigger>
            <TabsTrigger value="generator">Free Code Generator</TabsTrigger>
            <TabsTrigger value="security">Security Dashboard</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vouchers" className="space-y-6">
            <AdminVoucherPanel />
          </TabsContent>
          
          <TabsContent value="generator" className="space-y-6">
            <div className="max-w-md mx-auto">
              <FreeVoucherGenerator />
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
