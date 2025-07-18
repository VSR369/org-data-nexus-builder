
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Settings, X, Zap, Users, Clock, Headphones, BarChart3 } from 'lucide-react';
import { MembershipDataService } from '@/services/MembershipDataService';
import { toast } from '@/hooks/use-toast';

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
  const [tierConfigurations, setTierConfigurations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTierConfigurations();
      setSelectedTier(currentTier);
    }
  }, [isOpen, currentTier, countryName]);

  const loadTierConfigurations = async () => {
    try {
      setLoading(true);
      console.log('🏷️ Loading tier configurations for country:', countryName);
      
      const tierConfigs = await MembershipDataService.getTierConfigurationsByCountry(countryName);
      console.log('✅ Loaded tier configurations:', tierConfigs);
      
      setTierConfigurations(tierConfigs);
    } catch (error) {
      console.error('❌ Error loading tier configurations:', error);
      toast({
        title: "Error",
        description: "Failed to load tier configurations.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedTier && selectedTier !== currentTier) {
      onTierChange(selectedTier);
      onClose();
    } else {
      onClose();
    }
  };

  const getTierIcon = (tierName: string) => {
    const name = tierName?.toLowerCase() || '';
    if (name.includes('premium') || name.includes('enterprise')) return <Zap className="h-5 w-5 text-purple-600" />;
    if (name.includes('standard') || name.includes('professional')) return <Users className="h-5 w-5 text-blue-600" />;
    return <Settings className="h-5 w-5 text-green-600" />;
  };

  const normalizeForComparison = (name: string) => {
    return name?.toLowerCase().trim() || '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
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
              <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tierConfigurations.map((tierConfig) => {
                const tierName = tierConfig.master_pricing_tiers?.name;
                const isSelected = normalizeForComparison(selectedTier) === normalizeForComparison(tierName);
                const isCurrent = normalizeForComparison(currentTier) === normalizeForComparison(tierName);
                
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
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTierIcon(tierName)}
                          <span>{tierName}</span>
                        </div>
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
                      <CardDescription className="text-sm">
                        {tierConfig.master_pricing_tiers?.description || `Level ${tierConfig.master_pricing_tiers?.level_order} tier`}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Challenge Limits */}
                      <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Zap className="h-4 w-4 text-orange-600" />
                          Challenge Limits
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">Monthly:</span>
                            <div className="font-medium">
                              {tierConfig.monthly_challenge_limit || 'Unlimited'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Solutions:</span>
                            <div className="font-medium">
                              {tierConfig.solutions_per_challenge || 1} per challenge
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="bg-green-50 p-3 rounded-lg space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-green-800">
                          <span>💰</span>
                          Pricing
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fixed Charge:</span>
                            <span className="font-medium">
                              {MembershipDataService.formatCurrency(
                                tierConfig.fixed_charge_per_challenge || 0, 
                                tierConfig.master_currencies?.code || 'USD',
                                tierConfig.master_currencies?.symbol
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Overage:</span>
                            <Badge variant={tierConfig.allows_overage ? "default" : "secondary"} className="text-xs">
                              {tierConfig.allows_overage ? 'Allowed' : 'Not Allowed'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Support & Analytics */}
                      <div className="space-y-2">
                        {tierConfig.master_support_types && (
                          <div className="flex items-center gap-2 text-xs">
                            <Headphones className="h-3 w-3 text-blue-600" />
                            <span className="text-gray-600">Support:</span>
                            <Badge variant="outline" className="text-xs">
                              {tierConfig.master_support_types.name}
                            </Badge>
                          </div>
                        )}
                        
                        {tierConfig.master_analytics_access_types && (
                          <div className="flex items-center gap-2 text-xs">
                            <BarChart3 className="h-3 w-3 text-purple-600" />
                            <span className="text-gray-600">Analytics:</span>
                            <Badge variant="outline" className="text-xs">
                              {tierConfig.master_analytics_access_types.name}
                            </Badge>
                          </div>
                        )}
                        
                        {tierConfig.master_support_types?.response_time && (
                          <div className="flex items-center gap-2 text-xs">
                            <Clock className="h-3 w-3 text-orange-600" />
                            <span className="text-gray-600">Response:</span>
                            <span className="font-medium">
                              {tierConfig.master_support_types.response_time}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Workflow Templates */}
                      {tierConfig.master_workflow_templates && (
                        <div className="bg-purple-50 p-2 rounded text-xs">
                          <div className="font-medium text-purple-800">
                            {tierConfig.master_workflow_templates.name}
                          </div>
                          <div className="text-purple-600">
                            {tierConfig.master_workflow_templates.template_count} templates
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {tierConfigurations.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Tiers Available</h3>
                <p className="text-gray-600">
                  No pricing tiers are configured for {countryName}.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Please contact support to configure pricing tiers for your location.
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
                Confirm Change
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
