
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Crown, Info, Loader2 } from 'lucide-react';
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
  const [activating, setActivating] = useState(false);
  const [showActivationPrompt, setShowActivationPrompt] = useState(false);
  const annualFee = membershipFees.find(fee => fee.annual_amount)?.annual_amount || 0;
  const currency = membershipFees.find(fee => fee.annual_currency)?.annual_currency || 'USD';

  const handleActivateMembership = async () => {
    setActivating(true);
    try {
      // Simulate activation process - in real implementation this would handle payment
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
      
      // Now actually proceed with membership activation
      onStatusChange('active');
      setShowActivationPrompt(false);
      
    } catch (error) {
      console.error('Activation error:', error);
    } finally {
      setActivating(false);
    }
  };

  const handleRadioChange = (value: string) => {
    console.log('Radio changed to:', value);
    
    if (value === 'inactive') {
      // For inactive, proceed immediately without payment
      setShowActivationPrompt(false);
      onStatusChange('inactive');
    } else if (value === 'active') {
      // For active, show the activation prompt but don't change status yet
      setShowActivationPrompt(true);
      // Don't call onStatusChange here - wait for activation confirmation
    }
  };

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
          value={selectedStatus === 'active' || showActivationPrompt ? 'active' : selectedStatus || ''} 
          onValueChange={handleRadioChange}
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
                  <p className="text-xs text-muted-foreground">Annual Fee</p>
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

        {/* Show activation button when Active Member is selected */}
        {showActivationPrompt && (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <Crown className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Ready to activate your membership?</strong>
                <p className="mt-1 text-sm">
                  Annual fee: {formatCurrency(annualFee, currency)} - Your membership will be activated immediately.
                </p>
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleActivateMembership}
                disabled={activating}
                className="flex-1"
                size="lg"
              >
                {activating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Activating Membership...
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Activate Membership ({formatCurrency(annualFee, currency)})
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  setShowActivationPrompt(false);
                  // Reset to no selection
                }}
                disabled={activating}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Promotional Message for Non-Active Selection */}
        {selectedStatus === 'inactive' && !showActivationPrompt && (
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
