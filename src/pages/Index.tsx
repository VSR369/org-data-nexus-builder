
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Building, Users, ArrowRight, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const Index = () => {
  console.log('Index page is rendering...');
  const { isAuthenticated, user, profile, signOut, loading } = useSupabaseAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };

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

        {/* Access Cards - Fixed Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                      You can now access organization features or sign out to use a different account.
                    </p>
                  </div>
                  <Button 
                    onClick={handleSignOut}
                    variant="outline" 
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out to Use Different Account
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link to="/auth?mode=signup" className="w-full block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Sign Up Organization
                    </Button>
                  </Link>
                  <Link to="/auth" className="w-full block">
                    <Button variant="outline" className="w-full">
                      Sign In Organization
                    </Button>
                  </Link>
                </div>
              )}
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
