
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { PageLoader } from '@/components/LoadingStates';

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const ValidationDashboard = lazy(() => import('@/pages/ValidationDashboard'));
const PaymentSuccess = lazy(() => import('@/pages/PaymentSuccess'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const AdminPanel = lazy(() => import('@/pages/AdminPanel'));

function App() {
  console.log('App: Starting without auth (Phase 1)');
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* All routes are now public */}
            <Route path="/" element={<Index />} />
            <Route path="/validation" element={<ValidationDashboard />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/admin" element={<AdminPanel />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster />
      </div>
    </ErrorBoundary>
  );
}

export default App;
