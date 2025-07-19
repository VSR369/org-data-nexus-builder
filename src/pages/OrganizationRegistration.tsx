
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '../components/AppSidebar';
import { OrganizationRegistrationForm } from '../components/organization/OrganizationRegistrationForm';

const OrganizationRegistration = () => {
  const [activeSection, setActiveSection] = useState('');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Organization Registration</h1>
                <p className="text-lg text-muted-foreground">
                  Join our platform as a Solution Seeking or Solution Providing organization
                </p>
              </div>
            </div>
            <OrganizationRegistrationForm />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default OrganizationRegistration;
