
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Settings, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { DataSynchronizationService } from '@/services/DataSynchronizationService';

interface TierEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: string | null;
  countryName: string;
  onTierChange: (tier: string) => void;
}

export const TierEditModal: React.FC<TierEditModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  countryName,
  onTierChange
}) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(currentTier);
  const [availableTiers, setAvailableTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAvailableTiers();
      setSelectedTier(currentTier);
    }
  }, [isOpen, currentTier]);

  const loadAvailableTiers = async () => {
    try {
      setLoading(true);
      console.log('🏷️ Loading available tiers for country:', countryName);
      
      // Get country ID using case-insensitive matching
      const { data: countryData } = await supabase
        .from('master_countries')
        .select('id')
        .ilike('name', countryName)
        .single();

      if (!countryData) {
        console.error('❌ Country not found:', countryName);
        return;
      }

      // Get tier configurations with case-insensitive ordering
      const { data: tierConfigs } = await supabase
        .from('master_tier_configurations')
        .select(`
          *,
          master_pricing_tiers (
            name,
            level_order,
            description
          ),
          master_analytics_access_types (
            name
          ),
          master_support_types (
            name,
            response_time
          ),
          master_currencies (
            code,
            symbol
          )
        `)
        .eq('country_id', countryData.id)
        .eq('is_active', true)
        .order('master_pricing_tiers(level_order)');

      console.log('✅ Loaded tier configurations:', tierConfigs?.length || 0);
      setAvailableTiers(tierConfigs || []);
    } catch (error) {
      console.error('❌ Error loading tiers:', error);
      toast({
        title: "Error",
        description: "Failed to load available tiers.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedTier && selectedTier !== currentTier) {
      console.log('🔄 Confirming tier change:', currentTier, '->', selectedTier);
      onTierChange(selectedTier);
      onClose();
    } else {
      onClose();
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    // Handle null, undefined, or empty currency codes
    const validCurrency = currency && currency.trim() !== '' ? currency : 'USD';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Case-insensitive tier comparison
  const isTierSelected = (tierName: string) => {
    return DataSynchronizationService.normalizeName(tierName) === DataSynchronizationService.normalizeName(selectedTier || '');
  };

  const isTierCurrent = (tierName: string) => {
    return DataSynchronizationService.normalizeName(tierName) === DataSynchronizationService.normalizeName(currentTier || '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Change Pricing Tier
          </DialogTitle>
          <DialogDescription>
            Select a new pricing tier. Your current tier is <strong>{currentTier}</strong>.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableTiers.map((tierConfig) => {
                const tierName = tierConfig.master_pricing_tiers?.name;
                const isSelected = isTierSelected(tierName);
                const isCurrent = isTierCurrent(tierName);
                
                return (
                  <Card 
                    key={tierConfig.id}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTier(tierName)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{tierName}</span>
                        <div className="flex items-center gap-2">
                          {isCurrent && (
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                              Current
                            </Badge>
                          )}
                          {isSelected && (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </CardTitle>
                      <CardDescription>
                        {tierConfig.master_pricing_tiers?.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Monthly Challenges:</span>
                          <span className="font-medium">
                            {tierConfig.monthly_challenge_limit || 'Unlimited'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Fixed Charge:</span>
                          <span className="font-medium">
                            {formatCurrency(tierConfig.fixed_charge_per_challenge || 0, tierConfig.master_currencies?.code || 'USD')}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Solutions per Challenge:</span>
                          <span className="font-medium">
                            {tierConfig.solutions_per_challenge || 1}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Overage Allowed:</span>
                          <Badge variant={tierConfig.allows_overage ? "default" : "secondary"}>
                            {tierConfig.allows_overage ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                      </div>
                      
                      {tierConfig.master_analytics_access_types && (
                        <div className="pt-2 border-t">
                          <p className="text-sm text-gray-600">
                            Analytics: {tierConfig.master_analytics_access_types.name}
                          </p>
                        </div>
                      )}
                      
                      {tierConfig.master_support_types && (
                        <div className="text-sm text-gray-600">
                          Support: {tierConfig.master_support_types.name} ({tierConfig.master_support_types.response_time})
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm}
                disabled={!selectedTier || isTierCurrent(selectedTier)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Change
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
