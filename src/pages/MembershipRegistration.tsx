
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Building, Globe, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface MembershipRegistrationProps {
  userId?: string;
  organizationName?: string;
  entityType?: string;
  country?: string;
}

const MembershipRegistration = () => {
  const location = useLocation();
  
  const { userId, organizationName, entityType, country } = location.state as MembershipRegistrationProps || {};

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
            {/* Organization Details Header */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Organization Details</h2>
              <p className="text-sm text-gray-600">Review your organization information below</p>
            </div>

            {/* Organization Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Name */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    Organization Name
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold text-gray-900">
                    {organizationName || 'Not Available'}
                  </p>
                </CardContent>
              </Card>

              {/* Entity Type */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-green-600" />
                    Entity Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold text-gray-900">
                    {entityType || 'Not Available'}
                  </p>
                </CardContent>
              </Card>

              {/* Country */}
              <Card className="border border-gray-200 md:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    Country
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold text-gray-900">
                    {country || 'Not Available'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* User Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">User ID:</span>
                  <span className="font-medium text-gray-900">{userId || 'Not Available'}</span>
                </div>
              </div>
            </div>

            {/* Membership Action Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Complete your membership registration to unlock premium features and enhanced access to our platform.
                </p>
                <Button className="w-full" size="lg">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed with Membership Registration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MembershipRegistration;
