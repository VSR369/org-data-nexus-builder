
import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import SolutionSeekingOrgLogin from '@/components/auth/SolutionSeekingOrgLogin';
import AuthDebugPanel from '@/components/auth/AuthDebugPanel';

const SeekingOrgAdminLogin = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [prefilledEmail, setPrefilledEmail] = useState<string>('');
  const [routeSource, setRouteSource] = useState<'direct' | 'general-signin' | 'post-registration' | 'post-signup' | 'legacy'>('direct');

  useEffect(() => {
    // Handle different route sources
    console.log('🔍 LOGIN - Analyzing route source and parameters...');
    console.log('🔍 LOGIN - Current pathname:', location.pathname);
    console.log('🔍 LOGIN - Search params:', Object.fromEntries(searchParams));
    console.log('🔍 LOGIN - Location state:', location.state);

    // Check for email parameter from URL
    const emailParam = searchParams.get('email');
    if (emailParam) {
      console.log('📧 LOGIN - Email parameter found:', emailParam);
      setPrefilledEmail(emailParam);
      setRouteSource('post-signup');
    }

    // Check for email from navigation state (post-registration)
    if (location.state?.email) {
      console.log('📧 LOGIN - Email from navigation state:', location.state.email);
      setPrefilledEmail(location.state.email);
      setRouteSource('post-registration');
    }

    // Determine route source based on pathname
    if (location.pathname === '/solution-seeking-org/login') {
      console.log('🎯 LOGIN - Direct organization login route');
      setRouteSource('direct');
    } else if (location.pathname === '/seeking-org-admin-login') {
      // This could be from general signin or legacy route
      if (location.state?.fromGeneralSignin) {
        console.log('🔄 LOGIN - From general sign-in selection');
        setRouteSource('general-signin');
      } else {
        console.log('🔗 LOGIN - Legacy route access');
        setRouteSource('legacy');
      }
    }
  }, [location, searchParams]);

  const handleLoginSuccess = (userData: any) => {
    console.log('✅ LOGIN - Success callback triggered');
    console.log('📊 LOGIN - Route source was:', routeSource);
    console.log('📊 LOGIN - Pre-filled email was:', prefilledEmail);
    // Additional success handling can be added here based on route source
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col items-center justify-center p-4 space-y-6">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <SolutionSeekingOrgLogin 
              onSuccess={handleLoginSuccess}
              prefilledEmail={prefilledEmail}
              routeSource={routeSource}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Debug Panel - Remove in production */}
      <div className="w-full max-w-4xl">
        <AuthDebugPanel />
      </div>
    </div>
  );
};

export default SeekingOrgAdminLogin;
