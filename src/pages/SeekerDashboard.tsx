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
import MembershipBenefitsCard from '@/components/dashboard/MembershipBenefitsCard';
import MembershipSelectionModal from '@/components/dashboard/MembershipSelectionModal';
import MembershipStatusCard from '@/components/dashboard/MembershipStatusCard';
import { useMembershipData } from '@/hooks/useMembershipData';
import { useSeekerMasterData } from '@/hooks/useSeekerMasterData';
import { Building, User, Globe, Mail, Calendar, Shield, Database, CreditCard, CheckCircle, Clock } from 'lucide-react';

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
  const [showMembershipBenefits, setShowMembershipBenefits] = useState(false);
  const [showMembershipSelection, setShowMembershipSelection] = useState(false);
  const [membershipPaymentData, setMembershipPaymentData] = useState<any>(null);

  // Load master data for industry segments
  const { industrySegments } = useSeekerMasterData();

  // Load membership data for the current user
  const { membershipData, countryPricing, loading: membershipLoading } = useMembershipData(
    userData.entityType, 
    userData.country, 
    userData.organizationType
  );

  // Helper function to get industry segment name by ID
  const getIndustrySegmentName = (segmentId: string) => {
    if (!segmentId || !industrySegments.length) return 'Not Available';
    
    const segment = industrySegments.find(seg => seg.id === segmentId);
    return segment ? segment.industrySegment : segmentId; // fallback to ID if not found
  };

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
          
          // Try to get full user data from storage
          const fullUserData = await unifiedUserStorageService.findUserById(sessionData.userId);
          
          if (fullUserData) {
            console.log('✅ Found full user data:', fullUserData);
            setUserData({
              userId: fullUserData.userId,
              organizationName: fullUserData.organizationName,
              entityType: fullUserData.entityType,
              country: fullUserData.country,
              email: fullUserData.email,
              contactPersonName: fullUserData.contactPersonName,
              organizationType: fullUserData.organizationType || fullUserData.entityType,
              industrySegment: fullUserData.industrySegment || 'Not Available',
              organizationId: fullUserData.organizationId || fullUserData.userId,
              registrationTimestamp: fullUserData.registrationTimestamp || fullUserData.createdAt || new Date().toISOString()
            });
          } else {
            // Fallback to session data only
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
          }
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
              registrationTimestamp: user.registrationTimestamp || user.createdAt || new Date().toISOString()
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
          console.log('⚠️ No location userId or session, looking for user vsr369...');
          const user = await unifiedUserStorageService.findUserById('vsr369');
          
          if (user) {
            console.log('✅ Found user vsr369:', user);
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
              registrationTimestamp: user.registrationTimestamp || user.createdAt || new Date().toISOString()
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
            console.log('❌ User vsr369 not found');
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

    // Load membership payment data
    const loadMembershipPaymentData = () => {
      try {
        const paymentData = localStorage.getItem('completed_membership_payment');
        if (paymentData) {
          const parsedData = JSON.parse(paymentData);
          setMembershipPaymentData(parsedData);
          console.log('✅ Loaded membership payment data:', parsedData);
        }
      } catch (error) {
        console.error('Error loading membership payment data:', error);
      }
    };

    // Only load if we don't have complete user data
    if (!userData.userId || !userData.organizationName) {
      loadUserData();
    }
    
    loadMembershipPaymentData();
  }, [location.state, navigate, toast, userData.userId, userData.organizationName]);

  const handleLogout = (userId?: string) => {
    console.log('Logging out user:', userId);
    // Clear session and navigate to login
    unifiedUserStorageService.clearSession();
    navigate('/seeker-login');
  };

  const handleJoinAsMember = () => {
    console.log('Join as Member clicked - showing membership selection');
    setShowMembershipSelection(true);
  };

  const handleProceedToMembership = (membershipData: any) => {
    console.log('Proceeding with membership data:', membershipData);
    setShowMembershipSelection(false);
    
    navigate('/membership-registration', {
      state: {
        userId: userData.userId,
        organizationName: userData.organizationName,
        entityType: userData.entityType,
        country: userData.country,
        membershipData
      }
    });
  };

  // Determine membership status
  const getMembershipStatus = () => {
    if (membershipPaymentData && membershipPaymentData.membershipStatus === 'active') {
      // Get the correct amount based on the selected plan
      let paidAmount = 0;
      if (membershipPaymentData.pricing) {
        switch (membershipPaymentData.selectedPlan) {
          case 'quarterly':
            paidAmount = membershipPaymentData.pricing.quarterlyPrice;
            break;
          case 'halfyearly':
            paidAmount = membershipPaymentData.pricing.halfYearlyPrice;
            break;
          case 'annual':
            paidAmount = membershipPaymentData.pricing.annualPrice;
            break;
          default:
            paidAmount = 0;
        }
      }

      return {
        status: 'active' as const,
        plan: membershipPaymentData.selectedPlan,
        message: 'Your membership is active',
        badgeVariant: 'default' as const,
        icon: CheckCircle,
        iconColor: 'text-green-600',
        paymentDate: membershipPaymentData.paidAt,
        pricing: {
          currency: membershipPaymentData.pricing?.currency || 'USD',
          amount: paidAmount
        }
      };
    }
    
    return {
      status: 'inactive' as const,
      plan: '',
      message: 'No active membership found',
      badgeVariant: 'secondary' as const,
      icon: Clock,
      iconColor: 'text-gray-400'
    };
  };

  const membershipStatus = getMembershipStatus();

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

              {/* Membership Status Card */}
              <MembershipStatusCard membershipStatus={membershipStatus} />

              {/* Join as Member Button - Only show if membership is not active */}
              {membershipStatus.status !== 'active' && (
                <div className="mt-6 mb-6">
                  <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-2">Ready to unlock premium features?</h3>
                          <p className="text-blue-100">
                            Join as a member to access exclusive benefits, priority support, and enhanced marketplace features.
                          </p>
                        </div>
                        <Button 
                          onClick={handleJoinAsMember}
                          className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 text-lg font-semibold"
                          size="lg"
                        >
                          <CreditCard className="mr-2 h-5 w-5" />
                          Join as Member
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

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
                            {userData.organizationId && userData.organizationId !== userData.userId ? 
                              userData.organizationId : 'Not Available'}
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
                            {getIndustrySegmentName(userData.industrySegment)}
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

      {/* Membership Benefits Modal */}
      {showMembershipBenefits && (
        <MembershipBenefitsCard
          countryPricing={countryPricing}
          userData={{
            userId: userData.userId,
            organizationName: userData.organizationName,
            entityType: userData.entityType,
            country: userData.country
          }}
          onClose={() => setShowMembershipBenefits(false)}
        />
      )}

      {/* Membership Selection Modal */}
      {showMembershipSelection && (
        <MembershipSelectionModal
          countryPricing={countryPricing}
          userData={{
            userId: userData.userId,
            organizationName: userData.organizationName,
            entityType: userData.entityType,
            country: userData.country
          }}
          onClose={() => setShowMembershipSelection(false)}
          onProceed={handleProceedToMembership}
        />
      )}
    </>
  );
};

export default SeekerDashboard;
