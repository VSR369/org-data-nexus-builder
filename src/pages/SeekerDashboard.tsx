
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import LoginWarning from '@/components/dashboard/LoginWarning';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Building, User, Globe, Mail, Calendar, Shield, Database } from 'lucide-react';

interface SeekerDashboardProps {
  userId?: string;
}

const SeekerDashboard: React.FC<SeekerDashboardProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userData, setUserData] = useState({
    userId: '',
    organizationName: '',
    entityType: '',
    country: '',
    email: '',
    contactPersonName: '',
    organizationType: '',
    industrySegment: '',
    organizationId: '',
    registrationTimestamp: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginWarning, setShowLoginWarning] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      console.log('🔍 Loading user data for dashboard...');
      setIsLoading(true);
      
      try {
        // Get userId from location state
        const locationUserId = (location.state as any)?.userId;
        
        // First try to load from session
        const sessionData = await unifiedUserStorageService.loadSession();
        
        if (sessionData) {
          console.log('✅ Found session data:', sessionData);
          setUserData({
            userId: sessionData.userId,
            organizationName: sessionData.organizationName,
            entityType: sessionData.entityType,
            country: sessionData.country,
            email: sessionData.email,
            contactPersonName: sessionData.contactPersonName,
            organizationType: sessionData.entityType, // Fallback
            industrySegment: 'Not Available',
            organizationId: sessionData.userId, // Fallback
            registrationTimestamp: sessionData.loginTimestamp || new Date().toISOString()
          });
        } else if (locationUserId) {
          // Try to find user by ID from location state
          console.log('🔍 No session, looking for user:', locationUserId);
          const user = await unifiedUserStorageService.findUserById(locationUserId);
          
          if (user) {
            console.log('✅ Found user:', user);
            setUserData({
              userId: user.userId,
              organizationName: user.organizationName,
              entityType: user.entityType,
              country: user.country,
              email: user.email,
              contactPersonName: user.contactPersonName,
              organizationType: user.organizationType || user.entityType,
              industrySegment: user.industrySegment || 'Not Available',
              organizationId: user.organizationId || user.userId,
              registrationTimestamp: user.registrationTimestamp || new Date().toISOString()
            });
            
            // Save session for this user
            await unifiedUserStorageService.saveSession({
              userId: user.userId,
              organizationName: user.organizationName,
              entityType: user.entityType,
              country: user.country,
              email: user.email,
              contactPersonName: user.contactPersonName,
              loginTimestamp: new Date().toISOString()
            });
          } else {
            console.log('❌ User not found');
            setShowLoginWarning(true);
          }
        } else {
          // Try to find user "vsr 369" specifically as fallback
          console.log('⚠️ No location userId or session, looking for user vsr 369...');
          const user = await unifiedUserStorageService.findUserById('vsr 369');
          
          if (user) {
            console.log('✅ Found user vsr 369:', user);
            setUserData({
              userId: user.userId,
              organizationName: user.organizationName,
              entityType: user.entityType,
              country: user.country,
              email: user.email,
              contactPersonName: user.contactPersonName,
              organizationType: user.organizationType || user.entityType,
              industrySegment: user.industrySegment || 'Not Available',
              organizationId: user.organizationId || user.userId,
              registrationTimestamp: user.registrationTimestamp || new Date().toISOString()
            });
            
            // Save session for this user
            await unifiedUserStorageService.saveSession({
              userId: user.userId,
              organizationName: user.organizationName,
              entityType: user.entityType,
              country: user.country,
              email: user.email,
              contactPersonName: user.contactPersonName,
              loginTimestamp: new Date().toISOString()
            });
          } else {
            console.log('❌ User vsr 369 not found');
            setShowLoginWarning(true);
          }
        }
      } catch (error) {
        console.error('❌ Error loading user data:', error);
        setShowLoginWarning(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [location.state]);

  const handleLogout = (userId?: string) => {
    console.log('Logging out user:', userId);
    // Clear session and navigate to login
    unifiedUserStorageService.clearSession();
    navigate('/seeker-login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p>Loading dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="max-w-7xl mx-auto p-6">
              <DashboardHeader onLogout={handleLogout} userId={userData.userId} />

              <LoginWarning show={showLoginWarning} />

              {/* Complete Registration Details */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                {/* Organization Information */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Building className="h-6 w-6 text-blue-600" />
                      Organization Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Building className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">Organization Name</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {userData.organizationName || 'Not Available'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Database className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">Organization ID</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {userData.organizationId || 'Not Available'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Shield className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">Organization Type</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {userData.organizationType || 'Not Available'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Building className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">Industry Segment</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {userData.industrySegment || 'Not Available'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal & Contact Information */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <User className="h-6 w-6 text-green-600" />
                      Personal & Contact Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <User className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">Contact Person</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {userData.contactPersonName || 'Not Available'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Database className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">User ID</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {userData.userId || 'Not Available'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">Email Address</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {userData.email || 'Not Available'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Globe className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">Country</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {userData.country || 'Not Available'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Entity & Registration Information */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Shield className="h-6 w-6 text-purple-600" />
                      Entity & Registration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Shield className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">Entity Type</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {userData.entityType || 'Not Available'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">Registration Date</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {userData.registrationTimestamp ? 
                              new Date(userData.registrationTimestamp).toLocaleDateString() : 
                              'Not Available'
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                        <Shield className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm text-green-600 font-medium">Registration Status</p>
                          <p className="text-lg font-semibold text-green-700">
                            Active & Verified
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Summary */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Database className="h-6 w-6 text-orange-600" />
                      Account Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Building className="h-5 w-5 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm text-blue-600 font-medium">Account Type</p>
                          <p className="text-lg font-semibold text-blue-700">
                            Solution Seeker
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Database className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">Profile Completion</p>
                          <p className="text-lg font-semibold text-gray-900">
                            85%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <Calendar className="h-5 w-5 text-yellow-600" />
                        <div className="flex-1">
                          <p className="text-sm text-yellow-600 font-medium">Last Login</p>
                          <p className="text-lg font-semibold text-yellow-700">
                            Today
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
};

export default SeekerDashboard;
