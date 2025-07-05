import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Settings, 
  FileText, 
  LogOut,
  Edit,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { getCurrentSolutionSeekingOrg } from '@/utils/authUtils';

interface OrganizationData {
  organizationName: string;
  email: string;
  organizationId: string;
  entityType: string;
  contactPersonName?: string;
  industrySegment?: string;
  country?: string;
  organizationType?: string;
  membershipType?: string;
  membershipStatus?: string;
  engagementModel?: string;
  lastLoginTime?: string;
}

const OrganizationDashboard: React.FC = () => {
  const [orgData, setOrgData] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { session, logout } = useAuthSession();

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  const fetchOrganizationData = () => {
    console.log('📊 DASHBOARD - Fetching organization data...');
    setLoading(true);
    setError('');

    try {
      // Get current session
      const currentSession = getCurrentSolutionSeekingOrg();
      if (!currentSession) {
        setError('No active session found');
        setLoading(false);
        return;
      }

      // Fetch additional data from localStorage
      const registeredUsers = localStorage.getItem('registered_users');
      if (registeredUsers) {
        const users = JSON.parse(registeredUsers);
        const currentUser = users.find((u: any) => 
          u.userId === currentSession.userId || u.email === currentSession.email
        );

        if (currentUser) {
          const organizationData: OrganizationData = {
            organizationName: currentUser.organizationName || currentSession.organizationName,
            email: currentUser.email || currentSession.email,
            organizationId: currentUser.organizationId || currentSession.organizationId,
            entityType: currentUser.entityType || currentSession.entityType,
            contactPersonName: currentUser.contactPersonName,
            industrySegment: currentUser.industrySegment,
            country: currentUser.country,
            organizationType: currentUser.organizationType,
            membershipType: 'Premium', // Default values - would come from membership service
            membershipStatus: 'Active',
            engagementModel: 'Full-Service',
            lastLoginTime: currentSession.loginTime
          };

          console.log('✅ DASHBOARD - Organization data loaded:', organizationData);
          setOrgData(organizationData);
        } else {
          console.log('⚠️ DASHBOARD - User not found in registered users');
          // Fallback to session data
          setOrgData({
            organizationName: currentSession.organizationName,
            email: currentSession.email,
            organizationId: currentSession.organizationId,
            entityType: currentSession.entityType,
            membershipType: 'Basic',
            membershipStatus: 'Active',
            lastLoginTime: currentSession.loginTime
          });
        }
      }
    } catch (error) {
      console.error('❌ DASHBOARD - Error fetching organization data:', error);
      setError('Failed to load organization data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('🔓 DASHBOARD - Logging out...');
    logout();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'inactive': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !orgData) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchOrganizationData}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Organization Info */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
                  {orgData.organizationName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{orgData.organizationName}</h1>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {orgData.email}
                  </span>
                  {orgData.country && (
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {orgData.country}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Badge className={`${getStatusColor(orgData.membershipStatus || 'active')} flex items-center gap-1`}>
                {getStatusIcon(orgData.membershipStatus || 'active')}
                {orgData.membershipStatus || 'Active'}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Organization Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Organization Name</label>
                  <p className="text-foreground">{orgData.organizationName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Organization ID</label>
                  <p className="text-foreground">{orgData.organizationId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Entity Type</label>
                  <p className="text-foreground">{orgData.entityType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Industry Segment</label>
                  <p className="text-foreground">{orgData.industrySegment || 'Not specified'}</p>
                </div>
                {orgData.contactPersonName && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                    <p className="text-foreground">{orgData.contactPersonName}</p>
                  </div>
                )}
              </div>
              <div className="pt-4">
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                View Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Upcoming Events
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Performance Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Membership Details */}
          <Card>
            <CardHeader>
              <CardTitle>Membership Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Membership Type</label>
                <p className="text-foreground">{orgData.membershipType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Badge className={`${getStatusColor(orgData.membershipStatus || 'active')} mt-1`}>
                  {orgData.membershipStatus}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Engagement Model</label>
                <p className="text-foreground">{orgData.engagementModel}</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Successfully logged in</p>
                    <p className="text-xs text-muted-foreground">
                      {orgData.lastLoginTime ? new Date(orgData.lastLoginTime).toLocaleString() : 'Just now'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Profile accessed</p>
                    <p className="text-xs text-muted-foreground">Dashboard loaded successfully</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDashboard;