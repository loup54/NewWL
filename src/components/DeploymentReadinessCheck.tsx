
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Shield, Zap, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ReadinessCheck {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'fail' | 'warning';
  icon: React.ReactNode;
  category: 'security' | 'performance' | 'functionality' | 'seo';
}

export const DeploymentReadinessCheck: React.FC = () => {
  const [checks, setChecks] = useState<ReadinessCheck[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    runReadinessChecks();
  }, []);

  const runReadinessChecks = () => {
    const readinessChecks: ReadinessCheck[] = [
      {
        id: 'pwa-manifest',
        name: 'PWA Manifest',
        description: 'Progressive Web App manifest is properly configured',
        status: document.querySelector('link[rel="manifest"]') ? 'pass' : 'fail',
        icon: <Globe className="w-4 h-4" />,
        category: 'functionality'
      },
      {
        id: 'service-worker',
        name: 'Service Worker',
        description: 'Service worker is registered and active',
        status: 'serviceWorker' in navigator ? 'pass' : 'fail',
        icon: <Zap className="w-4 h-4" />,
        category: 'performance'
      },
      {
        id: 'meta-tags',
        name: 'SEO Meta Tags',
        description: 'Essential meta tags for SEO are present',
        status: document.querySelector('meta[name="description"]') ? 'pass' : 'fail',
        icon: <Globe className="w-4 h-4" />,
        category: 'seo'
      },
      {
        id: 'icons',
        name: 'App Icons',
        description: 'Favicon and app icons are configured',
        status: document.querySelector('link[rel="icon"]') ? 'pass' : 'fail',
        icon: <CheckCircle className="w-4 h-4" />,
        category: 'functionality'
      },
      {
        id: 'csp',
        name: 'Content Security Policy',
        description: 'CSP headers are configured for security',
        status: document.querySelector('meta[http-equiv="Content-Security-Policy"]') ? 'pass' : 'warning',
        icon: <Shield className="w-4 h-4" />,
        category: 'security'
      },
      {
        id: 'https',
        name: 'HTTPS Protocol',
        description: 'Application is served over HTTPS',
        status: location.protocol === 'https:' ? 'pass' : 'warning',
        icon: <Shield className="w-4 h-4" />,
        category: 'security'
      }
    ];

    setChecks(readinessChecks);
    
    const passedChecks = readinessChecks.filter(check => check.status === 'pass').length;
    const score = (passedChecks / readinessChecks.length) * 100;
    setOverallScore(score);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass': return <Badge className="bg-green-100 text-green-800">Ready</Badge>;
      case 'fail': return <Badge variant="destructive">Needs Fix</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      default: return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="w-4 h-4" />;
      case 'performance': return <Zap className="w-4 h-4" />;
      case 'functionality': return <CheckCircle className="w-4 h-4" />;
      case 'seo': return <Globe className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Deployment Readiness</h3>
          <div className="space-y-2">
            <Progress value={overallScore} className="w-full" />
            <p className="text-sm text-gray-600">
              {overallScore.toFixed(0)}% ready for production deployment
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {checks.map((check) => (
            <div key={check.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getCategoryIcon(check.category)}
                <div>
                  <div className="font-medium text-sm">{check.name}</div>
                  <div className="text-xs text-gray-600">{check.description}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {getStatusIcon(check.status)}
                {getStatusBadge(check.status)}
              </div>
            </div>
          ))}
        </div>

        {overallScore >= 80 ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Ready for Deployment</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Your application meets the requirements for production deployment.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Needs Attention</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Please address the failed checks before deploying to production.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
