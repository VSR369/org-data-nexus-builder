import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/general-signin' 
}) => {
  const { authenticated, loading } = useAuthSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && requireAuth && !authenticated) {
      console.log('🔒 ROUTE GUARD - Authentication required, redirecting to:', redirectTo);
      navigate(redirectTo, { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  }, [authenticated, loading, requireAuth, navigate, redirectTo, location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !authenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
};

export default RouteGuard;