
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { PageLoader } from '@/components/LoadingStates';
import { AuthProvider } from '@/contexts/AuthContext';
import { SessionManager } from '@/components/SessionManager';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicRoute } from '@/components/auth/PublicRoute';
import config from '@/utils/environment';

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const ValidationDashboard = lazy(() => import('@/pages/ValidationDashboard'));
const PaymentSuccess = lazy(() => import('@/pages/PaymentSuccess'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const AdminPanel = lazy(() => import('@/pages/AdminPanel'));

function App() {
  console.log(`WordLens ${config.app.version} running in ${config.environment} mode`);
  console.log('App: Starting application with route protection and session management');
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <AuthProvider>
          <SessionManager>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes - accessible to everyone, but redirect authenticated users */}
                <Route 
                  path="/" 
                  element={
                    <PublicRoute redirectTo="/validation">
                      <Index />
                    </PublicRoute>
                  } 
                />
                
                {/* Protected routes - require authentication */}
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
                
                {/* 404 route - accessible to everyone */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </SessionManager>
          <Toaster />
        </AuthProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;
