import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Building2, User, IdCard, Shield } from "lucide-react";
import { useUserData } from "@/components/dashboard/UserDataProvider";
import ReadOnlyOrganizationData from "@/components/dashboard/ReadOnlyOrganizationData";
import { MembershipService } from '@/services/MembershipService';
import MembershipJoinCard from '@/components/membership/MembershipJoinCard';
import EngagementModelView from '@/components/engagement/EngagementModelView';
import { EngagementModel } from '@/components/master-data/engagement-models/types';
import { PricingConfig } from '@/types/pricing';
import AdminDebugInfo from './AdminDebugInfo';
import AdminLoginWarning from './AdminLoginWarning';
import DataCleanupButton from '@/components/admin/DataCleanupButton';
import { useSeekingOrgAdminAuth } from '@/hooks/useSeekingOrgAdminAuth';
import EngagementModelSelector from '@/components/dashboard/EngagementModelSelector';

const AdminDashboardContent: React.FC = () => {
  const { userData, isLoading, showLoginWarning } = useUserData();
  const { currentOrganization } = useSeekingOrgAdminAuth();
  const [membershipStatus, setMembershipStatus] = useState<'active' | 'inactive'>('inactive');
  const [engagementSelection, setEngagementSelection] = useState<any>(null);
  const [showEngagementSelector, setShowEngagementSelector] = useState(false);

  useEffect(() => {
    if (userData.userId) {
      console.log('🔄 Loading admin dashboard data for user:', userData.userId);
      const membership = MembershipService.getMembershipData(userData.userId);
      setMembershipStatus(membership.status);
      const selection = MembershipService.getEngagementSelection(userData.userId);
      setEngagementSelection(selection);
    }
  }, [userData.userId]);

  const handleMembershipChange = (status: 'active' | 'inactive') => {
    setMembershipStatus(status);
    if (status === 'active') {
      const updatedSelection = MembershipService.getEngagementSelection(userData.userId);
      setEngagementSelection(updatedSelection);
    }
  };

  const handleEngagementModelSelect = (model: EngagementModel, pricing?: PricingConfig | null, selectedPlan?: string) => {
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
    
    MembershipService.saveEngagementSelection(userData.userId, selection);
    setEngagementSelection(selection);
    setShowEngagementSelector(false);
  };

  const handleSelectModel = () => setShowEngagementSelector(true);
  const handleModifySelection = () => setShowEngagementSelector(true);
  const handleCloseSelector = () => setShowEngagementSelector(false);
  const handleRefreshData = () => window.location.reload();

  if (showLoginWarning) {
    return <AdminLoginWarning onRefresh={handleRefreshData} />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Administrator Dashboard
              {currentOrganization && (
                <span className="ml-2 text-lg font-medium text-green-600">
                  - {currentOrganization.organizationName}
                </span>
              )}
            </h2>
            <p className="text-gray-600">Manage your organization and administrator settings.</p>
          </div>
          <div className="flex items-center gap-3">
            <DataCleanupButton />
            <Button variant="outline" onClick={handleRefreshData} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      {currentOrganization && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-600" />
              Administrator Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Organization</p>
                    <p className="text-lg font-semibold text-gray-900">{currentOrganization.organizationName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <IdCard className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Organization ID</p>
                    <p className="text-lg font-mono text-gray-900">{currentOrganization.organizationId}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Administrator Role</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {currentOrganization.role?.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Permissions</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {currentOrganization.permissions?.map((permission, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {permission.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <AdminDebugInfo userData={userData} />
      <ReadOnlyOrganizationData />

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