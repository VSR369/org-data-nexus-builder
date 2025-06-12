
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, User, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface SeekerDashboardProps {
  userId?: string;
  organizationName?: string;
}

const SeekerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get user data from navigation state or props
  const { userId, organizationName } = location.state as SeekerDashboardProps || {};

  const handleLogout = () => {
    console.log('🚪 Logging out user:', userId);
    navigate('/signin');
  };

  // Debug logging
  useEffect(() => {
    console.log('🔍 SeekerDashboard props:', { userId, organizationName });
  }, [userId, organizationName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Seeker Dashboard</h1>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* User Details Card */}
        <Card className="shadow-xl border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Building className="h-6 w-6 text-blue-600" />
              Seeker Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Organization Name</p>
                  <p className="font-semibold">{organizationName || 'Not Available'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="font-semibold">{userId || 'Not Available'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/challenges">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2">
                  <Building className="h-5 w-5" />
                  <span>Browse Challenges</span>
                </Button>
              </Link>
              
              <Link to="/solutions">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2">
                  <Building className="h-5 w-5" />
                  <span>View Solutions</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeekerDashboard;
