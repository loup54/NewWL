
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

console.log('Creating QueryClient...');
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: false,
    },
  },
});
console.log('QueryClient created successfully');

const App = () => {
  console.log('App component render start');
  
  try {
    console.log('Creating App JSX...');
    const appJsx = (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </QueryClientProvider>
      </ErrorBoundary>
    );
    console.log('App JSX created, returning...');
    return appJsx;
  } catch (error) {
    console.error('CRITICAL ERROR in App component:', error);
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    throw error;
  }
};

export default App;
