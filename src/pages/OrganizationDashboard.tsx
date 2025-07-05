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
import MembershipEngagementDashboard from '@/components/dashboard/MembershipEngagementDashboard';
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
          // Temporary: Create demo session data for testing
          const demoSession = {
            userId: 'demo-user-123',
            organizationName: 'Demo Organization',
            entityType: 'Corporation',
            country: 'United States',
            contactPersonName: 'John Demo',
            email: 'demo@example.com',
            organizationType: 'Technology',
            industrySegment: 'Software',
            organizationId: 'ORG-DEMO-001',
            loginTimestamp: new Date().toISOString()
          };
          setSessionData(demoSession);
          console.log('🔧 Demo session created for testing');
        }
      } catch (error) {
        console.error('Error loading session:', error);
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

        {/* Data Loading Status */}
        {userDataError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load complete organization data: {userDataError}
            </AlertDescription>
          </Alert>
        )}

        {/* Membership and Engagement Dashboard */}
        <div className="space-y-6">
          <MembershipEngagementDashboard
            organizationType={completeUserData?.organizationType || sessionData.organizationType || 'Technology'}
            entityType={completeUserData?.entityType || sessionData.entityType}
            country={completeUserData?.country || sessionData.country}
            membershipStatus="not-a-member"
          />
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
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
      </main>
    </div>
  );
};

export default OrganizationDashboard;