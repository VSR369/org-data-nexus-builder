import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, X, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { MembershipDataService } from '@/services/MembershipDataService';
import { DataSynchronizationService } from '@/services/DataSynchronizationService';

interface TierEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: string | null;
  userId: string;
  membershipStatus: string;
  profileContext: any; // Already normalized profile context
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
  const [membershipFees, setMembershipFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedSelections, setSavedSelections] = useState<any>(null);
  const [tierDetails, setTierDetails] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && profileContext) {
      initializeModal();
      setSelectedTier(currentTier);
    }
  }, [isOpen, currentTier, profileContext]);

  const initializeModal = async () => {
    try {
      setLoading(true);
      console.log('🔄 Tier modal initialized with profile context:', profileContext);
      
      // Load saved selections first
      await loadSavedSelections();
      
      // Then load available tiers
      await loadAvailableTiers();
    } catch (error) {
      console.error('❌ Error initializing tier modal:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedSelections = async () => {
    try {
      const selections = await DataSynchronizationService.getCurrentSelections(userId);
      setSavedSelections(selections);
      console.log('✅ Loaded saved tier selections:', selections);
    } catch (error) {
      console.error('❌ Error loading saved tier selections:', error);
    }
  };

  const loadAvailableTiers = async () => {
    try {
      if (!profileContext?.country) {
        console.error('❌ No country in profile context for tier loading');
        return;
      }

      console.log('🔄 Loading tiers for country:', profileContext.country);
      const configurations = await MembershipDataService.getMembershipFees(
        profileContext.country,
        profileContext.organization_type,
        profileContext.entity_type
      );
      setTierConfigurations([configurations]);
      console.log('✅ Loaded tier configurations:', configurations ? 1 : 0);

      // Load membership fees for all tiers
      await loadMembershipFees();
      
      // Load detailed tier information
      await loadTierDetails([configurations]);
    } catch (error) {
      console.error('❌ Error loading available tiers:', error);
    }
  };

  const loadMembershipFees = async () => {
    try {
      if (!profileContext?.country || !profileContext?.organization_type || !profileContext?.entity_type) {
        console.error('❌ Incomplete profile context for membership fees');
        return;
      }

      const fees = await MembershipDataService.getMembershipFees(
        profileContext.country,
        profileContext.organization_type,
        profileContext.entity_type
      );
      setMembershipFees(fees);
      console.log('✅ Loaded membership fees with normalized context');
    } catch (error) {
      console.error('❌ Error loading membership fees:', error);
    }
  };

  const loadTierDetails = async (tiers: any[]) => {
    try {
      // Set tier details directly from configurations
      setTierDetails(tiers);
      console.log('✅ Loaded tier details with profile context');
    } catch (error) {
      console.error('❌ Error loading tier details:', error);
    }
  };

  const handleConfirm = () => {
    if (!selectedTier || selectedTier === currentTier) {
      onClose();
      return;
    }

    onTierChange(selectedTier);
    onClose();
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

  const isCurrentTier = (tierName: string) => {
    return DataSynchronizationService.normalizeName(tierName) === DataSynchronizationService.normalizeName(currentTier || '');
  };

  const isSelectedTier = (tierName: string) => {
    return DataSynchronizationService.normalizeName(tierName) === DataSynchronizationService.normalizeName(selectedTier || '');
  };

  // Show error state if profile context is missing
  if (isOpen && !profileContext) {
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
            Select a new pricing tier. Your current tier is <strong>{currentTier}</strong>.
            {savedSelections && (
              <div className="text-xs text-gray-500 mt-1">
                Last saved: {savedSelections.pricing_tier} (selected {new Date(savedSelections.tier_selected_at || savedSelections.updated_at).toLocaleDateString()})
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tierDetails.map((tier) => {
              const isCurrent = isCurrentTier(tier.tier_name);
              const isSelected = isSelectedTier(tier.tier_name);
              const fee = membershipFees.find(f => f.tier_name === tier.tier_name);

              return (
                <Card
                  key={tier.id}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50'
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTier(tier.tier_name)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{tier.tier_name}</span>
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
                    <CardDescription>{tier.detailed_info?.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Max Challenges:</span>
                        <span className="font-medium">{tier.max_challenges}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Max Solutions:</span>
                        <span className="font-medium">{tier.max_solutions}</span>
                      </div>
                      {fee && (
                        <div className="flex justify-between text-sm">
                          <span>Membership Fee:</span>
                          <span className="font-medium">
                            {formatCurrency(fee.membership_fee, fee.currency_code)}
                          </span>
                        </div>
                      )}
                    </div>
                    {isSelected && fee && (
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium mb-2">Fee Details:</p>
                        <div className="text-sm">
                          <div className="flex justify-between">
                            <span>Setup Fee:</span>
                            <span className="font-medium">
                              {formatCurrency(fee.setup_fee, fee.currency_code)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Monthly Fee:</span>
                            <span className="font-medium">
                              {formatCurrency(fee.monthly_fee, fee.currency_code)}
                            </span>
                          </div>
                          {membershipStatus === 'active' && fee.membership_discount > 0 && (
                            <div className="text-green-600 text-xs mt-1">
                              <TrendingUp className="h-3 w-3 inline mr-1" />
                              {fee.membership_discount}% member discount applied
                            </div>
                          )}
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
          <Button onClick={handleConfirm} disabled={!selectedTier || isCurrentTier(selectedTier)}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirm Change
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
