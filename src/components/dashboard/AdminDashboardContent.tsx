
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useUserData } from "@/components/dashboard/UserDataProvider";
import ReadOnlyOrganizationData from "@/components/dashboard/ReadOnlyOrganizationData";
import { MembershipService } from '@/services/MembershipService';
import MembershipJoinCard from '@/components/membership/MembershipJoinCard';
import EngagementModelView from '@/components/engagement/EngagementModelView';
import { EngagementModel } from '@/components/master-data/engagement-models/types';
import { PricingConfig } from '@/types/pricing';
import AdminDebugInfo from './AdminDebugInfo';
import AdminLoginWarning from './AdminLoginWarning';

// Import the comprehensive engagement model selector
import EngagementModelSelector from '@/components/dashboard/EngagementModelSelector';

const AdminDashboardContent: React.FC = () => {
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

  const handleEngagementModelSelect = (model: EngagementModel, pricing?: PricingConfig | null, selectedPlan?: string) => {
    console.log('🔄 Engagement model selected from dashboard selector:', { model, pricing, selectedPlan });
    
    // Create selection object compatible with MembershipService
    const selection = {
      model: model.name,
      duration: selectedPlan || '6 months',
      pricing: {
        currency: pricing?.currency || 'USD',
        originalAmount: pricing?.quarterlyFee || 0,
        discountedAmount: membershipStatus === 'active' && pricing?.discountPercentage 
          ? Math.round((pricing.quarterlyFee || 0) * (1 - pricing.discountPercentage / 100))
          : undefined,
        frequency: 'quarterly'
      },
      selectedAt: new Date().toISOString()
    };
    
    // Save using MembershipService
    MembershipService.saveEngagementSelection(userData.userId, selection);
    
    // Update local state
    setEngagementSelection(selection);
    setShowEngagementSelector(false);
    
    console.log('✅ Engagement selection saved and updated:', selection);
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
    return <AdminLoginWarning onRefresh={handleRefreshData} />;
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
      <AdminDebugInfo userData={userData} />

      {/* Read-only Organization Data - without engagement model status */}
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
        <EngagementModelSelector
          onClose={handleCloseSelector}
          onSelect={handleEngagementModelSelect}
          userCountry={userData.country}
          userOrgType={userData.organizationType}
          membershipStatus={membershipStatus}
          currentSelectedModel={engagementSelection ? { 
            id: engagementSelection.model.toLowerCase().replace(/\s+/g, '-'),
            name: engagementSelection.model,
            description: `Selected ${engagementSelection.model}`,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } : null}
          currentSelectedPricingPlan={engagementSelection?.duration === '3 months' ? 'quarterly' : 
                                      engagementSelection?.duration === '6 months' ? 'halfyearly' : 'annual'}
        />
      )}
    </div>
  );
};

export default AdminDashboardContent;
