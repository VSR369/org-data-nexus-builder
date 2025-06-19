
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { UserDataProvider, useUserData } from '@/components/dashboard/UserDataProvider';
import { MembershipService } from '@/services/MembershipService';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoginWarning from '@/components/dashboard/LoginWarning';
import OrganizationInfoCard from '@/components/dashboard/OrganizationInfoCard';
import MembershipJoinCard from '@/components/membership/MembershipJoinCard';
import EngagementModelView from '@/components/engagement/EngagementModelView';
import EngagementModelSelector from '@/components/engagement/EngagementModelSelector';

const SeekerDashboardContent: React.FC = () => {
  const navigate = useNavigate();
  const { userData, isLoading, showLoginWarning, handleLogout } = useUserData();
  
  const [membershipStatus, setMembershipStatus] = useState<'active' | 'inactive'>('inactive');
  const [engagementSelection, setEngagementSelection] = useState<any>(null);
  const [showEngagementSelector, setShowEngagementSelector] = useState(false);

  // Load membership and engagement data
  useEffect(() => {
    if (userData.userId) {
      const membership = MembershipService.getMembershipData(userData.userId);
      setMembershipStatus(membership.status);
      
      const selection = MembershipService.getEngagementSelection(userData.userId);
      setEngagementSelection(selection);
      
      console.log('📊 Dashboard data loaded:', { membership, selection });
    }
  }, [userData.userId]);

  const handleMembershipChange = (status: 'active' | 'inactive') => {
    setMembershipStatus(status);
    
    // Auto-adjust existing engagement selection if user became a member
    if (status === 'active' && engagementSelection) {
      const updatedSelection = MembershipService.getEngagementSelection(userData.userId);
      setEngagementSelection(updatedSelection);
    }
  };

  const handleSelectionSaved = () => {
    const updatedSelection = MembershipService.getEngagementSelection(userData.userId);
    setEngagementSelection(updatedSelection);
  };

  const handleSelectEngagementModel = () => {
    setShowEngagementSelector(true);
  };

  const handleModifySelection = () => {
    setShowEngagementSelector(true);
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

        {/* Organization Information Header */}
        <OrganizationInfoCard />

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
            onSelectModel={handleSelectEngagementModel}
            onModifySelection={handleModifySelection}
          />
        </div>

        {/* Engagement Model Selector Modal */}
        {showEngagementSelector && (
          <EngagementModelSelector
            userId={userData.userId}
            isMember={membershipStatus === 'active'}
            onClose={() => setShowEngagementSelector(false)}
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
