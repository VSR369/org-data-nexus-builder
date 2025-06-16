
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, Users } from 'lucide-react';
import LoginHeader from '@/components/auth/LoginHeader';
import LoginForm from '@/components/auth/LoginForm';
import RegisteredUsersDisplay from '@/components/auth/RegisteredUsersDisplay';

const SeekerLogin = () => {
  const [selectedCredentials, setSelectedCredentials] = useState<{
    userId: string;
    password: string;
  } | null>(null);

  const handleSelectUser = (userId: string, password: string) => {
    setSelectedCredentials({ userId, password });
    // Switch to login tab after selecting credentials
    const loginTab = document.querySelector('[data-state="active"]') as HTMLElement;
    if (loginTab) {
      const loginTrigger = document.querySelector('[value="login"]') as HTMLElement;
      if (loginTrigger) {
        loginTrigger.click();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="shadow-xl border-0">
          <LoginHeader />
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mx-6 mb-4">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Registered Users
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-0">
              <LoginForm prefilledCredentials={selectedCredentials} />
            </TabsContent>
            
            <TabsContent value="users" className="mt-0 px-6 pb-6">
              <RegisteredUsersDisplay onSelectUser={handleSelectUser} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default SeekerLogin;
