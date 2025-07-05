import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  MapPin, 
  Mail, 
  User, 
  Calendar,
  LogOut,
  Home,
  Settings,
  FileText,
  Activity
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface OrganizationSession {
  userId: string;
  organizationName: string;
  entityType: string;
  country: string;
  contactPersonName: string;
  email: string;
  organizationType?: string;
  industrySegment?: string;
  organizationId?: string;
  loginTimestamp: string;
}

const OrganizationDashboard = () => {
  const [sessionData, setSessionData] = useState<OrganizationSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load session data
    const loadSessionData = () => {
      try {
        const session = sessionStorage.getItem('seeker_session');
        if (session) {
          const parsedSession = JSON.parse(session);
          setSessionData(parsedSession);
          console.log('✅ Organization session loaded:', parsedSession);
        } else {
          console.log('❌ No organization session found');
          // Redirect to login if no session
          navigate('/seeker-login');
        }
      } catch (error) {
        console.error('Error loading session:', error);
        navigate('/seeker-login');
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('seeker_session');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading organization details...</p>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Session Expired</h2>
            <p className="text-gray-600 mb-4">Please login again to access your organization dashboard.</p>
            <Link to="/seeker-login">
              <Button className="w-full">Login Again</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Organization Dashboard</h1>
                <p className="text-sm text-gray-500">Solution Seeking Organization Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {sessionData.contactPersonName}!
          </h2>
          <p className="text-gray-600">
            Manage your organization's profile and access platform services
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Organization Details Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Organization Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Organization Name</label>
                    <p className="text-lg font-semibold text-gray-900">{sessionData.organizationName}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">User ID</label>
                    <p className="text-lg font-semibold text-gray-900">{sessionData.userId}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Entity Type</label>
                    <Badge variant="secondary" className="mt-1">
                      {sessionData.entityType}
                    </Badge>
                  </div>
                  
                  {sessionData.organizationType && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Organization Type</label>
                      <Badge variant="outline" className="mt-1">
                        {sessionData.organizationType}
                      </Badge>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Country</label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{sessionData.country}</span>
                    </div>
                  </div>
                  
                  {sessionData.industrySegment && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Industry Segment</label>
                      <Badge variant="outline" className="mt-1">
                        {sessionData.industrySegment}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact Information</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{sessionData.contactPersonName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{sessionData.email}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Session Information</label>
                  <div className="mt-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Logged in: {new Date(sessionData.loginTimestamp).toLocaleString()}
                    </span>
                  </div>
                  {sessionData.organizationId && (
                    <div className="mt-1">
                      <span className="text-sm text-gray-500">Organization ID: </span>
                      <span className="text-sm font-mono text-gray-900">{sessionData.organizationId}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Card */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Documents
                </Button>
                
                <Link to="/master-data" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Building2 className="h-4 w-4 mr-2" />
                    Master Data Portal
                  </Button>
                </Link>
                
                <Separator />
                
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Need assistance?</p>
                  <Button size="sm" variant="secondary" className="w-full">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrganizationDashboard;