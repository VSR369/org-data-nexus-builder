
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import { useMembershipData } from "./hooks/useMembershipData";

interface MembershipDetailsCardProps {
  onJoinAsMember?: () => void;
  onSelectMembershipPlan?: () => void;
}

const MembershipDetailsCard: React.FC<MembershipDetailsCardProps> = ({
  onJoinAsMember,
  onSelectMembershipPlan
}) => {
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
    if (membershipData?.status === 'active') {
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        badge: 'default',
        message: 'Active Member'
      };
    }
    
    return {
      icon: Clock,
      color: 'text-gray-500',
      badge: 'secondary',
      message: 'No Active Membership'
    };
  };

  const statusDetails = getMembershipStatusDetails();
  const StatusIcon = statusDetails.icon;

  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-blue-600" />
          Membership Status & Pricing Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Loading membership details...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <StatusIcon className={`h-6 w-6 ${statusDetails.color}`} />
                <div>
                  <p className="font-medium text-gray-900">{statusDetails.message}</p>
                  {membershipData?.status === 'active' && membershipData?.selectedPlan && (
                    <p className="text-sm text-gray-600">
                      Selected Plan: {membershipData.selectedPlan}
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
                {membershipData?.status === 'active' ? 'Active' : 'Not Active'}
              </Badge>
            </div>

            {/* Show membership pricing information */}
            {membershipData?.pricingDetails && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3">
                  {membershipData.status === 'active' ? 'Active Membership Pricing' : 'Available Membership Pricing'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <label className="text-gray-600">Currency:</label>
                    <p className="font-medium">{membershipData.pricingDetails.currency}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">
                      {membershipData.status === 'active' ? 'Amount Paid:' : 'Price:'}
                    </label>
                    <p className="font-medium">{membershipData.pricingDetails.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Plan:</label>
                    <p className="font-medium capitalize">{membershipData.pricingDetails.paymentFrequency}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Show action button if no active membership */}
            {membershipData?.status !== 'active' && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Join as Member</h4>
                    <p className="text-sm text-blue-800">
                      Access premium features, priority support, and member benefits
                    </p>
                  </div>
                  <Button 
                    onClick={onJoinAsMember}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Join Now
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MembershipDetailsCard;
