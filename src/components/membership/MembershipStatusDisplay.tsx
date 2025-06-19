
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from 'lucide-react';

interface MembershipStatusDisplayProps {
  status: 'active' | 'inactive';
}

const MembershipStatusDisplay: React.FC<MembershipStatusDisplayProps> = ({ status }) => {
  if (status !== 'active') return null;

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
};

export default MembershipStatusDisplay;
