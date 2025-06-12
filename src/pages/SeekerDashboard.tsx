
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, User, CreditCard, LogOut, Edit, UserPlus } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { checkExistingMembership } from '@/utils/membershipUtils';

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

  // Save membership data to localStorage when user navigates here as a member
  useEffect(() => {
    if (userId && organizationName && isMember === true) {
      const membershipData = {
        userId,
        organizationName,
        isMember: true,
        joinedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('seeker_membership_data', JSON.stringify(membershipData));
      console.log('💾 Saved membership data to localStorage:', membershipData);
    }
  }, [userId, organizationName, isMember]);

  // Get detailed membership information
  const getMembershipDetails = () => {
    console.log('🔍 Getting detailed membership information...');
    
    // First check the passed state
    if (isMember !== undefined) {
      console.log('🔍 Checking membership from navigation state:', isMember);
      if (isMember) {
        // Get detailed info from localStorage
        return checkExistingMembership(userId || '');
      }
      return { isMember: false };
    }
    
    // If no state passed, check localStorage for membership data
    return checkExistingMembership(userId || '');
  };

  const membershipDetails = getMembershipDetails();
  const isActiveMember = membershipDetails.isMember;

  // Format membership plan display
  const formatMembershipPlan = (plan: string) => {
    switch (plan) {
      case 'quarterly':
        return 'Quarterly';
      case 'halfYearly':
        return 'Half-Yearly';
      case 'annual':
        return 'Annual';
      default:
        return plan;
    }
  };

  // Get membership fee information (this would ideally come from the membership details)
  const getMembershipFeeDisplay = () => {
    if (!membershipDetails.membershipPlan) return null;
    
    // For demo purposes, showing the plan frequency
    // In a real app, you'd fetch the actual fee amounts from your master data
    const planDisplay = formatMembershipPlan(membershipDetails.membershipPlan);
    return planDisplay;
  };

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
    // Clear membership data on logout - but be more careful about what we clear
    console.log('🚪 Logging out user:', userId);
    navigate('/signin');
  };

  // Debug logging
  useEffect(() => {
    console.log('🔍 SeekerDashboard props:', { userId, organizationName, isMember });
    console.log('🔍 Current membership details:', membershipDetails);
    const storedData = localStorage.getItem('seeker_membership_data');
    console.log('🔍 Stored membership data:', storedData);
  }, [userId, organizationName, isMember, membershipDetails]);

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
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    <Badge 
                      variant={isActiveMember ? "default" : "secondary"} 
                      className={isActiveMember ? "bg-green-100 text-green-800 border-green-200" : "bg-orange-100 text-orange-800 border-orange-200"}
                    >
                      {isActiveMember ? "✓ Active Member" : "⚠ Not a Member"}
                    </Badge>
                    
                    {/* Show membership details for active members */}
                    {isActiveMember && membershipDetails.entityType && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {membershipDetails.entityType}
                        </Badge>
                        {getMembershipFeeDisplay() && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {getMembershipFeeDisplay()}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Button based on membership status */}
                {isActiveMember ? (
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
            {isActiveMember ? (
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
                {membershipDetails.joinedAt && (
                  <p className="text-green-600 text-xs mt-2">
                    Member since: {new Date(membershipDetails.joinedAt).toLocaleDateString()}
                  </p>
                )}
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
