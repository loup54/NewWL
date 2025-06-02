
import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Activity, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SystemValidator, performanceMetrics } from '@/utils/testingUtils';

export const SystemValidatorComponent: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);

  const runValidation = async () => {
    setIsRunning(true);
    setResults(null);
    
    try {
      const validator = new SystemValidator();
      const testResults = await validator.runComprehensiveTests();
      const performanceData = {
        loadTime: performanceMetrics.measureLoadTime(),
        memory: performanceMetrics.measureMemoryUsage()
      };
      
      setResults(testResults);
      setMetrics(performanceData);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getSuccessRate = () => {
    if (!results) return 0;
    const total = results.passed + results.failed;
    return total > 0 ? (results.passed / total) * 100 : 0;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">System Validation</h3>
            <p className="text-sm text-gray-600">Comprehensive testing and performance validation</p>
          </div>
          <Button onClick={runValidation} disabled={isRunning}>
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running Tests...' : 'Run Validation'}
          </Button>
        </div>

        {isRunning && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 animate-pulse text-blue-500" />
              <span className="text-sm">Running comprehensive tests...</span>
            </div>
            <Progress value={50} className="w-full" />
          </div>
        )}

        {results && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{results.passed}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{getSuccessRate().toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Test Results</h4>
              {Object.entries(results.results).map(([test, passed]) => (
                <div key={test} className="flex items-center justify-between">
                  <span className="text-sm">{test}</span>
                  <Badge variant={passed ? 'default' : 'destructive'}>
                    {passed ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {passed ? 'Passed' : 'Failed'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {metrics && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Performance Metrics
            </h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium">Load Time</div>
                <div>DOM: {metrics.loadTime.domContentLoaded?.toFixed(0)}ms</div>
                <div>Complete: {metrics.loadTime.loadComplete?.toFixed(0)}ms</div>
              </div>
              
              {metrics.memory && (
                <div>
                  <div className="font-medium">Memory Usage</div>
                  <div>Used: {(metrics.memory.used / 1024 / 1024).toFixed(1)}MB</div>
                  <div>Total: {(metrics.memory.total / 1024 / 1024).toFixed(1)}MB</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
