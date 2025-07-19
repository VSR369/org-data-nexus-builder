
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Crown, Info } from 'lucide-react';
import { formatCurrency } from '@/utils/formatting';

interface MembershipStatusSelectionCardProps {
  membershipFees: any[];
  selectedStatus: 'active' | 'inactive' | null;
  onStatusChange: (status: 'active' | 'inactive') => void;
  profile: any;
}

export const MembershipStatusSelectionCard: React.FC<MembershipStatusSelectionCardProps> = ({
  membershipFees,
  selectedStatus,
  onStatusChange,
  profile
}) => {
  const annualFee = membershipFees.find(fee => fee.annual_amount)?.annual_amount || 0;
  const currency = membershipFees.find(fee => fee.annual_currency)?.annual_currency || 'USD';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          Choose Your Membership Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup 
          value={selectedStatus || ''} 
          onValueChange={(value) => onStatusChange(value as 'active' | 'inactive')}
        >
          {/* Active Member Option */}
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="active" id="active" />
            <Label htmlFor="active" className="flex-1 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Active Member</span>
                    <Badge variant="default" className="text-xs">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Unlock exclusive benefits and discounts
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-bold text-lg">
                      {formatCurrency(annualFee, currency)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Annual Fee (Auto-activated)</p>
                </div>
              </div>
            </Label>
          </div>

          {/* Non-Active Member Option */}
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="inactive" id="inactive" />
            <Label htmlFor="inactive" className="flex-1 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Non-Active Member</span>
                    <Badge variant="secondary" className="text-xs">Free</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Basic access with standard rates
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg text-muted-foreground">₹0</span>
                  <p className="text-xs text-muted-foreground">No membership fee</p>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {/* Promotional Message for Non-Active Selection */}
        {selectedStatus === 'inactive' && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>With membership you avail discounts and many benefits, please explore</strong>
              <ul className="mt-2 ml-4 list-disc text-sm space-y-1">
                <li>Exclusive platform fee discounts</li>
                <li>Priority customer support</li>
                <li>Early access to new features</li>
                <li>Advanced analytics and reporting</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Simple activation message for Active selection */}
        {selectedStatus === 'active' && (
          <Alert className="bg-green-50 border-green-200">
            <Crown className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Membership will be automatically activated!</strong>
              <p className="mt-1 text-sm">
                Your membership will be activated and marked as paid when you proceed. 
                You'll immediately access all member benefits and discounts.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Organization Context Info */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <Info className="h-3 w-3 inline mr-1" />
            Pricing customized for: {profile?.organization_type} • {profile?.entity_type} • {profile?.country}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
