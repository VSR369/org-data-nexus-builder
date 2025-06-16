import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMembershipData } from '@/hooks/useMembershipData';
import { useToast } from "@/hooks/use-toast";
import { OrganizationDetailsSection } from '@/components/membership/OrganizationDetailsSection';
import { MembershipPricingSection } from '@/components/membership/MembershipPricingSection';
import { DebugSection } from '@/components/membership/DebugSection';
import { UserInfoSection } from '@/components/membership/UserInfoSection';
import { MembershipActionSection } from '@/components/membership/MembershipActionSection';
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';

interface MembershipRegistrationProps {
  userId?: string;
  organizationName?: string;
  entityType?: string;
  country?: string;
  membershipData?: any;
}

const MembershipRegistration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State from location or will be loaded from storage
  const locationState = location.state as MembershipRegistrationProps || {};
  const [userData, setUserData] = useState({
    userId: locationState.userId || '',
    organizationName: locationState.organizationName || '',
    entityType: locationState.entityType || '',
    country: locationState.country || ''
  });
  
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [savedMembershipData, setSavedMembershipData] = useState<any>(null);
  
  const { membershipData, countryPricing, loading, error, debugInfo } = useMembershipData(userData.entityType, userData.country);

  // Load user data and saved membership selection on component mount
  useEffect(() => {
    const loadUserData = async () => {
      console.log('🔍 Loading user data for membership registration...');
      setIsLoadingUserData(true);
      
      try {
        // First try to load from session
        const sessionData = await unifiedUserStorageService.loadSession();
        
        if (sessionData) {
          console.log('✅ Found session data:', sessionData);
          setUserData({
            userId: sessionData.userId,
            organizationName: sessionData.organizationName,
            entityType: sessionData.entityType,
            country: sessionData.country
          });
        } else {
          // If no session, try to find user "vsr 369" specifically
          console.log('⚠️ No session found, looking for user vsr 369...');
          const user = await unifiedUserStorageService.findUserById('vsr 369');
          
          if (user) {
            console.log('✅ Found user vsr 369:', user);
            setUserData({
              userId: user.userId,
              organizationName: user.organizationName,
              entityType: user.entityType,
              country: user.country
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
            toast({
              title: "User Not Found",
              description: "Could not find user 'vsr 369'. Please log in first.",
              variant: "destructive",
            });
            navigate('/seeker-login');
          }
        }
      } catch (error) {
        console.error('❌ Error loading user data:', error);
        toast({
          title: "Error Loading User Data",
          description: "Failed to load user information. Please try logging in again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingUserData(false);
      }
    };

    // Load saved membership data if available
    const loadSavedMembershipData = () => {
      try {
        const saved = localStorage.getItem('pending_membership_registration');
        if (saved) {
          const membershipData = JSON.parse(saved);
          setSavedMembershipData(membershipData);
          setSelectedPlan(membershipData.selectedPlan);
          console.log('✅ Loaded saved membership data:', membershipData);
        }
      } catch (error) {
        console.error('Error loading saved membership data:', error);
      }
    };

    // Only load if we don't have complete user data
    if (!userData.userId || !userData.organizationName) {
      loadUserData();
    }
    
    loadSavedMembershipData();
  }, [navigate, toast, userData.userId, userData.organizationName]);

  // Load saved plan selection on component mount
  useEffect(() => {
    if (!selectedPlan) {
      const savedPlan = localStorage.getItem('selectedMembershipPlan');
      if (savedPlan) {
        setSelectedPlan(savedPlan);
        console.log('✅ Restored saved membership plan:', savedPlan);
      }
    }
  }, [selectedPlan]);

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    // Save to localStorage for persistence
    localStorage.setItem('selectedMembershipPlan', plan);
    console.log('✅ Selected and saved membership plan:', plan);
  };

  const handleProceedWithMembership = () => {
    if (!selectedPlan) {
      toast({
        title: "Plan Selection Required",
        description: "Please select a membership plan to proceed.",
        variant: "destructive",
      });
      return;
    }

    const finalMembershipData = {
      ...savedMembershipData,
      userData,
      selectedPlan,
      membershipData,
      countryPricing,
      registeredAt: new Date().toISOString()
    };

    // Save final membership registration
    localStorage.setItem('completed_membership_registration', JSON.stringify(finalMembershipData));
    
    // Clear pending data
    localStorage.removeItem('pending_membership_registration');

    console.log('Membership registration completed:', finalMembershipData);

    toast({
      title: "Membership Registration Completed",
      description: `Your ${selectedPlan} membership has been registered successfully!`,
    });

    // TODO: Implement actual payment gateway integration
    // This is where you would integrate with Stripe or other payment providers
    
    // Navigate back to dashboard after successful registration
    setTimeout(() => {
      navigate('/seeker-dashboard', { state: { userId: userData.userId } });
    }, 2000);
  };

  if (loading || isLoadingUserData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p>{isLoadingUserData ? 'Loading user data...' : 'Loading membership information...'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Link to="/seeker-dashboard" state={{ userId: userData.userId }}>
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl font-bold">
                    Membership Registration
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Complete your membership registration
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Show saved membership data if available */}
            {savedMembershipData && (
              <Card className="bg-green-50 border border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Membership Plan Selected</p>
                      <p className="text-sm text-green-700">
                        {savedMembershipData.selectedPlan.charAt(0).toUpperCase() + savedMembershipData.selectedPlan.slice(1)} plan selected on {new Date(savedMembershipData.selectedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Debug Information (only show when there's an error) */}
            {error && <DebugSection debugInfo={debugInfo} />}

            <OrganizationDetailsSection 
              organizationName={userData.organizationName}
              entityType={userData.entityType}
              country={userData.country}
            />

            {/* Error Display */}
            {error && (
              <Card className="border-l-4 border-l-red-500 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    <p className="font-medium">{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Membership Pricing Information */}
            {membershipData && countryPricing && (
              <MembershipPricingSection 
                membershipData={membershipData}
                countryPricing={countryPricing}
                selectedPlan={selectedPlan}
                onPlanSelect={handlePlanSelect}
              />
            )}

            <UserInfoSection userId={userData.userId} />

            <MembershipActionSection 
              disabled={!membershipData || !countryPricing || !!error}
              selectedPlan={selectedPlan}
              onProceed={handleProceedWithMembership}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MembershipRegistration;
