
import React from 'react';
import { Card } from "@/components/ui/card";
import LoginHeader from '@/components/auth/LoginHeader';
import ContributorLoginForm from '@/components/auth/ContributorLoginForm';

const ContributorLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <LoginHeader />
          <ContributorLoginForm />
        </Card>
      </div>
    </div>
  );
};

export default ContributorLogin;
