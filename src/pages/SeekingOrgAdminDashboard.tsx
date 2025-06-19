
import React, { useState, useEffect } from 'react';
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Database, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { UserDataProvider, useUserData } from "@/components/dashboard/UserDataProvider";
import ReadOnlyOrganizationData from "@/components/dashboard/ReadOnlyOrganizationData";
import { MembershipService } from '@/services/MembershipService';
import MembershipJoinCard from '@/components/membership/MembershipJoinCard';
import EngagementModelView from '@/components/engagement/EngagementModelView';
import EngagementModelSelector from '@/components/engagement/EngagementModelSelector';

const DashboardContent = () => {
  const { userData, isLoading, showLoginWarning } = useUserData();
  const [membershipStatus, setMembershipStatus] = useState<'active' | 'inactive'>('inactive');
  const [engagementSelection, setEngagementSelection] = useState<any>(null);
  const [showEngagementSelector, setShowEngagementSelector] = useState(false);

  // Load data when user changes
  useEffect(() => {
    if (userData.userId) {
      console.log('🔄 Loading admin dashboard data for user:', userData.userId);
      
      const membership = MembershipService.getMembershipData(userData.userId);
      setMembershipStatus(membership.status);
      
      const selection = MembershipService.getEngagementSelection(userData.userId);
      setEngagementSelection(selection);
      
      console.log('📊 Admin dashboard data loaded:', { 
        membership: membership.status, 
        hasSelection: !!selection,
        selection: selection 
      });
    }
  }, [userData.userId]);

  const handleMembershipChange = (status: 'active' | 'inactive') => {
    console.log('🔄 Membership status changed to:', status);
    setMembershipStatus(status);
    
    // Refresh engagement selection to reflect pricing adjustments
    if (status === 'active') {
      const updatedSelection = MembershipService.getEngagementSelection(userData.userId);
      setEngagementSelection(updatedSelection);
      console.log('🎯 Updated selection after membership change:', updatedSelection);
    }
  };

  const handleSelectionSaved = () => {
    console.log('🔄 Refreshing engagement selection after save');
    const updatedSelection = MembershipService.getEngagementSelection(userData.userId);
    setEngagementSelection(updatedSelection);
    setShowEngagementSelector(false);
    console.log('✅ Selection refreshed:', updatedSelection);
  };

  const handleSelectModel = () => {
    console.log('🔄 Opening engagement model selector for new selection');
    setShowEngagementSelector(true);
  };

  const handleModifySelection = () => {
    console.log('🔄 MODIFY SELECTION CALLED - opening engagement model selector from admin dashboard');
    console.log('🔍 Current engagement selection:', engagementSelection);
    console.log('🔍 Current membership status:', membershipStatus);
    console.log('🔍 Setting showEngagementSelector to true');
    setShowEngagementSelector(true);
  };

  const handleCloseSelector = () => {
    console.log('🔄 Closing engagement model selector');
    setShowEngagementSelector(false);
  };

  const handleRefreshData = () => {
    window.location.reload();
  };

  if (showLoginWarning) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            No Organization Data Found
          </h3>
          <p className="text-red-700 mb-4">
            No seeking organization registration data was found. Please complete the registration process first.
          </p>
          <div className="space-x-4">
            <Link to="/seeker-registration">
              <Button className="bg-red-600 hover:bg-red-700">
                Complete Registration
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={handleRefreshData}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Organization Dashboard
            </h2>
            <p className="text-gray-600">
              View your organization registration details and current status.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRefreshData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>
      
      {/* Admin Debug info */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Database className="h-4 w-4 text-blue-600" />
          <p className="text-sm text-blue-700 font-medium">
            Administrator View - Registration Details
          </p>
        </div>
        <div className="text-xs text-blue-600 space-y-1">
          <p>• Organization: {userData.organizationName || 'Not found'}</p>
          <p>• Entity Type: {userData.entityType}</p>
          <p>• Country: {userData.country}</p>
          <p>• Organization Type: {userData.organizationType}</p>
          <p>• Status: Registration Complete</p>
        </div>
      </div>

      {/* Read-only Organization Data */}
      <ReadOnlyOrganizationData />

      {/* Membership Section */}
      <div className="mt-6 mb-6">
        <MembershipJoinCard
          userId={userData.userId}
          membershipStatus={membershipStatus}
          onMembershipChange={handleMembershipChange}
        />
      </div>

      {/* Engagement Model Section */}
      <div className="mt-6 mb-6">
        <EngagementModelView
          selection={engagementSelection}
          onSelectModel={handleSelectModel}
          onModifySelection={handleModifySelection}
        />
      </div>

      {/* Engagement Model Selector Modal */}
      {showEngagementSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <EngagementModelSelector
            userId={userData.userId}
            isMember={membershipStatus === 'active'}
            onClose={handleCloseSelector}
            onSelectionSaved={handleSelectionSaved}
          />
        </div>
      )}
    </div>
  );
};

const SeekingOrgAdminDashboard = () => {
  console.log('🔍 SeekingOrgAdminDashboard rendering with engagement model functionality...');
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex w-full">
        {/* Sidebar */}
        <AppSidebar activeSection="solution-seekers" setActiveSection={() => {}} />
        
        {/* Main Content Area */}
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <Link to="/seeking-org-admin-login">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </Link>
                  <div className="h-6 w-px bg-gray-300" />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h1 className="font-bold text-xl text-gray-900">
                        Organization Dashboard
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        Registration Details & Status
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Registered</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <UserDataProvider>
                <DashboardContent />
              </UserDataProvider>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SeekingOrgAdminDashboard;
