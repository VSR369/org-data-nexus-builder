import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Handshake, Check, AlertCircle, Calendar, DollarSign, Save, Crown } from 'lucide-react';
import { useEngagementModels } from '@/hooks/useEngagementModels';
import { usePricingData } from '@/hooks/usePricingData';
import { useMembershipData } from '@/hooks/useMembershipData';
import { MembershipService } from '@/services/MembershipService';
import { useToast } from "@/hooks/use-toast";

interface EngagementModelOption {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface PricingDetails {
  basePrice: number;
  currency: string;
  pricingTier: string;
  discountPercentage?: number;
  frequency: 'quarterly' | 'half-yearly' | 'annually';
  totalAmount: number;
}

interface StoredEngagementSelection {
  engagementModel: EngagementModelOption;
  pricingDetails: PricingDetails;
  selectionTimestamp: string;
  organizationType: string;
  entityType: string;
  country: string;
}

interface EngagementModelSelectorProps {
  country: string;
  organizationType: string;
  entityType: string;
  userId?: string; // Add userId to check membership status
  onEngagementSelect: (engagement: EngagementModelOption, pricing: PricingDetails | null) => void;
  selectedEngagement?: EngagementModelOption | null;
}

const EngagementModelSelector: React.FC<EngagementModelSelectorProps> = ({
  country,
  organizationType,
  entityType,
  userId,
  onEngagementSelect,
  selectedEngagement
}) => {
  const [selectedModel, setSelectedModel] = useState<EngagementModelOption | null>(selectedEngagement || null);
  const [selectedFrequency, setSelectedFrequency] = useState<'quarterly' | 'half-yearly' | 'annually'>('annually');
  const [selectedMembershipFrequency, setSelectedMembershipFrequency] = useState<'quarterly' | 'half-yearly' | 'annually'>('annually');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { engagementModels, loading: modelsLoading, error: modelsError } = useEngagementModels();
  const { getConfigByOrgTypeAndEngagement } = usePricingData();
  const { membershipData, countryPricing, loading: membershipLoading } = useMembershipData(entityType, country, organizationType);
  const { toast } = useToast();

  // Check if user has active membership
  const hasActiveMembership = userId ? MembershipService.getMembershipData(userId).status === 'active' : false;

  // Load saved selection on component mount
  useEffect(() => {
    const loadSavedSelection = () => {
      try {
        const storageKey = `engagement_selection_${organizationType}_${entityType}_${country}`.replace(/\s+/g, '_');
        const savedSelection = localStorage.getItem(storageKey);
        
        if (savedSelection) {
          const parsedSelection: StoredEngagementSelection = JSON.parse(savedSelection);
          console.log('✅ Loading saved engagement selection:', parsedSelection);
          
          setSelectedModel(parsedSelection.engagementModel);
          setSelectedFrequency(parsedSelection.pricingDetails.frequency);
          setIsConfirmed(true);
          
          // Notify parent component
          onEngagementSelect(parsedSelection.engagementModel, parsedSelection.pricingDetails);
          
          toast({
            title: "Previous Selection Loaded",
            description: `Restored your ${parsedSelection.engagementModel.name} selection with ${parsedSelection.pricingDetails.frequency} billing`,
          });
        }
      } catch (error) {
        console.error('❌ Error loading saved engagement selection:', error);
      }
    };

    loadSavedSelection();
  }, [organizationType, entityType, country, onEngagementSelect, toast]);

  const calculatePricing = (model: EngagementModelOption, frequency: 'quarterly' | 'half-yearly' | 'annually') => {
    // Get pricing configuration from master data for this specific combination
    const pricingConfig = getConfigByOrgTypeAndEngagement(organizationType, model.name);
    
    console.log('💰 Looking up pricing for:', {
      organizationType,
      entityType,
      country,
      engagementModel: model.name,
      frequency,
      foundConfig: pricingConfig,
      hasActiveMembership
    });
    
    if (!pricingConfig) {
      console.log('❌ No pricing data found in master data for this combination');
      return null; // Return null when no data is available
    }
    
    // Get the actual price based on frequency from master data
    let totalAmount = 0;
    const currency = pricingConfig.currency || 'USD';
    
    switch (frequency) {
      case 'quarterly':
        totalAmount = pricingConfig.quarterlyFee || 0;
        break;
      case 'half-yearly':
        totalAmount = pricingConfig.halfYearlyFee || 0;
        break;
      case 'annually':
        totalAmount = pricingConfig.annualFee || 0;
        break;
    }
    
    // If the specific frequency price is not configured, return null
    if (totalAmount === 0) {
      console.log(`❌ No ${frequency} pricing configured for ${model.name}`);
      return null;
    }
    
    // Only apply discount if user has active membership
    const discountPercentage = hasActiveMembership ? (pricingConfig.discountPercentage || 0) : undefined;
    const baseMonthlyPrice = frequency === 'quarterly' ? Math.round(totalAmount / 3) : 
                            frequency === 'half-yearly' ? Math.round(totalAmount / 6) : 
                            Math.round(totalAmount / 12);
    
    console.log('✅ Pricing calculated from master data:', {
      totalAmount,
      currency,
      frequency,
      discountPercentage,
      hasActiveMembership,
      baseMonthlyPrice
    });
    
    return {
      basePrice: baseMonthlyPrice,
      currency,
      pricingTier: pricingConfig.configName || 'Standard',
      discountPercentage,
      frequency,
      totalAmount
    };
  };

  const handleModelSelect = (modelId: string) => {
    const model = engagementModels.find(m => m.id === modelId);
    if (model) {
      setSelectedModel(model);
      setIsConfirmed(false); // Reset confirmation when model changes
      
      // Calculate pricing for current selection
      const pricingDetails = calculatePricing(model, selectedFrequency);
      onEngagementSelect(model, pricingDetails);
    }
  };

  const handleFrequencyChange = (frequency: 'quarterly' | 'half-yearly' | 'annually') => {
    setSelectedFrequency(frequency);
    setIsConfirmed(false); // Reset confirmation when frequency changes
    
    if (selectedModel) {
      const pricingDetails = calculatePricing(selectedModel, frequency);
      onEngagementSelect(selectedModel, pricingDetails);
    }
  };

  const confirmSelection = () => {
    if (selectedModel) {
      const pricingDetails = calculatePricing(selectedModel, selectedFrequency);
      
      // Store selection permanently
      const selectionData: StoredEngagementSelection = {
        engagementModel: selectedModel,
        pricingDetails,
        selectionTimestamp: new Date().toISOString(),
        organizationType,
        entityType,
        country
      };
      
      const storageKey = `engagement_selection_${organizationType}_${entityType}_${country}`.replace(/\s+/g, '_');
      localStorage.setItem(storageKey, JSON.stringify(selectionData));
      
      // Also store in a general list for reporting
      const allSelections = JSON.parse(localStorage.getItem('all_engagement_selections') || '[]');
      allSelections.push(selectionData);
      localStorage.setItem('all_engagement_selections', JSON.stringify(allSelections));
      
      setIsConfirmed(true);
      
      console.log('✅ Engagement selection confirmed and stored:', selectionData);
      
      toast({
        title: "Selection Confirmed & Saved ✅",
        description: `${selectedModel.name} with ${selectedFrequency} billing has been saved to your profile`,
      });
      
      onEngagementSelect(selectedModel, pricingDetails);
    }
  };

  const handleMembershipActivation = () => {
    if (!userId || !countryPricing || !selectedMembershipFrequency) return;
    
    const membershipPricing = {
      currency: countryPricing.currency,
      amount: selectedMembershipFrequency === 'quarterly' ? countryPricing.quarterlyPrice :
              selectedMembershipFrequency === 'half-yearly' ? countryPricing.halfYearlyPrice :
              countryPricing.annualPrice,
      frequency: selectedMembershipFrequency
    };
    
    const success = MembershipService.activateMembership(
      userId, 
      `${organizationType} - ${selectedMembershipFrequency}`, 
      membershipPricing
    );
    
    if (success) {
      toast({
        title: "Membership Activated! 🎉",
        description: `Your ${selectedMembershipFrequency} membership plan is now active. You'll get discounts on engagement models.`,
      });
      
      // Refresh component to show updated membership status
      window.location.reload();
    } else {
      toast({
        title: "Activation Failed",
        description: "Failed to activate membership. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (modelsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Handshake className="h-8 w-8 animate-pulse text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading engagement models...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (modelsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Error Loading Engagement Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{modelsError}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const activeModels = engagementModels.filter(model => model.isActive);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Handshake className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Membership & Engagement Selection</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Configure your membership plan and engagement model for {organizationType} ({entityType}) in {country}
        </p>
      </div>

      {/* Main Content - Single Row Layout */}
      <div className="space-y-6">
        {/* Membership Plans - Horizontal */}
        <Card>
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-xl">Membership Plans</CardTitle>
              {hasActiveMembership && <Badge className="bg-green-600">Active</Badge>}
            </div>
          </CardHeader>
          
          <CardContent>
            {membershipLoading ? (
              <div className="text-center py-4">
                <Crown className="h-6 w-6 animate-pulse text-yellow-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : countryPricing ? (
              <div className="space-y-4">
                <RadioGroup 
                  value={selectedMembershipFrequency} 
                  onValueChange={(value: string) => setSelectedMembershipFrequency(value as 'quarterly' | 'half-yearly' | 'annually')}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:border-yellow-300 transition-colors">
                    <RadioGroupItem value="quarterly" id="membership-quarterly" />
                    <Label htmlFor="membership-quarterly" className="flex-1 cursor-pointer">
                      <div className="text-center">
                        <div className="font-semibold">Quarterly</div>
                        <div className="text-xl font-bold text-yellow-700">{countryPricing.currency} {countryPricing.quarterlyPrice}</div>
                        <div className="text-xs text-muted-foreground">~{countryPricing.currency} {Math.round(countryPricing.quarterlyPrice / 3)}/month</div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:border-yellow-300 transition-colors">
                    <RadioGroupItem value="half-yearly" id="membership-half-yearly" />
                    <Label htmlFor="membership-half-yearly" className="flex-1 cursor-pointer">
                      <div className="text-center">
                        <div className="font-semibold">Half-Yearly</div>
                        <div className="text-xl font-bold text-yellow-700">{countryPricing.currency} {countryPricing.halfYearlyPrice}</div>
                        <div className="text-xs text-muted-foreground">~{countryPricing.currency} {Math.round(countryPricing.halfYearlyPrice / 6)}/month</div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="relative flex items-center space-x-3 p-4 border-2 border-green-300 bg-green-50 rounded-xl hover:border-green-400 transition-colors">
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-600 z-10">Best</Badge>
                    <RadioGroupItem value="annually" id="membership-annually" />
                    <Label htmlFor="membership-annually" className="flex-1 cursor-pointer">
                      <div className="text-center">
                        <div className="font-semibold">Annual</div>
                        <div className="text-xl font-bold text-green-700">{countryPricing.currency} {countryPricing.annualPrice}</div>
                        <div className="text-xs text-green-600">~{countryPricing.currency} {Math.round(countryPricing.annualPrice / 12)}/month</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                
                {selectedMembershipFrequency && !hasActiveMembership && (
                  <Button onClick={handleMembershipActivation} className="w-full bg-yellow-600 hover:bg-yellow-700">
                    <Crown className="h-4 w-4 mr-2" />
                    Activate {selectedMembershipFrequency} Plan
                  </Button>
                )}
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No membership plans found.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Engagement Models - Horizontal */}
        <Card>
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Handshake className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Engagement Models</CardTitle>
              <Badge variant="destructive">Required</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {activeModels.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No active engagement models are available. Please contact support or configure engagement models in the Master Data Portal.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-6">
                {/* Step 1: Select Engagement Model */}
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                    Choose Model
                  </h4>
                  
                  <RadioGroup 
                    value={selectedModel?.id || ''} 
                    onValueChange={handleModelSelect}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {activeModels.map((model) => (
                      <div key={model.id} className="relative">
                        <div className="flex flex-col items-center space-y-3 p-4 border-2 rounded-xl hover:border-primary/30 transition-colors duration-200 h-full">
                          <RadioGroupItem value={model.id} id={model.id} className="self-center" />
                          <Label htmlFor={model.id} className="flex-1 cursor-pointer text-center">
                            <div className="space-y-2">
                              <h5 className="font-semibold text-gray-900">{model.name}</h5>
                              <p className="text-sm text-muted-foreground">{model.description}</p>
                              <div className="flex gap-1 justify-center flex-wrap">
                                <Badge variant="outline" className="text-xs">{organizationType}</Badge>
                                <Badge variant="outline" className="text-xs">{entityType}</Badge>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Step 2: Select Billing Frequency */}
                {selectedModel && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                        Choose Frequency
                      </h4>
                      
                      <RadioGroup 
                        value={selectedFrequency} 
                        onValueChange={handleFrequencyChange}
                        className="space-y-3"
                      >
                        {(['quarterly', 'half-yearly', 'annually'] as const).map((frequency) => {
                          const pricing = calculatePricing(selectedModel, frequency);
                          const frequencyLabels = {
                            'quarterly': 'Quarterly',
                            'half-yearly': 'Half-Yearly', 
                            'annually': 'Annually'
                          };
                          const frequencyDesc = {
                            'quarterly': '3 months',
                            'half-yearly': '6 months', 
                            'annually': '12 months'
                          };
                          
                          return (
                            <div key={frequency} className="relative">
                              <div className={`flex items-center space-x-3 p-4 border-2 rounded-xl transition-colors duration-200 ${
                                pricing ? 'hover:border-primary/30' : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                              }`}>
                                <RadioGroupItem value={frequency} id={frequency} disabled={!pricing} />
                                <Label htmlFor={frequency} className={`flex-1 ${!pricing ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className={`font-semibold ${!pricing ? 'text-gray-400' : 'text-gray-900'}`}>
                                        {frequencyLabels[frequency]}
                                      </div>
                                      <div className={`text-sm ${!pricing ? 'text-gray-300' : 'text-muted-foreground'}`}>
                                        {frequencyDesc[frequency]}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      {pricing ? (
                                        <>
                                          <div className="text-xl font-bold text-primary">
                                            {pricing.currency} {pricing.totalAmount.toLocaleString()}
                                          </div>
                                          {hasActiveMembership && pricing.discountPercentage && (
                                            <div className="text-sm text-green-600">
                                              {pricing.discountPercentage}% member discount
                                            </div>
                                          )}
                                          <div className="text-xs text-muted-foreground">
                                            ~{pricing.currency} {pricing.basePrice}/month
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="text-lg font-bold text-gray-400">
                                            No Data
                                          </div>
                                          <div className="text-xs text-gray-400">
                                            Not configured
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </div>
                  </>
                )}

                {/* Step 3: Confirmation */}
                {selectedModel && selectedFrequency && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                        Confirm Selection
                      </h4>
                      
                      {(() => {
                        const currentPricing = calculatePricing(selectedModel, selectedFrequency);
                        
                        if (!currentPricing) {
                          return (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                No pricing data available for {selectedModel.name} with {selectedFrequency} billing frequency. 
                                Please configure pricing in Master Data or select a different option.
                              </AlertDescription>
                            </Alert>
                          );
                        }
                        
                        return (
                          <div className="space-y-4">
                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                              <h5 className="font-semibold text-primary mb-3">Selection Summary</h5>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Model:</span>
                                  <div className="font-medium">{selectedModel.name}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Frequency:</span>
                                  <div className="font-medium capitalize">{selectedFrequency.replace('-', ' ')}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Total:</span>
                                  <div className="font-bold text-lg text-primary">
                                    {currentPricing.currency} {currentPricing.totalAmount.toLocaleString()}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Discount:</span>
                                  <div className="font-medium">
                                    {hasActiveMembership && currentPricing.discountPercentage ? 
                                      `${currentPricing.discountPercentage}% Applied` : 
                                      'None'
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-3">
                              <Button 
                                onClick={confirmSelection}
                                disabled={isConfirmed}
                                className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                              >
                                <Save className="h-4 w-4 mr-2" />
                                {isConfirmed ? 'Confirmed ✅' : 'Confirm & Save'}
                              </Button>
                              
                              {isConfirmed && (
                                <Button 
                                  variant="outline"
                                  onClick={() => {
                                    setIsConfirmed(false);
                                    toast({
                                      title: "Modification Enabled",
                                      description: "You can now change your selections",
                                    });
                                  }}
                                  className="px-6 rounded-xl border-2 hover:bg-gray-50"
                                >
                                  Modify
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </>
                )}

                {/* No selection warning */}
                {!selectedModel && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-700">
                      Please select an engagement model to view pricing options. This selection is mandatory.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EngagementModelSelector;