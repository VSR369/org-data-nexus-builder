
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from 'lucide-react';

interface MembershipActionSectionProps {
  disabled: boolean;
}

export const MembershipActionSection = ({ disabled }: MembershipActionSectionProps) => {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
      <div className="bg-blue-50 rounded-lg p-6">
        <p className="text-sm text-gray-600 mb-4">
          Complete your membership registration to unlock premium features and enhanced access to our platform.
        </p>
        <Button 
          className="w-full" 
          size="lg"
          disabled={disabled}
        >
          <CreditCard className="h-5 w-5 mr-2" />
          Proceed with Membership Registration
        </Button>
      </div>
    </div>
  );
};
