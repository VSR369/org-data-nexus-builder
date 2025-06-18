
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users, FileText, Calendar, Clock, CreditCard, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { useUserData } from "@/components/dashboard/UserDataProvider";
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';

interface MembershipData {
  status: 'active' | 'inactive' | 'not-member';
  selectedPlan?: string;
  selectedEngagementModel?: string;
  pricingDetails?: {
    currency: string;
    amount: number;
    paymentFrequency: string;
  };
  activationDate?: string;
  paymentStatus?: string;
}

const ReadOnlyOrganizationData: React.FC = () => {
  const { userData } = useUserData();
  const [membershipData, setMembershipData] = useState<MembershipData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembershipData = async () => {
      console.log('🔍 Loading actual membership data for organization:', userData.organizationName);
      
      try {
        // Initialize storage service
        await unifiedUserStorageService.initialize();
        
        // Look for membership data associated with this user/organization
        const userMembershipKey = `membership_${userData.userId}`;
        const orgMembershipKey = `membership_${userData.organizationId}`;
        
        // Try multiple storage keys to find membership data
        let membershipInfo = null;
        
        // Check localStorage for membership selections
        const possibleKeys = [
          userMembershipKey,
          orgMembershipKey,
          `${userData.organizationName}_membership`,
          `seeker_membership_${userData.userId}`,
          'selected_membership_plan',
          'membership_selection'
        ];
        
        for (const key of possibleKeys) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (parsed && (parsed.status || parsed.plan || parsed.membershipStatus)) {
                membershipInfo = parsed;
                console.log(`✅ Found membership data in key: ${key}`, parsed);
                break;
              }
            } catch (e) {
              // Continue checking other keys
            }
          }
        }
        
        // Check for pricing selection data
        const pricingKeys = [
          `pricing_${userData.userId}`,
          `selected_pricing_${userData.organizationId}`,
          'selected_engagement_model',
          'pricing_selection'
        ];
        
        let pricingInfo = null;
        for (const key of pricingKeys) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (parsed && (parsed.engagementModel || parsed.selectedModel || parsed.currency)) {
                pricingInfo = parsed;
                console.log(`✅ Found pricing data in key: ${key}`, parsed);
                break;
              }
            } catch (e) {
              // Continue checking other keys
            }
          }
        }
        
        // Try to get from unified storage service
        if (!membershipInfo) {
          try {
            const allUsers = await unifiedUserStorageService.getAllUsers();
            const currentUser = allUsers.find(u => u.userId === userData.userId || u.organizationId === userData.organizationId);
            
            if (currentUser && (currentUser.membershipStatus || currentUser.selectedPlan)) {
              membershipInfo = {
                status: currentUser.membershipStatus || 'not-member',
                selectedPlan: currentUser.selectedPlan,
                selectedEngagementModel: currentUser.selectedEngagementModel,
                activationDate: currentUser.membershipActivationDate,
                paymentStatus: currentUser.paymentStatus
              };
              console.log('✅ Found membership data in user profile', membershipInfo);
            }
          } catch (error) {
            console.log('⚠️ Error accessing unified storage:', error);
          }
        }
        
        // Combine membership and pricing data
        const combinedData: MembershipData = {
          status: membershipInfo?.status || membershipInfo?.membershipStatus || 'not-member',
          selectedPlan: membershipInfo?.selectedPlan || membershipInfo?.plan,
          selectedEngagementModel: pricingInfo?.engagementModel || pricingInfo?.selectedModel || membershipInfo?.selectedEngagementModel,
          pricingDetails: pricingInfo ? {
            currency: pricingInfo.currency || 'USD',
            amount: pricingInfo.amount || pricingInfo.price || 0,
            paymentFrequency: pricingInfo.frequency || pricingInfo.paymentFrequency || 'monthly'
          } : undefined,
          activationDate: membershipInfo?.activationDate || membershipInfo?.membershipDate,
          paymentStatus: membershipInfo?.paymentStatus || 'pending'
        };
        
        console.log('📋 Final combined membership data:', combinedData);
        setMembershipData(combinedData);
        
      } catch (error) {
        console.error('❌ Error loading membership data:', error);
        // Set default state if no data found
        setMembershipData({
          status: 'not-member'
        });
      } finally {
        setLoading(false);
      }
    };

    if (userData.userId) {
      loadMembershipData();
    }
  }, [userData]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getMembershipStatusDetails = () => {
    if (!membershipData) return { icon: Clock, color: 'text-gray-500', badge: 'secondary', message: 'Loading...' };
    
    switch (membershipData.status) {
      case 'active':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          badge: 'default',
          message: 'Active Member'
        };
      case 'inactive':
        return {
          icon: XCircle,
          color: 'text-red-600',
          badge: 'destructive',
          message: 'Inactive Member'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-500',
          badge: 'secondary',
          message: 'Not a Member'
        };
    }
  };

  const statusDetails = getMembershipStatusDetails();
  const StatusIcon = statusDetails.icon;

  return (
    <div className="space-y-6">
      {/* Organization Overview */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-blue-600" />
            Organization Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Organization Name</label>
                <p className="text-lg font-semibold text-gray-900">{userData.organizationName || 'Not specified'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Entity Type</label>
                <div className="mt-1">
                  <Badge variant="outline" className="text-sm">
                    {userData.entityType || 'Not specified'}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Organization Type</label>
                <div className="mt-1">
                  <Badge variant="outline" className="text-sm">
                    {userData.organizationType || 'Not specified'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Country</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{userData.country || 'Not specified'}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Contact Person</label>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{userData.contactPersonName || 'Not specified'}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{userData.email || 'Not specified'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Industry Segment</label>
                <p className="text-gray-900">{userData.industrySegment || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actual Membership Status */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-blue-600" />
            Current Membership Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Loading membership information...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <StatusIcon className={`h-6 w-6 ${statusDetails.color}`} />
                  <div>
                    <p className="font-medium text-gray-900">{statusDetails.message}</p>
                    {membershipData?.selectedPlan && (
                      <p className="text-sm text-gray-600">
                        Plan: {membershipData.selectedPlan}
                      </p>
                    )}
                    {membershipData?.activationDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Since: {formatDate(membershipData.activationDate)}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant={statusDetails.badge as any}>
                  {membershipData?.status === 'active' ? 'Active' : 
                   membershipData?.status === 'inactive' ? 'Inactive' : 'Not Member'}
                </Badge>
              </div>

              {membershipData?.status === 'active' && membershipData.pricingDetails && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-3">Selected Pricing Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-gray-600">Currency:</label>
                      <p className="font-medium">{membershipData.pricingDetails.currency}</p>
                    </div>
                    <div>
                      <label className="text-gray-600">Amount:</label>
                      <p className="font-medium">{membershipData.pricingDetails.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-gray-600">Payment Frequency:</label>
                      <p className="font-medium capitalize">{membershipData.pricingDetails.paymentFrequency}</p>
                    </div>
                    <div>
                      <label className="text-gray-600">Payment Status:</label>
                      <p className="font-medium capitalize">{membershipData.paymentStatus || 'Pending'}</p>
                    </div>
                  </div>
                </div>
              )}

              {membershipData?.selectedEngagementModel && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Selected Engagement Model</h4>
                  <p className="text-sm text-blue-800">{membershipData.selectedEngagementModel}</p>
                </div>
              )}

              {membershipData?.status === 'not-member' && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-900 mb-2">Membership Not Active</h4>
                  <p className="text-sm text-yellow-800">
                    This organization has not yet selected a membership plan or activated their membership.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Registration Details */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-green-600" />
            Registration Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Registration Date</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{formatDate(userData.registrationTimestamp)}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Registration Status</label>
                <div className="mt-1">
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    Completed
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Organization Profile Summary</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Organization:</strong> {userData.organizationName}</p>
                <p><strong>Type:</strong> {userData.entityType} - {userData.organizationType}</p>
                <p><strong>Location:</strong> {userData.country}</p>
                <p><strong>Industry:</strong> {userData.industrySegment}</p>
                <p><strong>Contact:</strong> {userData.contactPersonName} ({userData.email})</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps Information */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-blue-600" />
            Current Status & Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {membershipData?.status === 'active' ? (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">Ready to Use Platform</h4>
                <p className="text-sm text-green-800">
                  Your membership is active and you have full access to platform features.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Registration Complete</h4>
                <p className="text-sm text-blue-800">
                  Your organization registration is complete. {membershipData?.status === 'not-member' 
                    ? 'Consider activating a membership plan to access premium features.' 
                    : 'Your membership status needs attention.'}
                </p>
              </div>
            )}
            
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Available Actions</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Browse solutions and services</li>
                <li>• Post challenges and requirements</li>
                <li>• Connect with solution providers</li>
                <li>• Participate in community discussions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReadOnlyOrganizationData;
