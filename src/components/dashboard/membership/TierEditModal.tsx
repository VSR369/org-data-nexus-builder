
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2 } from 'lucide-react';
import { MembershipDataService } from '@/services/MembershipDataService';
import { toast } from '@/hooks/use-toast';

interface TierEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: string | null;
  onTierSelect: (tier: string) => void;
  country: string;
  isLoading?: boolean;
}

export const TierEditModal: React.FC<TierEditModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  onTierSelect,
  country,
  isLoading = false
}) => {
  const [availableTiers, setAvailableTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string | null>(currentTier);

  useEffect(() => {
    if (isOpen) {
      loadAvailableTiers();
      setSelectedTier(currentTier);
    }
  }, [isOpen, currentTier]);

  const loadAvailableTiers = async () => {
    try {
      setLoading(true);
      const tiers = await MembershipDataService.getAvailableTiers();
      setAvailableTiers(tiers);
    } catch (error) {
      console.error('Error loading tiers:', error);
      toast({
        title: "Error",
        description: "Failed to load available tiers.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTierSelect = (tierName: string) => {
    setSelectedTier(tierName);
  };

  const handleConfirm = () => {
    if (selectedTier && selectedTier !== currentTier) {
      onTierSelect(selectedTier);
      onClose();
    } else {
      onClose();
    }
  };

  const normalizeForComparison = (name: string) => {
    return name?.toLowerCase().trim() || '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Pricing Tier</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading available tiers...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableTiers.map((tier) => {
                const isSelected = normalizeForComparison(selectedTier) === normalizeForComparison(tier.name);
                const isCurrent = normalizeForComparison(currentTier) === normalizeForComparison(tier.name);
                
                return (
                  <Card 
                    key={tier.id}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleTierSelect(tier.name)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{tier.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          {isCurrent && (
                            <Badge variant="outline" className="text-xs">Current</Badge>
                          )}
                          {isSelected && (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        {tier.description || `${tier.name} tier with comprehensive features`}
                      </p>
                      <div className="text-xs text-gray-500">
                        Level: {tier.level_order}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {availableTiers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No pricing tiers available for your location.
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm}
                disabled={!selectedTier || isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {selectedTier === currentTier ? 'Close' : 'Update Tier'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
