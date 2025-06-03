
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { PageLoader } from '@/components/LoadingStates';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicRoute } from '@/components/auth/PublicRoute';

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const ValidationDashboard = lazy(() => import('@/pages/ValidationDashboard'));
const PaymentSuccess = lazy(() => import('@/pages/PaymentSuccess'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const AdminPanel = lazy(() => import('@/pages/AdminPanel'));

function App() {
  console.log('App: Starting with fresh auth setup');
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route 
                path="/" 
                element={
                  <PublicRoute redirectTo="/validation">
                    <Index />
                  </PublicRoute>
                } 
              />
              
              {/* Protected routes */}
              <Route 
                path="/validation" 
                element={
                  <ProtectedRoute>
                    <ValidationDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payment-success" 
                element={
                  <ProtectedRoute>
                    <PaymentSuccess />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Toaster />
        </AuthProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;
