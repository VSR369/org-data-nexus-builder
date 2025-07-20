
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Settings, X, Loader2 } from 'lucide-react';
import { useTierConfigurations } from '@/hooks/useTierConfigurations';
import { DetailedTierCard } from './DetailedTierCard';
import { toast } from '@/hooks/use-toast';

interface EditTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: string | null;
  countryName: string;
  onTierChange: (tier: string) => void;
}

export const EditTierModal: React.FC<EditTierModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  countryName,
  onTierChange
}) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(currentTier);
  const { tierConfigurations, loading, error } = useTierConfigurations(countryName);

  useEffect(() => {
    if (isOpen) {
      setSelectedTier(currentTier);
      console.log('🎯 EditTierModal opened with current tier:', currentTier);
    }
  }, [isOpen, currentTier]);

  // Sort tiers by level order to ensure proper display order
  const sortedTiers = [...tierConfigurations].sort((a, b) => a.level_order - b.level_order);

  // Find recommended tier (usually the middle one or Standard)
  const recommendedTier = sortedTiers.find(tier => 
    tier.pricing_tier_name.toLowerCase().includes('standard')
  ) || sortedTiers[Math.floor(sortedTiers.length / 2)];

  const handleConfirm = () => {
    if (selectedTier && selectedTier !== currentTier) {
      console.log('🎯 Confirming tier change:', currentTier, '->', selectedTier);
      onTierChange(selectedTier);
      toast({
        title: "Success",
        description: `Pricing tier changed to ${selectedTier}`,
      });
      onClose();
    } else {
      onClose();
    }
  };

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <X className="h-5 w-5" />
              Error Loading Tiers
            </DialogTitle>
            <DialogDescription>
              {error}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Change Pricing Tier
          </DialogTitle>
          <DialogDescription>
            Select a new pricing tier with detailed features and benefits. 
            Your current tier is <strong>{currentTier}</strong>.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading detailed tier configurations...</p>
            </div>
          </div>
        ) : tierConfigurations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tier configurations available for {countryName}.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {sortedTiers.map((config) => (
                <DetailedTierCard
                  key={config.id}
                  tierConfiguration={config}
                  isSelected={selectedTier === config.pricing_tier_name}
                  isCurrent={currentTier === config.pricing_tier_name}
                  onTierSelect={(tierName) => setSelectedTier(tierName)}
                  membershipStatus="inactive"
                />
              ))}
            </div>
            
            {selectedTier && selectedTier !== currentTier && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    Ready to change to {selectedTier}
                  </span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  You can change your tier at any time from your account settings. 
                  All tier features will be available immediately after confirmation.
                </p>
              </div>
            )}

            {selectedTier === currentTier && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    This is your current tier
                  </span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  You are currently enjoying all the benefits of the {currentTier} tier.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm}
                disabled={!selectedTier || selectedTier === currentTier}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {selectedTier === currentTier ? 'No Change' : 'Confirm Change'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
