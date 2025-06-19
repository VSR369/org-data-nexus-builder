
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from 'lucide-react';

interface MembershipStatusDisplayProps {
  status: 'active' | 'inactive';
}

const MembershipStatusDisplay: React.FC<MembershipStatusDisplayProps> = ({ status }) => {
  if (status !== 'active') return null;

  // Get membership details from localStorage
  const getMembershipDetails = () => {
    const membershipData = localStorage.getItem('completed_membership_payment');
    if (membershipData) {
      try {
        return JSON.parse(membershipData);
      } catch (error) {
        console.error('Error parsing membership data:', error);
        return null;
      }
    }
    return null;
  };

  const membershipDetails = getMembershipDetails();

  const formatCurrency = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(amount);
    } catch (error) {
      return `${currency} ${amount.toLocaleString()}`;
    }
  };

  const getPeriodDisplay = (selectedPlan: string) => {
    switch (selectedPlan) {
      case 'quarterly':
        return '3 Months';
      case 'halfyearly':
        return '6 Months';
      case 'annual':
        return '12 Months';
      default:
        return selectedPlan;
    }
  };

  return (
    <Card className="shadow-lg border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
          Membership Active
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-green-800">
            Your membership is active. Enjoy discounted pricing on all engagement models!
          </p>
          
          {membershipDetails && (
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <div className="text-sm space-y-1">
                <p className="text-green-700">
                  <span className="font-medium">Period:</span> {getPeriodDisplay(membershipDetails.selectedPlan)}
                </p>
                {membershipDetails.pricing && (
                  <p className="text-green-700">
                    <span className="font-medium">Amount Paid:</span> {formatCurrency(membershipDetails.pricing.selectedAmount || membershipDetails.pricing.amount, membershipDetails.pricing.selectedCurrency || membershipDetails.pricing.currency)}
                  </p>
                )}
                {membershipDetails.activatedAt && (
                  <p className="text-green-600 text-xs">
                    Activated: {new Date(membershipDetails.activatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipStatusDisplay;
