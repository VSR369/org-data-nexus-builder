
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContributorLoginForm from '@/components/auth/ContributorLoginForm';

const ContributorLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Contributor Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContributorLoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContributorLogin;
