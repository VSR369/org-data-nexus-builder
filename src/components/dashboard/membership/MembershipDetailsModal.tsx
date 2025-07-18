import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Shield, Star, Zap, Users, Clock, CreditCard } from 'lucide-react';

interface MembershipDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  membershipStatus: 'active' | 'inactive' | null;
  selectedTier: string | null;
  selectedEngagementModel: string | null;
  membershipFees: any[];
  profile: any;
}

export const MembershipDetailsModal: React.FC<MembershipDetailsModalProps> = ({
  isOpen,
  onClose,
  membershipStatus,
  selectedTier,
  selectedEngagementModel,
  membershipFees,
  profile
}) => {
  const getTierFeatures = (tier: string) => {
    const features = {
      basic: ['Up to 5 challenges', 'Basic support', 'Standard analytics'],
      standard: ['Up to 15 challenges', 'Priority support', 'Advanced analytics', 'Custom workflows'],
      premium: ['Unlimited challenges', '24/7 support', 'Premium analytics', 'Advanced workflows', 'API access']
    };
    return features[tier as keyof typeof features] || [];
  };

  const getEngagementModelFeatures = (model: string) => {
    const features = {
      'Market Place General': ['General marketplace access', 'Standard pricing', 'Basic features'],
      'Aggregator': ['Aggregated solutions', 'Bulk pricing', 'Enterprise features'],
      'Custom Advisory': ['Personalized advisory', 'Custom pricing', 'Premium support'],
      'Consulting': ['Full consulting services', 'Project-based pricing', 'Dedicated consultant']
    };
    return features[model as keyof typeof features] || [];
  };

  const membershipFee = membershipFees?.[0];
  const currency = membershipFee?.annual_currency || 'USD';
  const annualFee = membershipFee?.annual_amount || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Membership Details Overview
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Membership Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Membership Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={membershipStatus === 'active' ? 'default' : 'secondary'}>
                      {membershipStatus === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                    {membershipStatus === 'active' && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {membershipStatus === 'active' 
                      ? 'You have access to all premium features and benefits.'
                      : 'You can activate membership anytime to access premium features.'
                    }
                  </p>
                </div>
                {membershipStatus === 'active' && membershipFee && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Annual Fee</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {currency} {annualFee}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Includes all premium features and support
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Tier Card */}
          {selectedTier && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Pricing Tier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="capitalize">
                        {selectedTier}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your selected pricing tier determines your platform capabilities.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Features Included:</h4>
                      <ul className="space-y-1">
                        {getTierFeatures(selectedTier).map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Billing Information</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Organization: {profile?.organization || 'N/A'}</p>
                      <p>Country: {profile?.country || 'N/A'}</p>
                      <p>Organization Type: {profile?.organization_type || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Engagement Model Card */}
          {selectedEngagementModel && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  Engagement Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-purple-50">
                        {selectedEngagementModel}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your engagement model defines how you interact with the platform.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Model Features:</h4>
                      <ul className="space-y-1">
                        {getEngagementModelFeatures(selectedEngagementModel).map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-purple-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Pricing Benefits</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {membershipStatus === 'active' ? (
                        <>
                          <p className="text-green-600 font-medium">✓ Member Discount Applied</p>
                          <p>You receive discounted pricing on all services</p>
                        </>
                      ) : (
                        <>
                          <p className="text-amber-600 font-medium">Base Pricing</p>
                          <p>Activate membership for discounted rates</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-lg">Quick Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="font-medium text-sm text-muted-foreground">Membership</div>
                  <div className="text-lg font-bold">
                    {membershipStatus === 'active' ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="font-medium text-sm text-muted-foreground">Tier</div>
                  <div className="text-lg font-bold capitalize">
                    {selectedTier || 'Not Selected'}
                  </div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="font-medium text-sm text-muted-foreground">Model</div>
                  <div className="text-lg font-bold">
                    {selectedEngagementModel || 'Not Selected'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};