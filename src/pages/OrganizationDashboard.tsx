import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Activity,
  Phone,
  Globe,
  AlertCircle,
  Loader2,
  Upload,
  Eye
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useCompleteUserData } from '@/hooks/useCompleteUserData';
import MembershipTypeSelector from '@/components/dashboard/MembershipTypeSelector';
import EngagementModelSelector from '@/components/dashboard/EngagementModelSelector';

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
  const [selectedMembership, setSelectedMembership] = useState<any>(null);
  const [selectedEngagement, setSelectedEngagement] = useState<any>(null);
  const [engagementPricing, setEngagementPricing] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load complete user data
  const { userData: completeUserData, loading: userDataLoading, error: userDataError } = useCompleteUserData(sessionData?.userId);

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

        <div className="space-y-8">
          {/* Data Loading Status */}
          {userDataError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load complete organization data: {userDataError}
              </AlertDescription>
            </Alert>
          )}

          {/* Complete Organization Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Complete Organization Information
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                All information captured during registration
              </p>
            </CardHeader>
            <CardContent>
              {completeUserData ? (
                <div className="space-y-6">
                  {/* Basic Organization Details */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Organization Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Organization Name</label>
                        <p className="text-base font-semibold text-gray-900">{completeUserData.organizationName}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">User ID</label>
                        <p className="text-base font-semibold text-gray-900">{completeUserData.userId}</p>
                      </div>
                      
                      {completeUserData.organizationId && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Organization ID</label>
                          <p className="text-base font-mono text-gray-900">{completeUserData.organizationId}</p>
                        </div>
                      )}
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Entity Type</label>
                        <Badge variant="secondary">{completeUserData.entityType}</Badge>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Organization Type</label>
                        <Badge variant="outline">{completeUserData.organizationType}</Badge>
                      </div>
                      
                      {completeUserData.industrySegment && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Industry Segment</label>
                          <Badge variant="outline">{completeUserData.industrySegment}</Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Contact Person</label>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{completeUserData.contactPersonName}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email Address</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{completeUserData.email}</span>
                        </div>
                      </div>
                      
                      {completeUserData.phoneNumber && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone Number</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">
                              {completeUserData.countryCode ? `+${completeUserData.countryCode} ` : ''}
                              {completeUserData.phoneNumber}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {completeUserData.website && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Website</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <a href={completeUserData.website} target="_blank" rel="noopener noreferrer" 
                               className="text-blue-600 hover:underline">
                              {completeUserData.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Location Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Location Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Country</label>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{completeUserData.country}</span>
                        </div>
                      </div>
                      
                      {completeUserData.address && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Address</label>
                          <div className="flex items-start gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                            <span className="text-gray-900">{completeUserData.address}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Document Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Upload className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Registration Documents</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {completeUserData.registrationDocuments?.length || 0} files uploaded
                        </p>
                        {(completeUserData.registrationDocuments?.length || 0) > 0 && (
                          <Button size="sm" variant="outline" className="mt-2">
                            <Eye className="h-3 w-3 mr-1" />
                            View Files
                          </Button>
                        )}
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Company Profile</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {completeUserData.companyProfile?.length || 0} files uploaded
                        </p>
                        {(completeUserData.companyProfile?.length || 0) > 0 && (
                          <Button size="sm" variant="outline" className="mt-2">
                            <Eye className="h-3 w-3 mr-1" />
                            View Files
                          </Button>
                        )}
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Company Logo</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {completeUserData.companyLogo?.length || 0} files uploaded
                        </p>
                        {(completeUserData.companyLogo?.length || 0) > 0 && (
                          <Button size="sm" variant="outline" className="mt-2">
                            <Eye className="h-3 w-3 mr-1" />
                            View Logo
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Registration Timestamp */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Registration History</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {completeUserData.registrationTimestamp && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Registration Date</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">
                              {new Date(completeUserData.registrationTimestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Last Login</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">
                            {new Date(sessionData.loginTimestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    Complete organization data not available. Using session data only.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    This may happen if the registration was completed in a different browser or the data was cleared.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selection Options */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Membership Type Selection (Optional) */}
            <div>
              <MembershipTypeSelector
                organizationType={sessionData.organizationType || sessionData.entityType}
                entityType={sessionData.entityType}
                country={sessionData.country}
                onMembershipSelect={setSelectedMembership}
              />
            </div>

            {/* Engagement Model Selection (Mandatory) */}
            <div>
              <EngagementModelSelector
                onEngagementSelect={(engagement, pricing) => {
                  setSelectedEngagement(engagement);
                  setEngagementPricing(pricing);
                }}
                selectedEngagement={selectedEngagement}
              />
            </div>
          </div>

          {/* Selection Summary & Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Selection Summary & Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Membership Selection</label>
                    {selectedMembership ? (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="font-medium text-green-800">
                          {selectedMembership.organizationType} - {selectedMembership.entityType}
                        </p>
                        <p className="text-sm text-green-600">
                          {selectedMembership.currency} {selectedMembership.membershipFee.toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-600">No membership selected (Optional)</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Engagement Model</label>
                    {selectedEngagement ? (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="font-medium text-blue-800">{selectedEngagement.name}</p>
                        {engagementPricing && (
                          <p className="text-sm text-blue-600">
                            {engagementPricing.currency} {engagementPricing.basePrice.toLocaleString()}
                            {engagementPricing.discountPercentage && ` (-${engagementPricing.discountPercentage}%)`}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">Required: Please select an engagement model</p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="flex items-center gap-2"
                    disabled={!selectedEngagement}
                  >
                    <Settings className="h-4 w-4" />
                    Proceed with Configuration
                  </Button>
                  
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
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default OrganizationDashboard;