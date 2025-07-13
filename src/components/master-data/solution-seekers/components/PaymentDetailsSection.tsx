import React from 'react';
import { Badge } from "@/components/ui/badge";
import { safeRender, isPaaSModel } from '../utils/viewDetailsHelpers';
// Simple helpers - removed pricing dependencies

interface PaymentDetailsSectionProps {
  membershipData: any;
  pricingData: any;
  isMobile?: boolean;
}

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

const PaymentDetailsSection: React.FC<PaymentDetailsSectionProps> = ({ membershipData, pricingData, isMobile }) => {
  // Show data source for debugging if not production
  const showDataSource = membershipData?.dataSource || pricingData?.dataSource;
  
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
      
      {/* Membership Details */}
      {membershipData && (
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Membership Details</h4>
          <div className={`bg-green-50 p-3 rounded text-sm space-y-2 ${isMobile ? "text-xs" : ""}`}>
            <div className={`flex items-center ${isMobile ? "flex-col items-start gap-1" : "justify-between"}`}>
              <span className="font-medium">Membership Status:</span>
              <Badge variant={membershipData.status === 'member_paid' ? 'default' : 'secondary'}>
                {membershipData.status === 'member_paid' ? 'Premium Member' : 'Not a Member'}
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
  );
};

export default PaymentDetailsSection;