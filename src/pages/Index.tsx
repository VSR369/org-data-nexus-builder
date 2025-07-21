import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Building, Users, ArrowRight, LogOut, User, Settings, Eye, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import DataCleanupButton from "@/components/admin/DataCleanupButton";

const Index = () => {
  console.log('Index page is rendering...');
  const { isAuthenticated, user, profile, signOut, loading } = useSupabaseAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };

  // If user is authenticated, redirect them to their dashboard
  if (isAuthenticated && profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 overflow-x-hidden">
        <header className="bg-white border-b shadow-sm w-full">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">CoInnovator Platform</h1>
              </div>
              
              <div className="flex items-center space-x-3">
                <Link to="/organization-dashboard">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
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

        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {profile.contact_person_name}!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              You are signed in to {profile.organization_name}. Access your organization dashboard to manage your account and view all features.
            </p>
            <Link to="/organization-dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Building className="mr-2 h-5 w-5" />
                Go to Organization Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Show regular landing page for non-authenticated users
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
            </div>
            
            {/* Authentication Status Display */}
            {!loading && (
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                    <User className="h-4 w-4 text-green-600" />
                    <div className="text-sm">
                      <div className="font-medium text-green-800">
                        Signed in as: {profile?.contact_person_name || user?.email}
                      </div>
                      {profile?.organization_name && (
                        <div className="text-green-600 text-xs">
                          {profile.organization_name}
                        </div>
                      )}
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
                ) : (
                  <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border">
                    Not signed in
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to CoInnovator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access master data management, organization registration, and contributor portal
          </p>
        </div>

        {/* Access Cards - Updated Grid Layout for 5 cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">

          {/* Master Data Portal */}
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 shrink-0">
                <Database className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Master Data Portal</CardTitle>
              <CardDescription>
                Complete master data management system with configuration for all platform data
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center flex-1 flex flex-col">
              <div className="space-y-2 text-sm text-gray-600 mb-6 flex-1">
                <p>• Countries, Currencies, Industries</p>
                <p>• Organization Types, Entity Types</p>
                <p>• Pricing, Engagement Models</p>
                <p>• Communication Types, Rewards</p>
                <p>• Events, Diagnostics & More</p>
              </div>
              <Link to="/master-data-portal" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Access Master Data
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Seeking Organization Access */}
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4 shrink-0">
                <Building className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Seeking Organization</CardTitle>
              <CardDescription>
                Sign up or sign in as an organization seeking solutions and innovations
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center flex-1 flex flex-col">
              <div className="space-y-2 text-sm text-gray-600 mb-6 flex-1">
                <p>• Organization Registration</p>
                <p>• Profile Management</p>
                <p>• Challenge Posting</p>
                <p>• Solution Evaluation</p>
                <p>• Supabase Authentication</p>
              </div>
              
              {/* Authentication Status Specific Content */}
              {loading ? (
                <div className="text-sm text-gray-500">Loading...</div>
              ) : isAuthenticated ? (
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">
                      ✓ You are already signed in!
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Access your organization dashboard or sign out to use a different account.
                    </p>
                  </div>
                  <Link to="/organization-dashboard" className="w-full block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Building className="mr-2 h-4 w-4" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleSignOut}
                    variant="outline" 
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link to="/organization-registration" className="w-full block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Register Organization
                    </Button>
                  </Link>
                  <Link to="/organization-signin" className="w-full block">
                    <Button variant="outline" className="w-full">
                      Sign In Organization
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* NEW: Organization Administrator Access */}
          <Card className="hover:shadow-lg transition-shadow h-full border-orange-200">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4 shrink-0">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Organization Administrator</CardTitle>
              <CardDescription>
                Login as an organization administrator created during the validation process
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center flex-1 flex flex-col">
              <div className="space-y-2 text-sm text-gray-600 mb-6 flex-1">
                <p>• Organization Management</p>
                <p>• Validation Oversight</p>
                <p>• Member Administration</p>
                <p>• Organizational Settings</p>
                <p>• Admin-Level Access</p>
              </div>
              
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 mb-4">
                <p className="text-xs text-orange-700 font-medium">
                  ⚠️ Administrator Access Only
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  This login is for administrators created during organization validation. 
                  Contact your organization if you need access.
                </p>
              </div>
              
              <Link to="/org-admin-login" className="w-full">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Administrator Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Contributor Access */}
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4 shrink-0">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Contributor Portal</CardTitle>
              <CardDescription>
                Access for contributors, solution providers, and innovation partners
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center flex-1 flex flex-col">
              <div className="space-y-2 text-sm text-gray-600 mb-6 flex-1">
                <p>• Contributor Registration</p>
                <p>• Solution Submission</p>
                <p>• Challenge Responses</p>
                <p>• Collaboration Tools</p>
                <p>• Specialized Access</p>
              </div>
              <div className="space-y-2">
                <Link to="/contributor-auth?mode=signup" className="w-full block">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Join as Contributor
                  </Button>
                </Link>
                <Link to="/contributor-auth" className="w-full block">
                  <Button variant="outline" className="w-full">
                    Contributor Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Data Cleanup Testing Tool */}
          <Card className="hover:shadow-lg transition-shadow h-full border-red-200">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4 shrink-0">
                <Database className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-red-700">Testing Tools</CardTitle>
              <CardDescription>
                Clear all solution-seeking organization data for fresh testing
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center flex-1 flex flex-col">
              <div className="space-y-2 text-sm text-gray-600 mb-6 flex-1">
                <p>• Clear Database Records</p>
                <p>• Reset Auth Users</p>
                <p>• Enable Email Reuse</p>
                <p>• Preserve Master Data</p>
                <p>• Complete Fresh Start</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-4">
                <p className="text-xs text-yellow-700 font-medium">
                  ⚠️ Testing Mode Only
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  This will permanently delete all organization data but preserve platform configurations.
                </p>
              </div>
              <DataCleanupButton />
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            Need help? Contact our support team for assistance with platform access.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
