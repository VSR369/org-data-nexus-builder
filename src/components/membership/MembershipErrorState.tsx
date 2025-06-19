
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from 'lucide-react';

interface MembershipErrorStateProps {
  userData: {
    country: string;
    organizationType: string;
    entityType: string;
  };
  membershipFees: any[];
  feeDataInitialized: boolean;
  countryPricing: any;
}

const MembershipErrorState: React.FC<MembershipErrorStateProps> = ({
  userData,
  membershipFees,
  feeDataInitialized,
  countryPricing
}) => {
  const [showDebug, setShowDebug] = React.useState(false);

  return (
    <Card className="shadow-lg border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          Membership Configuration Missing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-red-800">
          No membership pricing configuration found for your organization details.
        </p>
        <div className="bg-red-100 p-3 rounded-lg">
          <p className="text-sm text-red-700 font-medium">Required Configuration:</p>
          <ul className="text-xs text-red-600 mt-1 space-y-1">
            <li>• Country: {userData.country}</li>
            <li>• Organization Type: {userData.organizationType}</li>
            <li>• Entity Type: {userData.entityType}</li>
          </ul>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowDebug(!showDebug)}
        >
          {showDebug ? 'Hide' : 'Show'} Debug Info
        </Button>
        {showDebug && (
          <div className="bg-gray-100 p-3 rounded-lg text-xs">
            <p><strong>Available Membership Fees:</strong> {membershipFees.length}</p>
            <p><strong>Fee Data Initialized:</strong> {feeDataInitialized ? 'Yes' : 'No'}</p>
            <p><strong>Country Pricing Available:</strong> {countryPricing ? 'Yes' : 'No'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MembershipErrorState;
