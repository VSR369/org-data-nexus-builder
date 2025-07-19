
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SimpleMembershipUpgradeProps {
  userId: string;
  organizationData?: any;
  onPaymentSuccess?: () => void;
}

const SimpleMembershipUpgrade: React.FC<SimpleMembershipUpgradeProps> = ({ 
  userId, 
  organizationData, 
  onPaymentSuccess 
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fixed annual fee - this could be made dynamic based on organization data
  const annualFee = {
    amount: 948,
    currency: 'USD',
    description: 'Annual Premium Membership (Save 20%)'
  };

  const handleActivateMembership = async () => {
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
          payment_simulation_status: 'completed',
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
                {annualFee.currency} {annualFee.amount}
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              {annualFee.description}
            </p>
          </div>

          {/* Activation Button */}
          <Button 
            onClick={handleActivateMembership}
            className="w-full" 
            disabled={isProcessing}
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
                Activate Membership
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
