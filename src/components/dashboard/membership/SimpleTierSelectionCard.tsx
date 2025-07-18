
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2, Target } from 'lucide-react';
import { MembershipDataService } from '@/services/MembershipDataService';
import { toast } from '@/hooks/use-toast';

interface SimpleTierSelectionCardProps {
  selectedTier: string | null;
  onTierSelect: (tier: string) => void;
  countryName?: string;
}

export const SimpleTierSelectionCard: React.FC<SimpleTierSelectionCardProps> = ({
  selectedTier,
  onTierSelect,
  countryName = 'India'
}) => {
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTiers();
  }, [countryName]);

  const loadTiers = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading real pricing tiers from database');
      
      const tiersData = await MembershipDataService.getAvailableTiers();
      console.log('✅ Loaded tiers from database:', tiersData);
      
      setTiers(tiersData);
    } catch (error) {
      console.error('❌ Error loading tiers:', error);
      toast({
        title: "Error Loading Tiers",
        description: "Failed to load pricing tiers. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTierSelect = (tierName: string) => {
    console.log('🎯 Tier selected in SimpleTierSelectionCard:', tierName);
    onTierSelect(tierName);
  };

  const normalizeForComparison = (name: string) => {
    return name?.toLowerCase().trim() || '';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Select Your Pricing Tier
          </CardTitle>
          <CardDescription>
            Choose the tier that best fits your organization's needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading pricing tiers...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Select Your Pricing Tier
        </CardTitle>
        <CardDescription>
          Choose the tier that best fits your organization's needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tiers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pricing tiers available for {countryName}. Please contact support.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiers.map((tier) => {
              const isSelected = normalizeForComparison(selectedTier) === normalizeForComparison(tier.name);
              
              return (
                <Card 
                  key={tier.id}
                  className={`cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => handleTierSelect(tier.name)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{tier.name}</CardTitle>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    {tier.level_order && (
                      <Badge variant="outline" className="w-fit">
                        Level {tier.level_order}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {tier.description || `${tier.name} tier with comprehensive features`}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500">
                        Features and pricing will be shown after selection
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        {selectedTier && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {selectedTier} tier selected
              </span>
            </div>
            <p className="text-sm text-blue-700">
              Proceed to select your engagement model to see detailed pricing.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
