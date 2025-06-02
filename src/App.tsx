
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { PageLoader } from '@/components/LoadingStates';
import { AuthProvider } from '@/contexts/AuthContext';
import config from '@/utils/environment';

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const ValidationDashboard = lazy(() => import('@/pages/ValidationDashboard'));
const PaymentSuccess = lazy(() => import('@/pages/PaymentSuccess'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const AdminPanel = lazy(() => import('@/pages/AdminPanel'));

function App() {
  console.log(`WordLens ${config.app.version} running in ${config.environment} mode`);
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/validation" element={<ValidationDashboard />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Toaster />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
