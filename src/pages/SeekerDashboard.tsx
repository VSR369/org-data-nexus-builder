
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, User, CreditCard, LogOut, Edit, UserPlus } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface SeekerDashboardProps {
  userId?: string;
  organizationName?: string;
  isMember?: boolean;
}

const SeekerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get user data from navigation state or props
  const { userId, organizationName, isMember } = location.state as SeekerDashboardProps || {};

  const handleJoinAsMember = () => {
    navigate('/seeker-membership', {
      state: {
        userId,
        organizationName
      }
    });
  };

  const handleEditMembership = () => {
    navigate('/seeker-membership', {
      state: {
        userId,
        organizationName,
        isEditing: true
      }
    });
  };

  const handleLogout = () => {
    navigate('/signin');
  };

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

            {/* Enhanced Membership Status Section */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Membership Status</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge 
                      variant={isMember ? "default" : "secondary"} 
                      className={isMember ? "bg-green-100 text-green-800 border-green-200" : "bg-orange-100 text-orange-800 border-orange-200"}
                    >
                      {isMember ? "✓ Active Member" : "⚠ Not a Member"}
                    </Badge>
                  </div>
                </div>
                
                {/* Action Button based on membership status */}
                {isMember ? (
                  <Button 
                    onClick={handleEditMembership}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Membership
                  </Button>
                ) : (
                  <Button 
                    onClick={handleJoinAsMember}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg animate-pulse"
                  >
                    <UserPlus className="h-4 w-4" />
                    Join as Member
                  </Button>
                )}
              </div>
            </div>

            {/* Membership Status Details */}
            {isMember ? (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-green-800 font-medium">
                    🎉 Welcome! You are an active member
                  </p>
                </div>
                <p className="text-green-700 text-sm">
                  You have full access to all premium features, priority support, and exclusive member benefits.
                </p>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <p className="text-orange-800 font-medium">
                    🚀 Unlock Premium Benefits
                  </p>
                </div>
                <p className="text-orange-700 text-sm mb-3">
                  Join as a member to access exclusive features, priority support, and premium content.
                </p>
                <ul className="text-orange-700 text-xs space-y-1">
                  <li>• Priority access to new challenges</li>
                  <li>• Exclusive member-only events</li>
                  <li>• Advanced analytics and insights</li>
                  <li>• Direct communication with solution providers</li>
                </ul>
              </div>
            )}
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
