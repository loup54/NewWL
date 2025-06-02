
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/LoadingStates';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: Checking auth state', { user: !!user, loading });

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    console.log('ProtectedRoute: User not authenticated, redirecting to home');
    // Redirect to home page with return path
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute: User authenticated, rendering protected content');
  return <>{children}</>;
};
