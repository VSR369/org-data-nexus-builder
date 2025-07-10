
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Building, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  console.log('Index page is rendering...');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Simple Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">CoInnovator Platform</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to CoInnovator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access master data management, organization registration, and contributor portal
          </p>
        </div>

        {/* Access Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Master Data Portal */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Master Data Portal</CardTitle>
              <CardDescription>
                Complete master data management system with configuration for all platform data
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <p>• Countries, Currencies, Industries</p>
                <p>• Organization Types, Entity Types</p>
                <p>• Pricing, Engagement Models</p>
                <p>• Communication Types, Rewards</p>
                <p>• Events, Diagnostics & More</p>
              </div>
              <Link to="/master-data-portal">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Access Master Data
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Seeking Organization Access */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Seeking Organization</CardTitle>
              <CardDescription>
                Sign up or sign in as an organization seeking solutions and innovations
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <p>• Organization Registration</p>
                <p>• Profile Management</p>
                <p>• Challenge Posting</p>
                <p>• Solution Evaluation</p>
                <p>• Supabase Authentication</p>
              </div>
              <div className="space-y-2">
                <Link to="/auth?mode=signup" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Sign Up Organization
                  </Button>
                </Link>
                <Link to="/auth" className="block">
                  <Button variant="outline" className="w-full">
                    Sign In Organization
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Contributor Access */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Contributor Portal</CardTitle>
              <CardDescription>
                Access for contributors, solution providers, and innovation partners
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <p>• Contributor Registration</p>
                <p>• Solution Submission</p>
                <p>• Challenge Responses</p>
                <p>• Collaboration Tools</p>
                <p>• Specialized Access</p>
              </div>
              <div className="space-y-2">
                <Link to="/contributor-auth?mode=signup" className="block">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Join as Contributor
                  </Button>
                </Link>
                <Link to="/contributor-auth" className="block">
                  <Button variant="outline" className="w-full">
                    Contributor Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
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
