
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { LoadingStates } from '@/components/LoadingStates';
import config from '@/utils/environment';

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function App() {
  console.log(`WordLens ${config.app.version} running in ${config.environment} mode`);
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Suspense fallback={<LoadingStates.PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster />
      </div>
    </ErrorBoundary>
  );
}

export default App;
