
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Mail, Phone, Globe, MapPin, LogOut, ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface AdminSession {
  id: string;
  admin_name: string;
  admin_email: string;
  organization_id: string;
  organization_name?: string;
  contact_number?: string;
  role_type: string;
  last_login: string;
}

const SeekingOrgAdminDashboard = () => {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load admin session from localStorage
    const sessionData = localStorage.getItem('seeking_org_admin_session');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      setAdminSession(session);
      console.log('📊 Admin dashboard loaded for:', session.admin_name);
    } else {
      console.log('❌ No admin session found, redirecting to login');
      navigate('/seeking-org-admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('seeking_org_admin_session');
    toast.success('Successfully logged out');
    navigate('/');
  };

  if (!adminSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
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
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Administrator Dashboard</h1>
                <p className="text-sm text-gray-600">Solution Seeking Organization Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Main Portal
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {adminSession.admin_name}!
          </h2>
          <p className="text-gray-600">
            Administrator for {adminSession.organization_name || adminSession.organization_id}
          </p>
        </div>

        {/* Administrator Details Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Administrator Information
              </CardTitle>
              <CardDescription>
                Your personal administrator details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Full Name</span>
                </div>
                <span className="font-medium">{adminSession.admin_name}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Email Address</span>
                </div>
                <span className="font-medium">{adminSession.admin_email}</span>
              </div>
              
              {adminSession.contact_number && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Phone Number</span>
                  </div>
                  <span className="font-medium">{adminSession.contact_number}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Role</span>
                </div>
                <Badge variant="secondary">{adminSession.role_type}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Organization Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                Organization Details
              </CardTitle>
              <CardDescription>
                Information about your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Organization ID</span>
                </div>
                <span className="font-medium font-mono text-sm">{adminSession.organization_id}</span>
              </div>
              
              {adminSession.organization_name && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Organization Name</span>
                  </div>
                  <span className="font-medium">{adminSession.organization_name}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Access Level</span>
                </div>
                <Badge variant="default" className="bg-green-600">Administrator</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Session Information */}
        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
            <CardDescription>
              Details about your current login session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Login</span>
              <span className="font-medium">
                {new Date(adminSession.last_login).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Session Status</span>
              <Badge variant="default" className="bg-green-600">Active</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/master-data-portal">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                <span>Master Data Portal</span>
              </Button>
            </Link>
            
            <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2" disabled>
              <User className="h-6 w-6 text-gray-400" />
              <span>Manage Users</span>
              <span className="text-xs text-gray-500">(Coming Soon)</span>
            </Button>
            
            <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2" disabled>
              <Shield className="h-6 w-6 text-gray-400" />
              <span>Security Settings</span>
              <span className="text-xs text-gray-500">(Coming Soon)</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SeekingOrgAdminDashboard;
