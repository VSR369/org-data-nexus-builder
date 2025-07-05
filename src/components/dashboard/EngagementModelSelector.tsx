import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Handshake, Check, AlertCircle, Calendar, DollarSign, Save } from 'lucide-react';
import { useEngagementModels } from '@/hooks/useEngagementModels';
import { usePricingData } from '@/hooks/usePricingData';
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
  onEngagementSelect: (engagement: EngagementModelOption, pricing: PricingDetails | null) => void;
  selectedEngagement?: EngagementModelOption | null;
}

const EngagementModelSelector: React.FC<EngagementModelSelectorProps> = ({
  country,
  organizationType,
  entityType,
  onEngagementSelect,
  selectedEngagement
}) => {
  const [selectedModel, setSelectedModel] = useState<EngagementModelOption | null>(selectedEngagement || null);
  const [selectedFrequency, setSelectedFrequency] = useState<'quarterly' | 'half-yearly' | 'annually'>('annually');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { engagementModels, loading: modelsLoading, error: modelsError } = useEngagementModels();
  const { getConfigByOrgTypeAndEngagement } = usePricingData();
  const { toast } = useToast();

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
    const pricingConfig = getConfigByOrgTypeAndEngagement(organizationType, model.name);
    
    const baseMonthlyPrice = 1000; // Default base price since pricingConfig structure varies
    const currency = pricingConfig?.currency || 'USD';
    
    // Calculate pricing based on frequency
    let multiplier = 12; // Default annually
    let discountPercentage = 0;
    
    switch (frequency) {
      case 'quarterly':
        multiplier = 3;
        discountPercentage = 0; // No discount for quarterly
        break;
      case 'half-yearly':
        multiplier = 6;
        discountPercentage = 5; // 5% discount for half-yearly
        break;
      case 'annually':
        multiplier = 12;
        discountPercentage = 10; // 10% discount for annually
        break;
    }
    
    const totalBeforeDiscount = baseMonthlyPrice * multiplier;
    const discountAmount = (totalBeforeDiscount * discountPercentage) / 100;
    const totalAmount = totalBeforeDiscount - discountAmount;
    
    return {
      basePrice: baseMonthlyPrice,
      currency,
      pricingTier: 'Standard',
      discountPercentage: discountPercentage > 0 ? discountPercentage : undefined,
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Handshake className="h-5 w-5" />
          Select Engagement Model & Pricing
          <Badge variant="destructive" className="ml-2">Mandatory</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose your engagement model and billing frequency. Pricing is customized for {organizationType} ({entityType}) in {country}.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
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
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                Select Engagement Model
              </h4>
              
              <RadioGroup 
                value={selectedModel?.id || ''} 
                onValueChange={handleModelSelect}
                className="space-y-3"
              >
                {activeModels.map((model) => (
                  <div key={model.id} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={model.id} id={model.id} />
                    <Label htmlFor={model.id} className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{model.name}</h5>
                          <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">{organizationType}</Badge>
                            <Badge variant="outline" className="text-xs">{entityType}</Badge>
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Step 2: Select Billing Frequency */}
            {selectedModel && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                    Select Billing Frequency
                  </h4>
                  
                  <RadioGroup 
                    value={selectedFrequency} 
                    onValueChange={handleFrequencyChange}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {(['quarterly', 'half-yearly', 'annually'] as const).map((frequency) => {
                      const pricing = calculatePricing(selectedModel, frequency);
                      const frequencyLabels = {
                        'quarterly': 'Quarterly (3 months)',
                        'half-yearly': 'Half-Yearly (6 months)', 
                        'annually': 'Annually (12 months)'
                      };
                      
                      return (
                        <div key={frequency} className="flex items-center space-x-3">
                          <RadioGroupItem value={frequency} id={frequency} />
                          <Label htmlFor={frequency} className="flex-1 cursor-pointer">
                            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium">{frequencyLabels[frequency]}</h5>
                                <Calendar className="h-4 w-4 text-gray-400" />
                              </div>
                              <div className="text-lg font-bold text-blue-600">
                                {pricing.currency} {pricing.totalAmount.toLocaleString()}
                              </div>
                              {pricing.discountPercentage && (
                                <div className="text-sm text-green-600">
                                  Save {pricing.discountPercentage}% 
                                  <span className="text-gray-500 line-through ml-2">
                                    {pricing.currency} {(pricing.basePrice * (frequency === 'quarterly' ? 3 : frequency === 'half-yearly' ? 6 : 12)).toLocaleString()}
                                  </span>
                                </div>
                              )}
                              <div className="text-xs text-gray-500 mt-1">
                                {pricing.currency} {pricing.basePrice}/month base rate
                              </div>
                            </div>
                          </Label>
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
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                    Confirm Selection
                  </h4>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                    <h5 className="font-medium text-blue-800 mb-2">Your Selection Summary</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600">Engagement Model:</span>
                        <div className="font-medium">{selectedModel.name}</div>
                      </div>
                      <div>
                        <span className="text-blue-600">Billing Frequency:</span>
                        <div className="font-medium capitalize">{selectedFrequency.replace('-', ' ')}</div>
                      </div>
                      <div>
                        <span className="text-blue-600">Total Amount:</span>
                        <div className="font-medium text-lg">
                          {calculatePricing(selectedModel, selectedFrequency).currency} {calculatePricing(selectedModel, selectedFrequency).totalAmount.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-blue-600">Organization:</span>
                        <div className="font-medium">{organizationType} - {entityType}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      onClick={confirmSelection}
                      disabled={isConfirmed}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isConfirmed ? 'Selection Confirmed ✅' : 'Confirm & Save Selection'}
                    </Button>
                    
                    {isConfirmed && (
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setIsConfirmed(false);
                          toast({
                            title: "Selection Reset",
                            description: "You can now modify your selection",
                          });
                        }}
                      >
                        Modify Selection
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* No selection warning */}
            {!selectedModel && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please select an engagement model to view pricing options. This selection is mandatory.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EngagementModelSelector;