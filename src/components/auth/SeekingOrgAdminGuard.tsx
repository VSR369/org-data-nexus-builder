
import React, { useEffect } from 'react';
import { useSeekingOrgAdminAuth } from '@/hooks/useSeekingOrgAdminAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SeekingOrgAdminGuardProps {
  children: React.ReactNode;
}

const SeekingOrgAdminGuard: React.FC<SeekingOrgAdminGuardProps> = ({ children }) => {
  const { isAuthenticated, currentAdmin, checkAuthStatus } = useSeekingOrgAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = checkAuthStatus();
    if (!isLoggedIn) {
      navigate('/signin');
    }
  }, [checkAuthStatus, navigate]);

  if (!isAuthenticated || !currentAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Access Restricted
            </h2>
            <p className="text-gray-600 mb-4">
              You need to be signed in as a Seeking Organization Administrator to access this area.
            </p>
            <Button 
              onClick={() => navigate('/signin')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Shield className="h-4 w-4 mr-2" />
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default SeekingOrgAdminGuard;
