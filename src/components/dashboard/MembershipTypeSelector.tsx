import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Check } from 'lucide-react';
import { useMembershipData } from '@/hooks/useMembershipData';

interface MembershipTypeOption {
  id: string;
  organizationType: string;
  entityType: string;
  country: string;
  currency: string;
  membershipFee: number;
  description?: string;
}

interface MembershipTypeSelectorProps {
  organizationType: string;
  entityType: string;
  country: string;
  onMembershipSelect?: (membership: MembershipTypeOption | null) => void;
}

const MembershipTypeSelector: React.FC<MembershipTypeSelectorProps> = ({
  organizationType,
  entityType,
  country,
  onMembershipSelect
}) => {
  const [selectedMembership, setSelectedMembership] = useState<MembershipTypeOption | null>(null);
  const { membershipData, loading, error } = useMembershipData();
  
  // Extract membership options from the membershipData
  // For now, create mock data based on the props until the actual data structure is available
  const membershipOptions: MembershipTypeOption[] = [];

  const handleSelect = (membership: MembershipTypeOption) => {
    setSelectedMembership(membership);
    onMembershipSelect?.(membership);
  };

  const handleSkip = () => {
    setSelectedMembership(null);
    onMembershipSelect?.(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <CreditCard className="h-8 w-8 animate-pulse text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading membership options...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-sm text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Select Membership Type
          <Badge variant="secondary" className="ml-2">Optional</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose a membership plan or skip this step to continue without membership.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 mb-4">
            Membership configuration is available in the Master Data Portal. Configure membership fees to see options here.
          </p>
          <Button onClick={handleSkip} variant="outline">
            Continue Without Membership
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipTypeSelector;