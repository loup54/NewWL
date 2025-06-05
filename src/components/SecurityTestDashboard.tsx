import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { authTestSuite } from '@/utils/authTestSuite';
import { systemValidator } from '@/utils/testingUtils';
import { securityMonitor } from '@/utils/securityMonitor';
import { Shield, Play, CheckCircle, XCircle, AlertTriangle, BarChart3 } from 'lucide-react';

export const SecurityTestDashboard: React.FC = () => {
  const [authResults, setAuthResults] = useState<any>(null);
  const [systemResults, setSystemResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Temporarily use security monitor directly instead of hook
  const getSecuritySummary = () => securityMonitor.getSecuritySummary();

  const runAuthTests = async () => {
    setIsRunning(true);
    try {
      const results = await authTestSuite.runAllTests();
      setAuthResults(results);
    } catch (error) {
      console.error('Auth tests failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runSystemTests = async () => {
    setIsRunning(true);
    try {
      const results = await systemValidator.runComprehensiveTests();
      setSystemResults(results);
    } catch (error) {
      console.error('System tests failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    await runAuthTests();
    await runSystemTests();
    setIsRunning(false);
  };

  const securitySummary = getSecuritySummary();

  const getStatusBadge = (passed: number, total: number) => {
    const percentage = total > 0 ? (passed / total) * 100 : 0;
    
    if (percentage === 100) {
      return <Badge variant="default" className="bg-green-500">All Pass</Badge>;
    } else if (percentage >= 80) {
      return <Badge variant="secondary" className="bg-yellow-500">Good</Badge>;
    } else {
      return <Badge variant="destructive">Issues Found</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Security & Testing Dashboard
          </h2>
          <p className="text-muted-foreground">
            Monitor security events and run comprehensive tests
          </p>
        </div>
        
        <div className="space-x-2">
          <Button onClick={runAuthTests} disabled={isRunning} variant="outline">
            <Play className="mr-2 h-4 w-4" />
            Auth Tests
          </Button>
          <Button onClick={runSystemTests} disabled={isRunning} variant="outline">
            <Play className="mr-2 h-4 w-4" />
            System Tests
          </Button>
          <Button onClick={runAllTests} disabled={isRunning}>
            <Play className="mr-2 h-4 w-4" />
            Run All Tests
          </Button>
        </div>
      </div>

      {/* Security Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Security Summary
          </CardTitle>
          <CardDescription>
            Recent security events and activity monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{securitySummary.totalEvents}</div>
              <div className="text-sm text-muted-foreground">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{securitySummary.recentEvents.length}</div>
              <div className="text-sm text-muted-foreground">Recent Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{securitySummary.suspiciousActivityCount}</div>
              <div className="text-sm text-muted-foreground">Suspicious Activity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{securitySummary.criticalEventCount}</div>
              <div className="text-sm text-muted-foreground">Critical Events</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authentication Tests */}
      {authResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Authentication Tests
              </span>
              {getStatusBadge(authResults.passed, authResults.passed + authResults.failed)}
            </CardTitle>
            <CardDescription>{authResults.summary}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Progress 
                value={(authResults.passed / (authResults.passed + authResults.failed)) * 100} 
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              {authResults.results.map((result: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    {result.passed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">{result.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {result.duration.toFixed(2)}ms
                    {result.error && (
                      <span className="ml-2 text-red-500">({result.error})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Tests */}
      {systemResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                System Tests
              </span>
              {getStatusBadge(systemResults.passed, systemResults.passed + systemResults.failed)}
            </CardTitle>
            <CardDescription>
              {systemResults.passed} passed, {systemResults.failed} failed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Progress 
                value={(systemResults.passed / (systemResults.passed + systemResults.failed)) * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-4">
              {Object.entries(systemResults.categories).map(([category, stats]: [string, any]) => (
                <div key={category} className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{category.replace('_', ' ')}</h4>
                    <Badge variant={stats.failed === 0 ? "default" : "destructive"}>
                      {stats.passed}/{stats.passed + stats.failed}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    {systemResults.results
                      .filter((result: any) => result.category === category)
                      .map((result: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {result.passed ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500" />
                            )}
                            <span>{result.name}</span>
                          </div>
                          <span className="text-muted-foreground">
                            {result.duration.toFixed(1)}ms
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isRunning && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Running security and system tests... This may take a few moments.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
