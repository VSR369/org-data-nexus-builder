
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useMembershipData } from "./hooks/useMembershipData";

const MembershipDetailsCard: React.FC = () => {
  const { membershipData, loading } = useMembershipData();

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getMembershipStatusDetails = () => {
    if (!membershipData) return { icon: Clock, color: 'text-gray-500', badge: 'secondary', message: 'Loading...' };
    
    switch (membershipData.status) {
      case 'active':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          badge: 'default',
          message: 'Active Member'
        };
      case 'inactive':
        return {
          icon: XCircle,
          color: 'text-red-600',
          badge: 'destructive',
          message: 'Inactive Member'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-500',
          badge: 'secondary',
          message: 'Not a Member'
        };
    }
  };

  const statusDetails = getMembershipStatusDetails();
  const StatusIcon = statusDetails.icon;

  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-blue-600" />
          Selected Membership & Pricing Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Loading membership selection details...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <StatusIcon className={`h-6 w-6 ${statusDetails.color}`} />
                <div>
                  <p className="font-medium text-gray-900">{statusDetails.message}</p>
                  {membershipData?.selectedPlan && (
                    <p className="text-sm text-gray-600">
                      Selected Plan: {membershipData.selectedPlan}
                    </p>
                  )}
                  {membershipData?.selectedEngagementModel && (
                    <p className="text-sm text-gray-600">
                      Engagement Model: {membershipData.selectedEngagementModel}
                    </p>
                  )}
                  {membershipData?.activationDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Activated: {formatDate(membershipData.activationDate)}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant={statusDetails.badge as any}>
                {membershipData?.status === 'active' ? 'Active' : 
                 membershipData?.status === 'inactive' ? 'Inactive' : 'Not Selected'}
              </Badge>
            </div>

            {membershipData?.status === 'active' && membershipData.pricingDetails && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-3">Selected Pricing Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-600">Currency:</label>
                    <p className="font-medium">{membershipData.pricingDetails.currency}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Amount:</label>
                    <p className="font-medium">{membershipData.pricingDetails.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Payment Frequency:</label>
                    <p className="font-medium capitalize">{membershipData.pricingDetails.paymentFrequency}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Payment Status:</label>
                    <p className="font-medium capitalize">{membershipData.paymentStatus || 'Pending'}</p>
                  </div>
                </div>
              </div>
            )}

            {membershipData?.selectedEngagementModel && membershipData?.status !== 'not-member' && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Selected Engagement Model</h4>
                <p className="text-sm text-blue-800">{membershipData.selectedEngagementModel}</p>
              </div>
            )}

            {membershipData?.status === 'not-member' && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-900 mb-2">No Membership Selected</h4>
                <p className="text-sm text-yellow-800">
                  This organization has not yet selected a membership plan or pricing model after registration.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MembershipDetailsCard;
