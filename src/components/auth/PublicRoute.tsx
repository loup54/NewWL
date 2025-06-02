
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/LoadingStates';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectTo = '/validation' 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('PublicRoute: Checking auth state', { user: !!user, loading });

  if (loading) {
    return <PageLoader />;
  }

  if (user) {
    console.log('PublicRoute: User authenticated, redirecting to', redirectTo);
    // If user came from a protected route, redirect there, otherwise use default
    const from = location.state?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  console.log('PublicRoute: User not authenticated, rendering public content');
  return <>{children}</>;
};
