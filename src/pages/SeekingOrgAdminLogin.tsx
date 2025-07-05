
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import SolutionSeekingOrgLogin from '@/components/auth/SolutionSeekingOrgLogin';

const SeekingOrgAdminLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <SolutionSeekingOrgLogin />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeekingOrgAdminLogin;
