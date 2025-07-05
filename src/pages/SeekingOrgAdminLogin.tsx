
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import SolutionSeekingOrgLogin from '@/components/auth/SolutionSeekingOrgLogin';
import AuthDebugPanel from '@/components/auth/AuthDebugPanel';

const SeekingOrgAdminLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col items-center justify-center p-4 space-y-6">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <SolutionSeekingOrgLogin />
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
