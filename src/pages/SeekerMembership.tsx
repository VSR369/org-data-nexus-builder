
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SeekerMembershipProps {
  userId?: string;
  organizationName?: string;
}

const SeekerMembership = () => {
  const location = useLocation();
  
  const { userId, organizationName } = location.state as SeekerMembershipProps || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-0">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Link to="/seeker-dashboard" state={{ userId, organizationName }}>
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl font-bold">
                    Seeker Membership Portal
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Ready for fresh implementation
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 mb-4">
                Membership functionality has been cleared and ready for new implementation.
              </p>
              <p className="text-sm text-gray-500">
                User: {userId} | Organization: {organizationName}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeekerMembership;
