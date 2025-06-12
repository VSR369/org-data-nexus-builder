
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, User, LogOut, Globe, AlertTriangle, CreditCard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface SeekerDashboardProps {
  userId?: string;
  organizationName?: string;
}

const SeekerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Screen variables with default values
  const [organizationName, setOrganizationName] = useState("");
  const [entityType, setEntityType] = useState("");
  const [country, setCountry] = useState("");
  
  // Get user data from navigation state or props
  const { userId } = location.state as SeekerDashboardProps || {};

  const handleLogout = () => {
    console.log('🚪 Logging out user:', userId);
    navigate('/signin');
  };

  const handleJoinAsMember = () => {
    navigate('/seeker-membership', { 
      state: { 
        userId,
        organizationName,
        entityType,
        country
      }
    });
  };

  // Load seeker details from localStorage on screen load
  useEffect(() => {
    const loadSeekerDetails = () => {
      const storedOrgName = localStorage.getItem('seekerOrganizationName') || '';
      const storedEntityType = localStorage.getItem('seekerEntityType') || '';
      const storedCountry = localStorage.getItem('seekerCountry') || '';
      
      setOrganizationName(storedOrgName);
      setEntityType(storedEntityType);
      setCountry(storedCountry);
      
      console.log('📋 Loaded seeker details from localStorage:', {
        organizationName: storedOrgName,
        entityType: storedEntityType,
        country: storedCountry
      });
    };

    loadSeekerDetails();
  }, []);

  // Check if user needs to log in again
  const showLoginWarning = !organizationName;

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

        {/* Warning if no organization name */}
        {showLoginWarning && (
          <Card className="shadow-xl border-0 mb-6 border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium">Please log in again.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Seeker Details Card */}
        <Card className="shadow-xl border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Building className="h-6 w-6 text-blue-600" />
              Seeker Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Organization Name */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Building className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium">Organization Name</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {organizationName || 'Not Available'}
                  </p>
                </div>
              </div>

              {/* Entity Type */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium">Entity Type</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {entityType || 'Not Available'}
                  </p>
                </div>
              </div>

              {/* Country */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Globe className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium">Country</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {country || 'Not Available'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membership Action */}
        <Card className="shadow-xl border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-green-600" />
              Membership
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleJoinAsMember}
              className="w-full h-16 flex items-center justify-center gap-3 text-lg"
              disabled={showLoginWarning}
            >
              <CreditCard className="h-6 w-6" />
              Join as Member
            </Button>
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
