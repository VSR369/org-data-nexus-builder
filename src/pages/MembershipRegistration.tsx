
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, AlertTriangle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useMembershipData } from '@/hooks/useMembershipData';
import { OrganizationDetailsSection } from '@/components/membership/OrganizationDetailsSection';
import { MembershipPricingSection } from '@/components/membership/MembershipPricingSection';
import { DebugSection } from '@/components/membership/DebugSection';
import { UserInfoSection } from '@/components/membership/UserInfoSection';
import { MembershipActionSection } from '@/components/membership/MembershipActionSection';

interface MembershipRegistrationProps {
  userId?: string;
  organizationName?: string;
  entityType?: string;
  country?: string;
}

const MembershipRegistration = () => {
  const location = useLocation();
  const { userId, organizationName, entityType, country } = location.state as MembershipRegistrationProps || {};
  
  const { membershipData, countryPricing, loading, error, debugInfo } = useMembershipData(entityType, country);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p>Loading membership information...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Link to="/seeker-dashboard" state={{ userId }}>
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl font-bold">
                    Membership Registration
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Join as a member to access premium features
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Debug Information (only show when there's an error or no data) */}
            {(error || !membershipData) && <DebugSection debugInfo={debugInfo} />}

            <OrganizationDetailsSection 
              organizationName={organizationName}
              entityType={entityType}
              country={country}
            />

            {/* Error Display */}
            {error && (
              <Card className="border-l-4 border-l-red-500 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    <p className="font-medium">{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Membership Pricing Information */}
            {membershipData && countryPricing && (
              <MembershipPricingSection 
                membershipData={membershipData}
                countryPricing={countryPricing}
              />
            )}

            <UserInfoSection userId={userId} />

            <MembershipActionSection 
              disabled={!membershipData || !countryPricing || !!error}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MembershipRegistration;
