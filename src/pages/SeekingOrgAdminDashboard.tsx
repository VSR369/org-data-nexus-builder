
import React, { useState } from 'react';
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { UserDataProvider } from "@/components/dashboard/UserDataProvider";
import AdminDashboardHeader from "@/components/dashboard/AdminDashboardHeader";
import AdminDashboardContent from "@/components/dashboard/AdminDashboardContent";
import SeekingOrgAdminGuard from "@/components/auth/SeekingOrgAdminGuard";

const SeekingOrgAdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  
  console.log('🔍 SeekingOrgAdminDashboard rendering with dedicated admin sidebar...');
  
  const handleRefreshData = () => {
    window.location.reload();
  };

  return (
    <SeekingOrgAdminGuard>
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex w-full">
          {/* Dedicated Admin Sidebar */}
          <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          
          {/* Main Content Area */}
          <SidebarInset className="flex-1">
            {/* Header */}
            <AdminDashboardHeader onRefreshData={handleRefreshData} />

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <UserDataProvider>
                  <AdminDashboardContent />
                </UserDataProvider>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </SeekingOrgAdminGuard>
  );
};

export default SeekingOrgAdminDashboard;
