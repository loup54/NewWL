
import React from 'react';
import { AdminVoucherPanel } from '@/components/AdminVoucherPanel';
import { FreeVoucherGenerator } from '@/components/FreeVoucherGenerator';
import { SecurityDashboard } from '@/components/SecurityDashboard';
import { PerformanceDashboard } from '@/components/PerformanceDashboard';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Settings, AlertCircle } from 'lucide-react';

const AdminPanel = () => {
  console.log('AdminPanel: Phase 1 - all features disabled');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <AlertCircle className="w-5 h-5" />
              Phase 1 - Admin Features Disabled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                Admin panel features are temporarily disabled in Phase 1. All functionality will be enabled in future phases when authentication is implemented.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
