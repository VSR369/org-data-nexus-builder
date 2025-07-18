
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight, DollarSign, CheckCircle, Edit, Target, Zap, Lock } from 'lucide-react';
import { TierEditModal } from './TierEditModal';
import { EngagementModelEditModal } from './EngagementModelEditModal';
import { MembershipDataService } from '@/services/MembershipDataService';

interface MembershipSummaryOnlyCardProps {
  membershipStatus: 'active' | 'inactive' | null;
  membershipFees: any[];
  onProceedToTierSelection: () => void;
  currency: string;
  onActivateMembership?: () => void;
  selectedTier?: string | null;
  selectedEngagementModel?: string | null;
  onReviewAndFinalize?: () => void;
  onChangeSelections?: () => void;
  profile?: any;
  onTierChange?: (tier: string) => void;
  onEngagementModelChange?: (model: string) => void;
}

export const MembershipSummaryOnlyCard: React.FC<MembershipSummaryOnlyCardProps> = ({
  membershipStatus,
  membershipFees,
  onProceedToTierSelection,
  currency,
  onActivateMembership,
  selectedTier,
  selectedEngagementModel,
  onReviewAndFinalize,
  onChangeSelections,
  profile,
  onTierChange,
  onEngagementModelChange
}) => {
  const [showTierEditModal, setShowTierEditModal] = useState(false);
  const [showModelEditModal, setShowModelEditModal] = useState(false);
  const [realMembershipFees, setRealMembershipFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadRealMembershipFees();
    }
  }, [profile]);

  const loadRealMembershipFees = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading real membership fees for:', {
        country: profile.country,
        organizationType: profile.organization_type,
        entityType: profile.entity_type
      });

      const fees = await MembershipDataService.getMembershipFees(
        profile.country,
        profile.organization_type,
        profile.entity_type
      );

      console.log('✅ Loaded real membership fees:', fees);
      setRealMembershipFees(fees);
    } catch (error) {
      console.error('❌ Error loading membership fees:', error);
      // Fallback to provided membershipFees
      setRealMembershipFees(membershipFees);
    } finally {
      setLoading(false);
    }
  };

  // Use real fees if available, otherwise fallback to provided fees
  const feesToUse = realMembershipFees.length > 0 ? realMembershipFees : membershipFees;
  const fee = feesToUse?.[0] || { annual_amount: 0, annual_currency: currency };
  const actualCurrency = fee.annual_currency || currency;
  const actualAmount = fee.annual_amount || 0;

  const handleTierEdit = () => {
    setShowTierEditModal(true);
  };

  const handleEngagementModelEdit = () => {
    setShowModelEditModal(true);
  };

  const handleTierSelect = (newTier: string) => {
    console.log('🏷️ Tier changed to:', newTier);
    if (onTierChange) {
      onTierChange(newTier);
    }
    setShowTierEditModal(false);
  };

  const handleModelSelect = (newModel: string) => {
    console.log('🤝 Engagement model changed to:', newModel);
    if (onEngagementModelChange) {
      onEngagementModelChange(newModel);
    }
    setShowModelEditModal(false);
  };

  // Determine button text and action based on current selections
  const getButtonConfig = () => {
    if (!selectedTier) {
      return {
        text: "Continue to Pricing Tier Selection",
        action: onProceedToTierSelection
      };
    }
    
    if (selectedTier && !selectedEngagementModel) {
      return {
        text: "Continue to Engagement Model Selection",
        action: onProceedToTierSelection
      };
    }
    
    // Both tier and engagement model are selected - show review options
    return null;
  };

  const buttonConfig = getButtonConfig();
  
  return (
    <>
      <Card className={membershipStatus === 'active' ? 'border-green-200 bg-green-50' : 'border-gray-200'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Membership Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {membershipStatus === 'active' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-green-600">Active Member</Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    You are enjoying member benefits including discounts on engagement models
                  </p>
                </div>
                <div className="text-right">
                  <span className="block text-sm text-gray-500">Annual Membership Fee</span>
                  <span className="text-lg font-bold">{actualCurrency} {actualAmount}</span>
                </div>
              </div>

              {/* Current Selections Display with Edit Options */}
              <div className="space-y-3">
                {selectedTier && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Pricing Tier: {selectedTier}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTierEdit}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                )}

                {selectedEngagementModel && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Engagement Model: {selectedEngagementModel}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEngagementModelEdit}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                )}

                {/* Membership Status - LOCKED for active members */}
                <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Membership: Active</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-700">
                    <Lock className="h-3 w-3" />
                    <span className="text-xs">Locked</span>
                  </div>
                </div>
              </div>

              {/* Show Review Card if both tier and engagement model are selected */}
              {selectedTier && selectedEngagementModel && onReviewAndFinalize && (
                <div className="space-y-4">
                  <div className="p-4 border border-blue-200 bg-blue-50 rounded-md">
                    <h4 className="text-sm font-medium text-blue-800 mb-3">Your Selections Are Ready</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Pricing Tier: {selectedTier}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Engagement Model: {selectedEngagementModel}</span>
                      </div>
                    </div>
                    <p className="text-sm text-blue-700 mt-2">
                      Your pricing tier and engagement model are ready for activation.
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={onReviewAndFinalize}
                      className="flex-1"
                    >
                      Review & Finalize
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Show navigation button if selections are not complete */}
              {buttonConfig && (
                <Button onClick={buttonConfig.action} className="w-full">
                  {buttonConfig.text}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="border-gray-300">Not a Member</Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    You're currently not a member. Membership provides discounted pricing.
                  </p>
                </div>
              </div>

              {/* Current Selections Display with Edit Options */}
              <div className="space-y-3">
                {selectedTier && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Pricing Tier: {selectedTier}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTierEdit}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                )}

                {selectedEngagementModel && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Engagement Model: {selectedEngagementModel}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEngagementModelEdit}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                )}

                {/* Membership Status - EDITABLE for inactive members */}
                {onActivateMembership && (
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">Membership: Inactive</span>
                    </div>
                    <Button 
                      onClick={onActivateMembership}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <DollarSign className="h-3 w-3" />
                      Activate
                    </Button>
                  </div>
                )}
              </div>

              {/* Show member benefits */}
              <div className="p-4 border border-orange-200 bg-orange-50 rounded-md">
                <h4 className="text-sm font-medium text-orange-800">Member Benefits:</h4>
                <ul className="text-sm text-orange-700 mt-2 space-y-1 list-disc pl-5">
                  <li>Save up to 20% on engagement model fees</li>
                  <li>Priority support and faster turnaround times</li>
                  <li>Access to exclusive member resources</li>
                </ul>
              </div>

              {/* Show Review Card for non-members with edit options */}
              {selectedTier && selectedEngagementModel && onReviewAndFinalize && (
                <div className="space-y-4">
                  <div className="p-4 border border-blue-200 bg-blue-50 rounded-md">
                    <h4 className="text-sm font-medium text-blue-800 mb-3">Your Selections Are Ready</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Pricing Tier: {selectedTier}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Engagement Model: {selectedEngagementModel}</span>
                      </div>
                    </div>
                    <p className="text-sm text-blue-700 mt-2">
                      Your pricing tier and engagement model are ready. Consider becoming a member to save on fees, or review your selections.
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={onReviewAndFinalize}
                      className="flex-1"
                    >
                      Review & Finalize
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    {onChangeSelections && (
                      <Button 
                        onClick={onChangeSelections}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Change Selections
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Show navigation button if selections are not complete */}
              {buttonConfig && (
                <Button onClick={buttonConfig.action} className="w-full">
                  {buttonConfig.text}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modals */}
      <TierEditModal
        isOpen={showTierEditModal}
        onClose={() => setShowTierEditModal(false)}
        currentTier={selectedTier}
        onTierChange={handleTierSelect}
        countryName={profile?.country || 'India'}
      />

      <EngagementModelEditModal
        isOpen={showModelEditModal}
        onClose={() => setShowModelEditModal(false)}
        currentModel={selectedEngagementModel}
        onModelChange={handleModelSelect}
        selectedTier={selectedTier}
        userId={profile?.id || ''}
        membershipStatus="active"
        profile={profile}
      />
    </>
  );
};
