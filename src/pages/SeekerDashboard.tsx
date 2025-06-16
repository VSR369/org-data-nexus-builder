
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
import SeekerDetailsCard from '@/components/dashboard/SeekerDetailsCard';
import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
import LoginWarning from '@/components/dashboard/LoginWarning';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

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
    contactPersonName: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginWarning, setShowLoginWarning] = useState(false);

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
            contactPersonName: sessionData.contactPersonName
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
              contactPersonName: user.contactPersonName
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
              contactPersonName: user.contactPersonName
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

  const handleJoinAsMember = () => {
    console.log('Navigating to membership registration...');
    navigate('/membership-registration', {
      state: {
        userId: userData.userId,
        organizationName: userData.organizationName,
        entityType: userData.entityType,
        country: userData.country
      }
    });
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
      <AppSidebar />
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
              <DashboardHeader userData={userData} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {showLoginWarning && <LoginWarning />}
                  
                  <SeekerDetailsCard userData={userData} />
                  
                  <QuickActionsCard 
                    onJoinAsMember={handleJoinAsMember}
                    showLoginWarning={showLoginWarning}
                  />
                </div>

                <div className="space-y-6">
                  <Card className="shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="text-xl">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Active Solutions</span>
                          <span className="font-semibold">0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Challenges</span>
                          <span className="font-semibold">0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Member Since</span>
                          <span className="font-semibold">Today</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
};

export default SeekerDashboard;
