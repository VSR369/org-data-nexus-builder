
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, User, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import OrganizationInfoDisplay from '@/components/seeker-membership/OrganizationInfoDisplay';
import DebugInfoPanel from '@/components/seeker-membership/DebugInfoPanel';
import EntityTypeSelector from '@/components/seeker-membership/EntityTypeSelector';
import MembershipPlanSelector from '@/components/seeker-membership/MembershipPlanSelector';
import { useMembershipForm } from '@/components/seeker-membership/hooks/useMembershipForm';
import { checkExistingMembership } from '@/utils/membershipUtils';

interface SeekerMembershipProps {
  userId?: string;
  organizationName?: string;
  isEditing?: boolean;
  existingEntityType?: string;
  existingMembershipPlan?: string;
}

const SeekerMembership = () => {
  const location = useLocation();
  
  const { 
    userId, 
    organizationName, 
    isEditing, 
    existingEntityType, 
    existingMembershipPlan 
  } = location.state as SeekerMembershipProps || {};

  console.log('🔍 SeekerMembership received state:', {
    userId,
    organizationName,
    isEditing,
    existingEntityType,
    existingMembershipPlan
  });

  // Get existing membership details for display
  const existingMembershipDetails = isEditing && userId ? checkExistingMembership(userId) : null;

  console.log('📋 Existing membership details for display:', existingMembershipDetails);

  const {
    entityTypes,
    membershipFees,
    selectedEntityType,
    setSelectedEntityType,
    selectedPlan,
    setSelectedPlan,
    isLoading,
    getMembershipOptions,
    handleSubmit
  } = useMembershipForm({
    userId,
    organizationName,
    isEditing,
    existingEntityType,
    existingMembershipPlan
  });

  const membershipOptions = getMembershipOptions();

  // Format membership plan display
  const formatMembershipPlan = (plan?: string) => {
    if (!plan) return '';
    switch (plan) {
      case 'quarterly':
        return 'Quarterly';
      case 'halfYearly':
        return 'Half-Yearly';
      case 'annual':
        return 'Annual';
      default:
        return plan;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-xl border-0">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Link to="/seeker-dashboard" state={{ userId, organizationName, isMember: isEditing || false }}>
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {isEditing ? 'Edit Seeker Membership' : 'Seeker Membership Registration'}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {isEditing ? 'Update your membership details' : 'Complete your membership to access all features'}
                  </p>
                </div>
              </div>
            </div>

            {/* Show editing notice with current details */}
            {isEditing && existingMembershipDetails && existingMembershipDetails.isMember && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <p className="text-blue-800 font-medium">Current Membership Details</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-blue-700">Entity Type:</span>
                    <span className="font-semibold text-blue-800">
                      {existingMembershipDetails.entityType || 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-blue-700">Plan:</span>
                    <span className="font-semibold text-blue-800">
                      {formatMembershipPlan(existingMembershipDetails.membershipPlan) || 'Not set'}
                    </span>
                  </div>
                </div>

                {existingMembershipDetails.joinedAt && (
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-700">Member since:</span>
                    <span className="font-semibold text-blue-800">
                      {new Date(existingMembershipDetails.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                <p className="text-blue-800 text-sm">
                  ✏️ <strong>Editing Mode:</strong> Make any changes you need below and click "Update Membership" to save.
                </p>
              </div>
            )}

            {/* Enhanced debug info for editing mode */}
            {isEditing && (
              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs">
                <p className="font-medium text-gray-700">Debug Info:</p>
                <p>Form Selected Entity Type: "{selectedEntityType}" (Type: {typeof selectedEntityType})</p>
                <p>Form Selected Plan: "{selectedPlan}" (Type: {typeof selectedPlan})</p>
                <p>Props Entity Type: "{existingEntityType}" (Type: {typeof existingEntityType})</p>
                <p>Props Plan: "{existingMembershipPlan}" (Type: {typeof existingMembershipPlan})</p>
                <p>Storage Entity Type: "{existingMembershipDetails?.entityType}" (Type: {typeof existingMembershipDetails?.entityType})</p>
                <p>Storage Plan: "{existingMembershipDetails?.membershipPlan}" (Type: {typeof existingMembershipDetails?.membershipPlan})</p>
              </div>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <OrganizationInfoDisplay 
                organizationName={organizationName}
                userId={userId}
              />

              <DebugInfoPanel 
                entityTypes={entityTypes}
                membershipFees={membershipFees}
              />

              <EntityTypeSelector
                entityTypes={entityTypes}
                selectedEntityType={selectedEntityType}
                onEntityTypeChange={setSelectedEntityType}
              />

              <MembershipPlanSelector
                membershipOptions={membershipOptions}
                selectedPlan={selectedPlan}
                onPlanChange={setSelectedPlan}
                selectedEntityType={selectedEntityType}
                membershipFeesLength={membershipFees.length}
              />

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={!selectedEntityType || !selectedPlan || isLoading || membershipFees.length === 0}
                >
                  {isLoading ? 'Processing...' : (isEditing ? 'Update Membership' : 'Submit Registration')}
                </Button>
                <Link to="/seeker-dashboard" state={{ userId, organizationName, isMember: isEditing || false }}>
                  <Button type="button" variant="outline" className="px-8">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeekerMembership;
