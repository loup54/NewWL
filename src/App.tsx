<<<<<<< HEAD
import React, { Suspense, lazy } from 'react';
=======

import { Suspense, lazy } from 'react';
>>>>>>> 78b4fbc6a05d82465a5c297dd289cc2a68d61a59
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { PageLoader } from '@/components/LoadingStates';
<<<<<<< HEAD
import { AuthProvider } from '@/contexts/AuthContext';
import config from '@/utils/environment';
import { Header } from './components/Header';
import DocumentAnalysisPage from './pages/DocumentAnalysisPage';
import { DocumentComparisonPage } from './pages/DocumentComparisonPage';
import { SupabaseTest } from './components/SupabaseTest';
=======
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
>>>>>>> 78b4fbc6a05d82465a5c297dd289cc2a68d61a59

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const ValidationDashboard = lazy(() => import('@/pages/ValidationDashboard'));
const PaymentSuccess = lazy(() => import('@/pages/PaymentSuccess'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const AdminPanel = lazy(() => import('@/pages/AdminPanel'));

function App() {
  console.log('App: Loading WordLens with full access - no authentication barriers');
  
  return (
    <ErrorBoundary>
      <UserPreferencesProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <SupabaseTest />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/validation" element={<ValidationDashboard />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/analyze" element={<DocumentAnalysisPage />} />
                <Route path="/compare" element={<DocumentComparisonPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Toaster />
        </div>
      </UserPreferencesProvider>
    </ErrorBoundary>
  );
}

export default App;
