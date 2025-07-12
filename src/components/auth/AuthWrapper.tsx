import React from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallbackMessage?: string;
  showSignUp?: boolean;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({
  children,
  requireAuth = true,
  fallbackMessage = "Please sign in to continue",
  showSignUp = true
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Checking authentication...</span>
      </div>
    );
  }

  if (requireAuth && !user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle>Authentication Required</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">{fallbackMessage}</p>
          <div className="space-y-2">
            <Link to="/auth" className="block">
              <Button className="w-full">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            {showSignUp && (
              <Link to="/auth?mode=signup" className="block">
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};