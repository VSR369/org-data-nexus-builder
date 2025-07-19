
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, X, AlertTriangle, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface TierEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: string | null;
  userId: string;
  membershipStatus: string;
  profileContext: any;
  onTierChange: (tier: string) => void;
}

export const TierEditModal: React.FC<TierEditModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  userId,
  membershipStatus,
  profileContext,
  onTierChange
}) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(currentTier);
  const [tierConfigurations, setTierConfigurations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && profileContext) {
      console.log('🎯 TierEditModal opened with:', { 
        currentTier, 
        profileContext,
        country: profileContext.country,
        organizationType: profileContext.organization_type,
        entityType: profileContext.entity_type
      });
      loadAvailableTiers();
      setSelectedTier(currentTier);
    }
  }, [isOpen, currentTier, profileContext]);

  const loadAvailableTiers = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading tiers for profile context:', profileContext);

      // Use comprehensive profile context with fallbacks
      const searchCountry = profileContext?.country || 'India';
      
      console.log('🔍 Searching for country:', searchCountry);

      // Get country ID with case-insensitive matching
      const { data: countryData, error: countryError } = await supabase
        .from('master_countries')
        .select('id, name')
        .ilike('name', searchCountry)
        .single();

      if (countryError || !countryData) {
        console.error('❌ Country not found:', searchCountry, countryError);
        
        // Try fallback to first available country
        const { data: fallbackCountry } = await supabase
          .from('master_countries')
          .select('id, name')
          .limit(1)
          .single();
        
        if (fallbackCountry) {
          console.log('🔄 Using fallback country:', fallbackCountry.name);
        } else {
          toast({
            title: "Error",
            description: "No countries found in the system.",
            variant: "destructive"
          });
          return;
        }
      }

      const countryToUse = countryData || { id: null, name: searchCountry };
      console.log('✅ Using country:', countryToUse);

      // Load tier configurations with enhanced query
      const { data: tierConfigs, error: tierError } = await supabase
        .from('master_tier_configurations')
        .select(`
          *,
          master_pricing_tiers!inner(
            id,
            name,
            level_order,
            description
          ),
          master_currencies(
            code,
            symbol
          )
        `)
        .eq('country_id', countryToUse.id)
        .eq('is_active', true)
        .order('master_pricing_tiers(level_order)');

      if (tierError) {
        console.error('❌ Error loading tier configurations:', tierError);
        
        // Fallback: load all tier configurations if country-specific fails
        const { data: allTierConfigs } = await supabase
          .from('master_tier_configurations')
          .select(`
            *,
            master_pricing_tiers!inner(
              id,
              name,
              level_order,
              description
            ),
            master_currencies(
              code,
              symbol
            )
          `)
          .eq('is_active', true)
          .order('master_pricing_tiers(level_order)')
          .limit(10);
        
        if (allTierConfigs && allTierConfigs.length > 0) {
          console.log('🔄 Using fallback tier configurations:', allTierConfigs.length);
          setTierConfigurations(allTierConfigs);
        } else {
          toast({
            title: "Error",
            description: "No tier configurations found.",
            variant: "destructive"
          });
        }
        return;
      }

      console.log('✅ Loaded tier configurations:', tierConfigs?.length, tierConfigs);
      setTierConfigurations(tierConfigs || []);

      // Validate and pre-select current tier
      if (currentTier && tierConfigs) {
        const currentTierExists = tierConfigs.some(config => 
          config.master_pricing_tiers?.name?.toLowerCase() === currentTier.toLowerCase()
        );
        
        if (!currentTierExists) {
          console.log('⚠️ Current tier not found in available tiers, clearing selection');
          setSelectedTier(null);
        } else {
          console.log('✅ Current tier validated and pre-selected:', currentTier);
          setSelectedTier(currentTier);
        }
      }

    } catch (error) {
      console.error('❌ Error in loadAvailableTiers:', error);
      toast({
        title: "Error",
        description: "Failed to load available tiers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedTier && selectedTier !== currentTier) {
      console.log('🎯 Confirming tier change:', currentTier, '->', selectedTier);
      onTierChange(selectedTier);
    }
    onClose();
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    const validCurrency = currency && currency.trim() !== '' ? currency : 'USD';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const isCurrentTier = (tierName: string) => {
    return tierName?.toLowerCase() === currentTier?.toLowerCase();
  };

  const isSelectedTier = (tierName: string) => {
    return tierName?.toLowerCase() === selectedTier?.toLowerCase();
  };

  if (!profileContext) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Configuration Error
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Unable to load tier data. Profile context is missing.
            </p>
            <div className="flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-purple-600" />
            Change Pricing Tier
          </DialogTitle>
          <DialogDescription>
            Select a new pricing tier. Your current tier is <strong>{currentTier || 'None'}</strong>.
            {membershipStatus === 'Active' && (
              <span className="text-green-700 ml-1 font-medium">
                (Member pricing applied)
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading available tiers...</p>
            </div>
          </div>
        ) : tierConfigurations.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tiers Available</h3>
            <p className="text-gray-600">
              No pricing tiers are configured for your location: {profileContext.country || 'Unknown'}.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please contact support to configure tiers for your region.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tierConfigurations.map((tierConfig) => {
              const tierName = tierConfig.master_pricing_tiers?.name;
              const isCurrent = isCurrentTier(tierName);
              const isSelected = isSelectedTier(tierName);

              return (
                <Card
                  key={tierConfig.id}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50'
                      : isCurrent 
                        ? 'border-green-500 bg-green-50'
                        : 'hover:border-gray-300'
                  }`}
                  onClick={() => {
                    console.log('🎯 Selecting tier:', tierName);
                    setSelectedTier(tierName);
                  }}
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
                          <CheckCircle className="h-5 w-5 text-purple-600" />
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
                          {formatCurrency(
                            tierConfig.fixed_charge_per_challenge || 0, 
                            tierConfig.master_currencies?.code
                          )}
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
                    
                    {membershipStatus === 'Active' && (
                      <div className="pt-2 border-t">
                        <div className="bg-green-100 p-2 rounded text-green-800 text-xs flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Member discount applies to this tier
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedTier || isCurrentTier(selectedTier)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirm Change
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
