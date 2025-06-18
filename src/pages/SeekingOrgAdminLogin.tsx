
import React from 'react';
import { Card } from "@/components/ui/card";
import SeekingOrgAdminLoginHeader from '@/components/auth/SeekingOrgAdminLoginHeader';
import LoginForm from '@/components/auth/LoginForm';

const SeekingOrgAdminLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <SeekingOrgAdminLoginHeader />
          <LoginForm />
        </Card>
      </div>
    </div>
  );
};

export default SeekingOrgAdminLogin;
