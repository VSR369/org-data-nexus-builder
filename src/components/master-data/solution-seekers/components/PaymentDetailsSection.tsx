
import React, { useState, useCallback } from 'react';
import { Badge } from "@/components/ui/badge";
import { safeRender } from '../utils/viewDetailsHelpers';
import ActiveMemberDetailsView from './ActiveMemberDetailsView';
import InactiveMemberEditView from './InactiveMemberEditView';
import { useComprehensiveMemberData } from '@/hooks/useComprehensiveMemberData';

interface PaymentDetailsSectionProps {
  membershipData: any;
  pricingData: any;
  userId?: string;
  isMobile?: boolean;
}

// Helper function to determine if membership is truly active
const isMembershipActive = (membershipData: any): boolean => {
  return (
    membershipData?.status === 'member_paid' || 
    membershipData?.status === 'Active' ||
    membershipData?.membership_status === 'active' ||
    (membershipData?.paymentStatus === 'paid' && membershipData?.status === 'Active') ||
    (membershipData?.mem_payment_status === 'paid' && membershipData?.membership_status === 'active')
  );
};

// Helper function to get the correct pricing display
const getPricingDisplay = (pricingData: any) => {
  if (!pricingData || pricingData.paymentStatus !== 'paid' || !pricingData.paymentAmount) {
    return null;
  }

  // Use pricingStructure from payment record if available
  if (pricingData.pricingStructure === 'percentage') {
    return `${pricingData.paymentAmount}%`;
  }
  
  // For marketplace model, show percentage
  if (pricingData.engagementModel === 'marketplace') {
    return `${pricingData.paymentAmount}%`;
  }
  
  // Default to currency display
  return `${pricingData.paymentCurrency} ${pricingData.paymentAmount}`;
};

const PaymentDetailsSection: React.FC<PaymentDetailsSectionProps> = ({ 
  membershipData, 
  pricingData, 
  userId,
  isMobile 
}) => {
  const [refreshKey, setRefreshKey] = useState(0); // For forcing re-fetch after payment
  
  // Fetch comprehensive member data if userId is provided
  const { memberData, loading, refetch } = useComprehensiveMemberData(userId || null);
  
  // Show data source for debugging if not production
  const showDataSource = membershipData?.dataSource || pricingData?.dataSource;
  
  // Determine membership status - check both sources
  const isActiveMember = isMembershipActive(membershipData) || 
    (memberData?.membershipData && isMembershipActive(memberData.membershipData));

  // Callback for successful payment
  const handlePaymentSuccess = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    if (refetch) {
      refetch();
    }
  }, [refetch]);

  // Loading state
  if (loading && userId) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Loading membership details...</span>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? "space-y-3" : "space-y-4"}`}>
      {/* Data Source Indicator (for debugging) */}
      {showDataSource && showDataSource !== 'organization-specific' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs">
          <span className="font-medium text-yellow-700">Data Source:</span> {showDataSource}
          {showDataSource === 'no-data' && (
            <span className="text-yellow-600 ml-2">No organization-specific data found</span>
          )}
        </div>
      )}

      {/* ACTIVE MEMBER - VIEW ONLY MODE */}
      {isActiveMember && (memberData?.membershipData || membershipData) && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="default" className="bg-green-100 text-green-800">
              Active Membership - View Only
            </Badge>
          </div>
          <ActiveMemberDetailsView 
            membershipData={memberData?.membershipData || membershipData}
            engagementData={memberData?.engagementData}
            isMobile={isMobile}
          />
        </div>
      )}

      {/* INACTIVE MEMBER - EDIT MODE */}
      {!isActiveMember && userId && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="destructive">
              Inactive Membership - Activation Required
            </Badge>
          </div>
          <InactiveMemberEditView
            userId={userId}
            organizationData={membershipData}
            onPaymentSuccess={handlePaymentSuccess}
            isMobile={isMobile}
          />
        </div>
      )}

      {/* FALLBACK - Legacy Display for non-userId scenarios */}
      {!userId && (membershipData || pricingData) && (
        <div>
          <div className="mb-4">
            <Badge variant="secondary">
              Legacy View - Limited Information
            </Badge>
          </div>
          
          {/* Membership Details */}
          {membershipData && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Membership Details</h4>
              <div className={`bg-green-50 p-3 rounded text-sm space-y-2 ${isMobile ? "text-xs" : ""}`}>
                <div className={`flex items-center ${isMobile ? "flex-col items-start gap-1" : "justify-between"}`}>
                  <span className="font-medium">Membership Status:</span>
                  <Badge variant={isMembershipActive(membershipData) ? 'default' : 'secondary'}>
                    {isMembershipActive(membershipData) ? 'Premium Member' : 'Not a Member'}
                  </Badge>
                </div>
                {membershipData.selectedPlan && (
                  <div><span className="font-medium">Plan:</span> {safeRender(membershipData.selectedPlan)}</div>
                )}
                <div className={`flex items-center ${isMobile ? "flex-col items-start gap-1" : "justify-between"}`}>
                  <span className="font-medium">Payment Status:</span>
                  <Badge variant={membershipData.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                    {membershipData.paymentStatus}
                  </Badge>
                </div>
                {membershipData.paymentStatus === 'paid' && membershipData.paymentAmount > 0 && (
                  <div><span className="font-medium">Amount Paid:</span> {membershipData.paymentCurrency} {membershipData.paymentAmount}</div>
                )}
                {membershipData.paidAt && (
                  <div><span className="font-medium">Paid On:</span> {new Date(membershipData.paidAt).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          )}

          {/* Engagement Model Details */}
          {pricingData && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Engagement Model Details</h4>
              <div className={`bg-blue-50 p-3 rounded text-sm space-y-2 ${isMobile ? "text-xs" : ""}`}>
                {pricingData.engagementModel && (
                  <div><span className="font-medium">Engagement Model:</span> {safeRender(pricingData.engagementModel)}</div>
                )}
                {pricingData.selectedFrequency && (
                  <div><span className="font-medium">Billing Frequency:</span> {safeRender(pricingData.selectedFrequency)}</div>
                )}
                <div className={`flex items-center ${isMobile ? "flex-col items-start gap-1" : "justify-between"}`}>
                  <span className="font-medium">Payment Status:</span>
                  <Badge variant={pricingData.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                    {pricingData.paymentStatus}
                  </Badge>
                </div>
                {pricingData.paymentStatus === 'paid' && pricingData.paymentAmount > 0 && (
                  <div><span className="font-medium">Amount Paid:</span> {getPricingDisplay(pricingData)}</div>
                )}
                {pricingData.paidAt && (
                  <div><span className="font-medium">Paid On:</span> {new Date(pricingData.paidAt).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentDetailsSection;
