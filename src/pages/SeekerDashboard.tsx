import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { UserDataProvider, useUserData } from '@/components/dashboard/UserDataProvider';
import { MembershipService } from '@/services/MembershipService';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoginWarning from '@/components/dashboard/LoginWarning';
import OrganizationInfoCard from '@/components/dashboard/OrganizationInfoCard';
import MembershipJoinCard from '@/components/membership/MembershipJoinCard';
import EngagementModelView from '@/components/engagement/EngagementModelView';
import EngagementModelSelector from '@/components/engagement/EngagementModelSelector';

const SeekerDashboardContent: React.FC = () => {
  const { userData, isLoading, showLoginWarning, handleLogout } = useUserData();
  const [membershipStatus, setMembershipStatus] = useState<'active' | 'inactive'>('inactive');
  const [engagementSelection, setEngagementSelection] = useState<any>(null);
  const [showEngagementSelector, setShowEngagementSelector] = useState(false);

  // Load data when user changes
  useEffect(() => {
    if (userData.userId) {
      console.log('🔄 Loading dashboard data for user:', userData.userId);
      
      const membership = MembershipService.getMembershipData(userData.userId);
      setMembershipStatus(membership.status);
      
      const selection = MembershipService.getEngagementSelection(userData.userId);
      setEngagementSelection(selection);
      
      console.log('📊 Dashboard data loaded:', { 
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
    console.log('🔄 Modify Selection clicked - opening engagement model selector');
    console.log('🔍 Current engagement selection:', engagementSelection);
    console.log('🔍 Current membership status:', membershipStatus);
    setShowEngagementSelector(true);
  };

  const handleCloseSelector = () => {
    console.log('🔄 Closing engagement model selector');
    setShowEngagementSelector(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p>Loading dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <DashboardHeader onLogout={handleLogout} userId={userData.userId} />
      
      <div className="max-w-7xl mx-auto p-6">
        <LoginWarning show={showLoginWarning} />
        <OrganizationInfoCard />

        <div className="mt-6 mb-6">
          <MembershipJoinCard
            userId={userData.userId}
            membershipStatus={membershipStatus}
            onMembershipChange={handleMembershipChange}
          />
        </div>

        <div className="mt-6 mb-6">
          <EngagementModelView
            selection={engagementSelection}
            onSelectModel={handleSelectModel}
            onModifySelection={handleModifySelection}
          />
        </div>

        {showEngagementSelector && (
          <EngagementModelSelector
            userId={userData.userId}
            isMember={membershipStatus === 'active'}
            onClose={handleCloseSelector}
            onSelectionSaved={handleSelectionSaved}
          />
        )}
      </div>
    </div>
  );
};

const SeekerDashboard: React.FC = () => {
  return (
    <UserDataProvider>
      <SeekerDashboardContent />
    </UserDataProvider>
  );
};

export default SeekerDashboard;
