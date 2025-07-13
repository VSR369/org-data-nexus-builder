import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Building, Users, ArrowRight, LogOut, User, Settings, Eye, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import MembershipPricingSystem from "@/components/membership/MembershipPricingSystem";
import DataCleanupButton from "@/components/admin/DataCleanupButton";

const OrganizationDashboard = () => {
  const { user, profile, signOut, loading } = useSupabaseAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-lg">Loading your organization dashboard...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Organization Not Found</CardTitle>
            <CardDescription>
              No organization profile found for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">CoInnovator Platform</h1>
              <span className="text-sm text-gray-500">| Organization Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link to="/">
                <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 hover:bg-gray-100">
                  <Home className="h-4 w-4 mr-1" />
                  Home
                </Button>
              </Link>
              <div className="flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                <User className="h-4 w-4 text-green-600" />
                <div className="text-sm">
                  <div className="font-medium text-green-800">
                    {profile.contact_person_name}
                  </div>
                  <div className="text-green-600 text-xs">
                    {profile.organization_name}
                  </div>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="text-green-700 border-green-300 hover:bg-green-100"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile.contact_person_name}!
          </h1>
          <p className="text-lg text-gray-600">
            Organization Dashboard for {profile.organization_name}
          </p>
        </div>

        {/* Organization Information Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Organization Details Card */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                Organization Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Organization Name</label>
                <p className="text-base font-medium">{profile.organization_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Organization ID</label>
                <p className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">{profile.custom_user_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Organization Type</label>
                <p className="text-base">{profile.organization_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Entity Type</label>
                <p className="text-base">{profile.entity_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Country</label>
                <p className="text-base">{profile.country}</p>
              </div>
              {profile.industry_segment && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Industry Segment</label>
                  <p className="text-base">{profile.industry_segment}</p>
                </div>
              )}
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Organization Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Contact Person</label>
                <p className="text-base font-medium">{profile.contact_person_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-base">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">User ID</label>
                <p className="text-base font-mono text-sm">{profile.custom_user_id}</p>
              </div>
              {profile.phone_number && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-base">{profile.phone_number}</p>
                </div>
              )}
              {profile.website && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Website</label>
                  <p className="text-base">
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline">
                      {profile.website}
                    </a>
                  </p>
                </div>
              )}
              {profile.address && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-base">{profile.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Status Card */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Account Status</label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-base text-green-700 font-medium">Active</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Registration Date</label>
                <p className="text-base">Recently registered</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-base">Recently updated</p>
              </div>
              <div className="pt-4 space-y-2">
                <Button variant="outline" className="w-full" size="sm">
                  Download Organization Data
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Account Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Membership & Engagement System */}
        <div className="mb-8">
          <MembershipPricingSystem
            organizationType={profile.organization_type}
            entityType={profile.entity_type}
            country={profile.country}
            organizationId={profile.custom_user_id}
            organizationName={profile.organization_name}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Post a Challenge</CardTitle>
              <CardDescription>
                Create new innovation challenges for contributors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Create Challenge
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">View Solutions</CardTitle>
              <CardDescription>
                Review submitted solutions and proposals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                Browse Solutions
              </Button>
            </CardContent>
          </Card>

          <Link to="/master-data-portal">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-600" />
                  Master Data Portal
                </CardTitle>
                <CardDescription>
                  Access platform configuration and data management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Access Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-red-600">Testing Tools</CardTitle>
              <CardDescription>
                Clear all data for fresh testing (enables email reuse)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataCleanupButton />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default OrganizationDashboard;