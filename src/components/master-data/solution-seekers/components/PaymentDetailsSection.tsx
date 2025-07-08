import React from 'react';
import { Badge } from "@/components/ui/badge";
import { safeRender, isPaaSModel } from '../utils/viewDetailsHelpers';

interface PaymentDetailsSectionProps {
  membershipData: any;
  pricingData: any;
}

const PaymentDetailsSection: React.FC<PaymentDetailsSectionProps> = ({ membershipData, pricingData }) => {
  return (
    <div className="space-y-4">
      {/* Membership Details */}
      {membershipData && (
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Membership Details</h4>
          <div className="bg-green-50 p-3 rounded text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Membership Status:</span>
              <Badge variant={membershipData.status === 'member_paid' ? 'default' : 'secondary'}>
                {membershipData.status === 'member_paid' ? 'Premium Member' : 'Not a Member'}
              </Badge>
            </div>
            {membershipData.selectedPlan && (
              <div><span className="font-medium">Plan:</span> {safeRender(membershipData.selectedPlan)}</div>
            )}
            <div className="flex items-center justify-between">
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
          <div className="bg-blue-50 p-3 rounded text-sm space-y-2">
            {pricingData.engagementModel && (
              <div><span className="font-medium">Engagement Model:</span> {safeRender(pricingData.engagementModel)}</div>
            )}
            {pricingData.selectedFrequency && (
              <div><span className="font-medium">Billing Frequency:</span> {safeRender(pricingData.selectedFrequency)}</div>
            )}
            <div className="flex items-center justify-between">
              <span className="font-medium">Payment Status:</span>
              <Badge variant={pricingData.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                {pricingData.paymentStatus}
              </Badge>
            </div>
            {pricingData.paymentStatus === 'paid' && pricingData.paymentAmount > 0 && (
              <div><span className="font-medium">Amount Paid:</span> {
                isPaaSModel(pricingData.engagementModel || '') 
                  ? `${pricingData.paymentCurrency} ${pricingData.paymentAmount}`
                  : `${pricingData.paymentAmount}%`
              }</div>
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