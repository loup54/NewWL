
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Download, 
  Eye,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';
import { securityMonitor, SecurityEvent } from '@/utils/securityMonitor';
import { useAuth } from '@/contexts/AuthContext';

export const SecurityDashboard: React.FC = () => {
  const [summary, setSummary] = useState(securityMonitor.getSecuritySummary());
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setSummary(securityMonitor.getSecuritySummary());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login_attempt': return <User className="w-4 h-4" />;
      case 'voucher_generation': 
      case 'voucher_redemption': return <Shield className="w-4 h-4" />;
      case 'payment_attempt': return <Activity className="w-4 h-4" />;
      case 'suspicious_activity': return <AlertTriangle className="w-4 h-4" />;
      case 'rate_limit_exceeded': return <AlertCircle className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const exportAuditLog = () => {
    const events = securityMonitor.exportAuditLog();
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      'Timestamp,Type,Severity,User ID,Details\n' +
      events.map(event => 
        `${new Date(event.timestamp).toISOString()},${event.type},${event.severity},${event.userId || 'N/A'},"${JSON.stringify(event.details).replace(/"/g, '""')}"`
      ).join('\n');

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `security-audit-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Security Dashboard
        </h2>
        <Button onClick={exportAuditLog} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Audit Log
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Recent Events (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.recentEvents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Suspicious Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{summary.suspiciousActivityCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Critical Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.criticalEventCount}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recent Events</TabsTrigger>
          <TabsTrigger value="details">Event Details</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {summary.recentEvents.map((event, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-center gap-3">
                      {getEventIcon(event.type)}
                      <div>
                        <div className="font-medium capitalize">
                          {event.type.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                      {event.userId && (
                        <Badge variant="outline" className="text-xs">
                          {event.userId.substring(0, 8)}...
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {summary.recentEvents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No recent security events
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEvent ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Event Type</label>
                      <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                        {selectedEvent.type}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Severity</label>
                      <div>
                        <Badge className={getSeverityColor(selectedEvent.severity)}>
                          {selectedEvent.severity}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">User ID</label>
                      <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                        {selectedEvent.userId || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Timestamp</label>
                      <div className="text-sm bg-gray-100 p-2 rounded">
                        {new Date(selectedEvent.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Details</label>
                    <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                      {JSON.stringify(selectedEvent.details, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Select an event to view details
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
