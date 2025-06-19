
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { MembershipService } from '@/services/MembershipService';
import { useToast } from "@/hooks/use-toast";

interface MembershipJoinCardProps {
  userId: string;
  membershipStatus: 'active' | 'inactive';
  onMembershipChange: (status: 'active' | 'inactive') => void;
}

const MembershipJoinCard: React.FC<MembershipJoinCardProps> = ({
  userId,
  membershipStatus,
  onMembershipChange
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleJoinMembership = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const membershipPricing = {
        currency: 'USD',
        amount: 100,
        frequency: 'quarterly'
      };
      
      const success = MembershipService.activateMembership(userId, 'Premium', membershipPricing);
      
      if (success) {
        onMembershipChange('active');
        toast({
          title: "Membership Activated!",
          description: "Welcome to our premium membership. You now have access to discounted pricing.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to activate membership. Please try again.",
          variant: "destructive"
        });
      }
      
      setIsProcessing(false);
    }, 2000);
  };

  if (membershipStatus === 'active') {
    return (
      <Card className="shadow-lg border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Membership Active
            <Badge variant="default" className="bg-green-600">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-800">
            Your premium membership is active. Enjoy discounted pricing on all engagement models!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-blue-600" />
          Join as Member
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600">
            Become a premium member to unlock discounted pricing and exclusive benefits.
          </p>
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Membership Benefits:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 20% discount on all engagement models</li>
              <li>• Priority support</li>
              <li>• Exclusive member features</li>
            </ul>
          </div>
          <Button 
            onClick={handleJoinMembership}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Join Now - $100/quarter
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipJoinCard;
