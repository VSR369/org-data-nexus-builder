
import React from 'react';
import { Card } from "@/components/ui/card";
import SeekingOrgAdminLoginHeader from '@/components/auth/SeekingOrgAdminLoginHeader';
import SolutionSeekingOrgLoginForm from '@/components/auth/SolutionSeekingOrgLoginForm';
import UserDataDebugger from '@/components/debug/UserDataDebugger';

const SeekingOrgAdminLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-4">
        <Card className="shadow-xl border-0">
          <SeekingOrgAdminLoginHeader />
          <SolutionSeekingOrgLoginForm />
        </Card>
      </div>
      
      {/* Debug component - remove this after fixing the issue */}
      <div className="w-full max-w-4xl">
        <UserDataDebugger />
      </div>
    </div>
  );
};

export default SeekingOrgAdminLogin;
