
import React from 'react';
import { Card } from "@/components/ui/card";
import LoginHeader from '@/components/auth/LoginHeader';
import LoginForm from '@/components/auth/LoginForm';

const SeekerLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <LoginHeader />
          <LoginForm />
        </Card>
      </div>
    </div>
  );
};

export default SeekerLogin;
