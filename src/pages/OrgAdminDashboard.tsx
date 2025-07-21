
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Shield, User, Building, Users, Settings, Plus, Eye } from 'lucide-react';
import { useOrgAdminAuth } from '@/hooks/useOrgAdminAuth';
import OrganizationDetailsCard from '@/components/org-admin/OrganizationDetailsCard';
import MembershipStatusCard from '@/components/org-admin/MembershipStatusCard';
import { toast } from 'sonner';

export default function OrgAdminDashboard() {
  const navigate = useNavigate();
  const { orgAdmin, organizationData, isAuthenticated, loading, logoutOrgAdmin } = useOrgAdminAuth();

  useEffect(() => {
    console.log('🔍 Dashboard useEffect - Auth state:', { isAuthenticated, loading, orgAdmin: !!orgAdmin, organizationData: !!organizationData });
    
    if (!loading && !isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login...');
      navigate('/org-admin-login');
    } else if (isAuthenticated && orgAdmin && organizationData) {
      console.log('✅ Authenticated and data loaded successfully');
      toast.success(`Welcome back, ${orgAdmin.admin_name}!`);
    }
  }, [isAuthenticated, loading, navigate, orgAdmin, organizationData]);

  const handleSignOut = async () => {
    console.log('🚪 Signing out org admin...');
    await logoutOrgAdmin();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !orgAdmin || !organizationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-orange-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Required</h2>
          <p className="text-muted-foreground mb-4">Please sign in to access the dashboard</p>
          <Button onClick={() => navigate('/org-admin-login')} className="bg-orange-600 hover:bg-orange-700">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-amber-600 rounded-lg flex items-center justify-center">
                <Shield className="text-white font-bold text-sm h-4 w-4" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Organization Administrator</h1>
                <p className="text-sm text-gray-600">{organizationData.organization_name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
                <User className="h-4 w-4 text-orange-600" />
                <div className="text-sm">
                  <div className="font-medium text-orange-800">
                    {orgAdmin.admin_name}
                  </div>
                  <div className="text-orange-600 text-xs">
                    Administrator
                  </div>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="text-orange-700 border-orange-300 hover:bg-orange-100"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {orgAdmin.admin_name}
          </h2>
          <p className="text-gray-600">
            Manage your organization, view details, and configure roles from your administrator dashboard.
          </p>
        </div>

        {/* Admin Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Administrator Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Name</div>
                <div className="font-medium">{orgAdmin.admin_name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Email</div>
                <div className="text-sm">{orgAdmin.admin_email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Organization ID</div>
                <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {orgAdmin.organization_id}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Created</div>
                <div className="text-sm">
                  {new Date(orgAdmin.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Membership Status */}
          <div className="lg:col-span-2">
            <MembershipStatusCard
              membershipStatus={organizationData.membership_status}
              pricingTier={organizationData.pricing_tier}
              engagementModel={organizationData.engagement_model}
              paymentStatus={organizationData.payment_status}
            />
          </div>
        </div>

        {/* Organization Details */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <OrganizationDetailsCard data={organizationData} />
        </div>

        {/* Role Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Role Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Manage roles and permissions for your organization members. Create new roles, assign permissions, and control access levels.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    className="bg-orange-600 hover:bg-orange-700 flex-1"
                    onClick={() => toast.info('Role creation feature coming soon!')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Role
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => toast.info('Role management interface coming soon!')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View All Roles
                  </Button>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Current Default Roles</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>• Organization Admin</span>
                      <span className="text-green-600">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Member</span>
                      <span className="text-gray-500">Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Viewer</span>
                      <span className="text-gray-500">Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Organization Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">1</div>
                    <div className="text-sm text-blue-700">Active Admins</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{organizationData.membership_status === 'Active' ? '1' : '0'}</div>
                    <div className="text-sm text-green-700">Active Memberships</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Organization Type:</span>
                    <span className="font-medium">{organizationData.organization_type_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Entity Type:</span>
                    <span className="font-medium">{organizationData.entity_type_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Industry:</span>
                    <span className="font-medium">{organizationData.industry_segment_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{organizationData.country_name}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => toast.info('Profile update feature coming soon!')}
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm">Update Profile</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => toast.info('Organization settings coming soon!')}
                >
                  <Building className="h-5 w-5" />
                  <span className="text-sm">Org Settings</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => toast.info('User management coming soon!')}
                >
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Manage Users</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => toast.info('Security settings coming soon!')}
                >
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">Security</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
