import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Building2, 
  MapPin, 
  Mail, 
  User, 
  LogOut,
  Home,
  FileText,
  Phone,
  Globe,
  AlertCircle,
  Upload
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useCompleteUserData } from '@/hooks/useCompleteUserData';
import '@/utils/cleanupMembershipEngagementStorage';

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

  // Load complete user data
  const { userData: completeUserData, loading: userDataLoading, error: userDataError } = useCompleteUserData(sessionData?.userId);

  useEffect(() => {
    const loadSessionData = () => {
      try {
        const session = sessionStorage.getItem('seeker_session');
        if (session) {
          const parsedSession = JSON.parse(session);
          setSessionData(parsedSession);
          console.log('✅ Organization session loaded:', parsedSession);
        } else {
          console.log('❌ No organization session found');
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

  if (isLoading || userDataLoading) {
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

        <div className="space-y-6">
          {/* Data Loading Status */}
          {userDataError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load complete organization data: {userDataError}
              </AlertDescription>
            </Alert>
          )}

          {/* Organization Overview Cards - Compact Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary Organization Info */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5" />
                  Organization Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {completeUserData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Organization</label>
                        <p className="text-sm font-semibold mt-1">{completeUserData.organizationName}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Organization Type</label>
                        <div className="mt-1">
                          <Badge variant="secondary" className="text-xs">{completeUserData.organizationType}</Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Entity Type</label>
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">{completeUserData.entityType}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">User ID</label>
                        <p className="text-sm font-mono mt-1">{completeUserData.userId}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Country</label>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{completeUserData.country}</span>
                        </div>
                      </div>
                      {completeUserData.industrySegment && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Industry</label>
                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs">{completeUserData.industrySegment}</Badge>
                            <p className="text-xs text-gray-500 mt-1">From registration data</p>
                          </div>
                        </div>
                      )}
                      {!completeUserData.industrySegment && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Industry</label>
                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs text-orange-600">Not specified</Badge>
                            <p className="text-xs text-gray-500 mt-1">Missing from registration</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading organization data...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  Contact Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {completeUserData ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contact Person</label>
                      <p className="text-sm font-medium mt-1">{completeUserData.contactPersonName}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm truncate">{completeUserData.email}</span>
                      </div>
                    </div>
                    {completeUserData.phoneNumber && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {completeUserData.countryCode ? `+${completeUserData.countryCode} ` : ''}
                            {completeUserData.phoneNumber}
                          </span>
                        </div>
                      </div>
                    )}
                    {completeUserData.website && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Website</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Globe className="h-3 w-3 text-muted-foreground" />
                          <a href={completeUserData.website} target="_blank" rel="noopener noreferrer" 
                             className="text-sm text-blue-600 hover:underline truncate">
                            {completeUserData.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading contact data...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Details - Compact */}
          {completeUserData && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Additional Information & Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Organization Details */}
                  <div className="space-y-4">
                    <h4 className="font-medium mb-3">Organization Information</h4>
                    <div className="space-y-2 text-sm">
                      {completeUserData.organizationId && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Organization ID:</span>
                          <span className="font-mono">{completeUserData.organizationId}</span>
                        </div>
                      )}
                      {completeUserData.address && (
                        <div>
                          <span className="text-muted-foreground">Address:</span>
                          <p className="mt-1">{completeUserData.address}</p>
                        </div>
                      )}
                      {completeUserData.registrationTimestamp && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Registered:</span>
                          <span>{new Date(completeUserData.registrationTimestamp).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="space-y-4">
                    <h4 className="font-medium mb-3">Uploaded Documents</h4>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="text-center p-3 border rounded-lg">
                        <Upload className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                        <div className="text-xs text-muted-foreground">Registration</div>
                        <div className="text-xs font-medium">
                          {completeUserData.registrationDocuments?.length || 0} files
                        </div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <FileText className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                        <div className="text-xs text-muted-foreground">Profile</div>
                        <div className="text-xs font-medium">
                          {completeUserData.companyProfile?.length || 0} files
                        </div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <Building2 className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                        <div className="text-xs text-muted-foreground">Logo</div>
                        <div className="text-xs font-medium">
                          {completeUserData.companyLogo?.length || 0} files
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  View Details
                </Button>
                
                <Link to="/master-data">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Master Data Portal
                  </Button>
                </Link>
                
                <div className="ml-auto">
                  <Button size="sm" variant="secondary">
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default OrganizationDashboard;