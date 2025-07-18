
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Edit, Star } from 'lucide-react';

interface SelectedTierSummaryCardProps {
  selectedTier: string | null;
  onEditTier: () => void;
}

export const SelectedTierSummaryCard: React.FC<SelectedTierSummaryCardProps> = ({
  selectedTier,
  onEditTier
}) => {
  if (!selectedTier) {
    return null;
  }

  const getTierIcon = () => {
    switch (selectedTier.toLowerCase()) {
      case 'basic': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'premium': return <Star className="h-5 w-5 text-purple-600" />;
      default: return <Star className="h-5 w-5 text-blue-600" />; // Standard or other tiers
    }
  };

  const getTierColor = () => {
    switch (selectedTier.toLowerCase()) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800'; // Standard or other tiers
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {getTierIcon()}
          Selected Pricing Tier
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={getTierColor()}>
              {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Tier
            </Badge>
            <p className="text-sm text-muted-foreground">
              You can change your tier at any time
            </p>
          </div>
          <Button 
            onClick={onEditTier}
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            Change
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
