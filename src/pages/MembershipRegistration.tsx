
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard } from 'lucide-react';
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
      <div className="max-w-2xl mx-auto">
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
                    Ready for implementation
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 mb-4">
                Membership registration functionality ready for implementation.
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Organization: {organizationName}</p>
                <p>Entity Type: {entityType}</p>
                <p>Country: {country}</p>
                <p>User ID: {userId}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MembershipRegistration;
