
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import OrganizationInfoDisplay from '@/components/seeker-membership/OrganizationInfoDisplay';
import DebugInfoPanel from '@/components/seeker-membership/DebugInfoPanel';
import EntityTypeSelector from '@/components/seeker-membership/EntityTypeSelector';
import MembershipPlanSelector from '@/components/seeker-membership/MembershipPlanSelector';
import { useMembershipForm } from '@/components/seeker-membership/hooks/useMembershipForm';

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
  } = location.state as SeekerMembershipProps & { 
    isEditing?: boolean;
    existingEntityType?: string;
    existingMembershipPlan?: string;
  } || {};

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-xl border-0">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Link to="/seeker-dashboard" state={{ userId, organizationName, isMember: false }}>
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
                <Link to="/seeker-dashboard" state={{ userId, organizationName, isMember: false }}>
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
