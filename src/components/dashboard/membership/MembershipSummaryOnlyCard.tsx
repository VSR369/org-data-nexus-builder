
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, DollarSign, ArrowRight, AlertCircle } from 'lucide-react';

interface MembershipSummaryOnlyCardProps {
  membershipStatus: 'active' | 'inactive';
  membershipFees: any[];
  onProceedToTierSelection: () => void;
  currency?: string;
}

export const MembershipSummaryOnlyCard: React.FC<MembershipSummaryOnlyCardProps> = ({
  membershipStatus,
  membershipFees,
  onProceedToTierSelection,
  currency = 'USD'
}) => {
  const membershipFee = membershipFees[0]?.annual_amount || 990;
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);

  return (
    <Card className={`w-full ${membershipStatus === 'active' ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {membershipStatus === 'active' ? (
            <>
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span className="text-green-800">Membership Activated Successfully!</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-6 w-6 text-orange-600" />
              <span className="text-orange-800">Limited Access Mode</span>
            </>
          )}
        </CardTitle>
        <CardDescription>
          {membershipStatus === 'active' 
            ? 'Your annual membership has been activated with full platform access'
            : 'You are continuing with limited access - upgrade anytime to unlock full features'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Payment Details */}
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <DollarSign className={`h-6 w-6 mx-auto mb-2 ${membershipStatus === 'active' ? 'text-green-600' : 'text-gray-400'}`} />
            <div className="font-medium text-gray-900">
              {membershipStatus === 'active' ? `${currency} ${membershipFee}` : 'No Payment'}
            </div>
            <div className="text-sm text-gray-500">
              {membershipStatus === 'active' ? 'Annual Membership Fee' : 'Limited Access'}
            </div>
          </div>

          {/* Start Date */}
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <Calendar className={`h-6 w-6 mx-auto mb-2 ${membershipStatus === 'active' ? 'text-blue-600' : 'text-gray-400'}`} />
            <div className="font-medium text-gray-900">
              {startDate.toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-500">
              {membershipStatus === 'active' ? 'Membership Start' : 'Access Start'}
            </div>
          </div>

          {/* End Date / Status */}
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <Calendar className={`h-6 w-6 mx-auto mb-2 ${membershipStatus === 'active' ? 'text-purple-600' : 'text-gray-400'}`} />
            <div className="font-medium text-gray-900">
              {membershipStatus === 'active' ? endDate.toLocaleDateString() : 'Ongoing'}
            </div>
            <div className="text-sm text-gray-500">
              {membershipStatus === 'active' ? 'Membership Expires' : 'Limited Access'}
            </div>
          </div>
        </div>

        {membershipStatus === 'active' && (
          <div className="mb-6 p-3 bg-green-100 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Receipt #RCP-{Date.now().toString().slice(-8)} | Payment Method: Credit Card
              </span>
            </div>
          </div>
        )}

        {membershipStatus === 'inactive' && (
          <div className="mb-6 p-3 bg-orange-100 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Limited to 2 challenges per month. Upgrade to unlock full features.
              </span>
            </div>
          </div>
        )}

        <div className="text-center">
          <Button 
            onClick={onProceedToTierSelection}
            className="w-full md:w-auto"
          >
            Proceed to Pricing Tier Selection
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
