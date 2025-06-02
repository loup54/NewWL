
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Activity, Zap, Database, Gauge } from 'lucide-react';
import { performanceMonitor } from '@/utils/performanceUtils';
import { performanceOptimizer } from '@/utils/performanceOptimizer';
import { useServiceWorker } from '@/hooks/useServiceWorker';

export const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Record<string, any>>({});
  const [optimizationReport, setOptimizationReport] = useState<any>(null);
  const serviceWorker = useServiceWorker();

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getMetrics());
      setOptimizationReport(performanceOptimizer.getOptimizationReport());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const clearMetrics = () => {
    performanceMonitor.clearMetrics();
    setMetrics({});
  };

  const getPerformanceScore = () => {
    const avgTimes = Object.values(metrics)
      .filter((metric: any) => typeof metric === 'object' && metric.average)
      .map((metric: any) => metric.average);
    
    if (avgTimes.length === 0) return 100;
    
    const avgTime = avgTimes.reduce((sum, time) => sum + time, 0) / avgTimes.length;
    return Math.max(0, 100 - (avgTime / 10)); // Rough scoring
  };

  const performanceScore = getPerformanceScore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Gauge className="w-6 h-6" />
          Performance Dashboard
        </h2>
        <Button onClick={clearMetrics} variant="outline" size="sm">
          Clear Metrics
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(performanceScore)}</div>
            <Progress value={performanceScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Overall application performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Worker</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={serviceWorker.isRegistered ? "default" : "secondary"}>
                {serviceWorker.isRegistered ? "Active" : "Inactive"}
              </Badge>
              {serviceWorker.isOffline && (
                <Badge variant="destructive">Offline</Badge>
              )}
            </div>
            {serviceWorker.isUpdateAvailable && (
              <Button 
                onClick={serviceWorker.updateServiceWorker} 
                size="sm" 
                className="mt-2"
              >
                Update Available
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {optimizationReport?.config?.enableCaching ? "Enabled" : "Disabled"}
            </div>
            <p className="text-xs text-muted-foreground">
              Max size: {optimizationReport?.config?.maxCacheSize || 0} items
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="optimization">Optimization Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operation Timings</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(metrics).length === 0 ? (
                <p className="text-muted-foreground">No metrics available yet</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(metrics).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{key}</span>
                      <div className="text-right">
                        {typeof value === 'object' ? (
                          <div className="text-sm">
                            <div>Avg: {value.average?.toFixed(2)}ms</div>
                            <div className="text-xs text-muted-foreground">
                              Count: {value.count}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm">{value?.toFixed?.(2) || value}ms</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              {optimizationReport?.config ? (
                <div className="space-y-3">
                  {Object.entries(optimizationReport.config).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{key}</span>
                      <Badge variant={value ? "default" : "secondary"}>
                        {String(value)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Loading optimization settings...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
