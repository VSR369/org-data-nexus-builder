import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, CreditCard, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMembershipData } from "@/hooks/useMembershipData";

interface OrganizationData {
  country?: string;
  organization_type?: string;
  entity_type?: string;
  [key: string]: any;
}

interface SimpleMembershipUpgradeProps {
  userId: string;
  organizationData?: OrganizationData;
  onPaymentSuccess?: () => void;
}

const SimpleMembershipUpgrade: React.FC<SimpleMembershipUpgradeProps> = ({ 
  userId, 
  organizationData, 
  onPaymentSuccess 
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Extract organization context for membership data lookup
  const country = organizationData?.country;
  const organizationType = organizationData?.organization_type;
  const entityType = organizationData?.entity_type;

  // Fetch membership data from master data
  const { countryPricing, loading: membershipLoading, error: membershipError } = useMembershipData(
    entityType,
    country,
    organizationType
  );

  // Determine annual fee from master data
  const getAnnualFee = () => {
    if (countryPricing && countryPricing.annualPrice > 0) {
      return {
        amount: countryPricing.annualPrice,
        currency: countryPricing.currency || 'USD',
        description: 'Annual Premium Membership (Save 20%)'
      };
    }
    
    // Fallback if no configuration found
    return {
      amount: 0,
      currency: 'USD',
      description: 'Annual Premium Membership'
    };
  };

  const annualFee = getAnnualFee();

  const handleActivateMembership = async () => {
    if (annualFee.amount === 0) {
      toast({
        title: "Configuration Error",
        description: "No membership fee configured for your organization type. Please contact support.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Generate receipt number
      const receiptNumber = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // Update engagement_activations table with payment details
      const { error } = await supabase
        .from('engagement_activations')
        .upsert({
          user_id: userId,
          membership_status: 'Active',
          membership_type: 'premium',
          mem_payment_status: 'paid',
          mem_payment_amount: annualFee.amount,
          mem_payment_currency: annualFee.currency,
          mem_payment_method: 'direct_activation',
          mem_payment_date: new Date().toISOString(),
          mem_receipt_number: receiptNumber,
          selected_frequency: 'annual',
          mem_terms: true,
          total_payments_made: annualFee.amount,
          workflow_step: 'activation_complete',
          workflow_completed: true,
          activation_status: 'Activated',
          payment_simulation_status: 'success',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Membership activation error:', error);
        toast({
          title: "Activation Failed",
          description: "There was an error activating your membership. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Membership Activated!",
        description: `Your annual membership has been activated. Receipt: ${receiptNumber}`,
      });

      // Call success callback to refresh parent component
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }

    } catch (error) {
      console.error('Membership activation error:', error);
      toast({
        title: "Activation Failed",
        description: "There was an unexpected error. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading state while fetching membership data
  if (membershipLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading membership configuration...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state if membership data failed to load
  if (membershipError) {
    return (
      <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Configuration Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {membershipError}
            </p>
            <p className="text-sm text-muted-foreground">
              Please ensure your organization profile is complete or contact support for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
      {/* Membership Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Membership Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Current Status</span>
            <Badge variant="destructive">
              Inactive Member
            </Badge>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Upgrade to Premium Membership</strong> to unlock:
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• Access to premium engagement models</li>
              <li>• Priority support</li>
              <li>• Advanced analytics</li>
              <li>• Exclusive member benefits</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Activation Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Activate Premium Membership
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Annual Fee Display */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Annual Membership Fee:</span>
              <span className="text-2xl font-bold text-green-600">
                {annualFee.amount > 0 
                  ? `${annualFee.currency} ${annualFee.amount.toLocaleString()}`
                  : 'Not Configured'
                }
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              {annualFee.description}
            </p>
            {organizationType && entityType && country && (
              <p className="text-xs text-muted-foreground mt-2">
                Configuration: {organizationType} • {entityType} • {country}
              </p>
            )}
          </div>

          {/* Activation Button */}
          <Button 
            onClick={handleActivateMembership}
            className="w-full" 
            disabled={isProcessing || annualFee.amount === 0}
            size="lg"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Activating Membership...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                {annualFee.amount > 0 ? 'Activate Membership' : 'Configuration Required'}
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By activating, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleMembershipUpgrade;
