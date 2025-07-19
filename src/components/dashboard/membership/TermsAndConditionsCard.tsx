
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FileText, Shield, Info } from 'lucide-react';

interface TermsAndConditionsCardProps {
  membershipTermsAccepted: boolean;
  engagementTermsAccepted: boolean;
  onMembershipTermsChange: (accepted: boolean) => void;
  onEngagementTermsChange: (accepted: boolean) => void;
  selectedMembershipStatus: 'active' | 'inactive' | null;
  selectedEngagementModel: string | null;
  showMembershipTerms: boolean;
  showEngagementTerms: boolean;
}

export const TermsAndConditionsCard: React.FC<TermsAndConditionsCardProps> = ({
  membershipTermsAccepted,
  engagementTermsAccepted,
  onMembershipTermsChange,
  onEngagementTermsChange,
  selectedMembershipStatus,
  selectedEngagementModel,
  showMembershipTerms,
  showEngagementTerms
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Terms & Conditions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration Summary */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Your Configuration Summary
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span>Membership Status:</span>
              <Badge variant={selectedMembershipStatus === 'active' ? "default" : "outline"}>
                {selectedMembershipStatus === 'active' ? 'Active Member' : 'Non-Member'}
              </Badge>
            </div>
            {selectedEngagementModel && (
              <div className="flex justify-between items-center">
                <span>Engagement Model:</span>
                <Badge variant="secondary">{selectedEngagementModel}</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Terms Acceptance */}
        <div className="space-y-4">
          {showMembershipTerms && (
            <div className="border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="membership-terms"
                  checked={membershipTermsAccepted}
                  onCheckedChange={onMembershipTermsChange}
                />
                <div className="flex-1">
                  <label htmlFor="membership-terms" className="text-sm font-medium cursor-pointer">
                    I accept the Membership Terms & Conditions
                  </label>
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-3 w-3" />
                      <span className="font-medium">Membership Agreement Highlights:</span>
                    </div>
                    <ul className="space-y-1 ml-5 list-disc">
                      <li>Annual membership fee is non-refundable after 30 days</li>
                      <li>Access to exclusive member pricing and benefits</li>
                      <li>Priority customer support and early feature access</li>
                      <li>Automatic renewal unless cancelled 30 days before expiry</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showEngagementTerms && (
            <div className="border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="engagement-terms"
                  checked={engagementTermsAccepted}
                  onCheckedChange={onEngagementTermsChange}
                />
                <div className="flex-1">
                  <label htmlFor="engagement-terms" className="text-sm font-medium cursor-pointer">
                    I accept the {selectedEngagementModel} Engagement Model Terms
                  </label>
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-3 w-3" />
                      <span className="font-medium">Engagement Model Terms:</span>
                    </div>
                    <ul className="space-y-1 ml-5 list-disc">
                      <li>Platform fees apply as per selected model pricing</li>
                      <li>Payment terms: Advance payment required for challenge activation</li>
                      <li>Intellectual property rights as per platform policy</li>
                      <li>Service level agreements based on selected tier</li>
                      {selectedEngagementModel === 'Marketplace' && (
                        <li>Additional marketplace-specific terms and solution provider agreements</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="text-center text-sm text-muted-foreground">
          {(showMembershipTerms && !membershipTermsAccepted) || (showEngagementTerms && !engagementTermsAccepted) ? (
            <p>Please accept the required terms to proceed with activation</p>
          ) : (
            <p className="text-green-600 font-medium">✓ All required terms accepted</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
