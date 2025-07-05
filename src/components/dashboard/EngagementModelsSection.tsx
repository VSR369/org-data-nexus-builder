import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Handshake, AlertCircle } from 'lucide-react';

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

interface EngagementModelsSectionProps {
  activeModels: EngagementModelOption[];
  selectedModel: EngagementModelOption | null;
  selectedFrequency: 'quarterly' | 'half-yearly' | 'annually';
  organizationType: string;
  entityType: string;
  hasActiveMembership: boolean;
  onModelSelect: (modelId: string) => void;
  onFrequencyChange: (frequency: 'quarterly' | 'half-yearly' | 'annually') => void;
  calculatePricing: (model: EngagementModelOption, frequency: 'quarterly' | 'half-yearly' | 'annually') => PricingDetails | null;
}

const EngagementModelsSection: React.FC<EngagementModelsSectionProps> = ({
  activeModels,
  selectedModel,
  selectedFrequency,
  organizationType,
  entityType,
  hasActiveMembership,
  onModelSelect,
  onFrequencyChange,
  calculatePricing
}) => {
  return (
    <Card className="h-fit">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Handshake className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Engagement Models</CardTitle>
          <Badge variant="destructive" className="text-xs">Required</Badge>
        </div>
        <p className="text-xs text-muted-foreground">Select your engagement model and billing frequency</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {activeModels.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              No active engagement models are available. Please contact support or configure engagement models in the Master Data Portal.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {/* Step 1: Select Engagement Model */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2 text-sm">
                <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                Choose Model
              </h4>
              
              <RadioGroup 
                value={selectedModel?.id || ''} 
                onValueChange={onModelSelect}
                className="grid grid-cols-2 gap-3"
              >
                {activeModels.map((model) => (
                  <div key={model.id} className="relative">
                    <div className="flex flex-col items-center space-y-2 p-3 border rounded-lg hover:border-primary/30 transition-colors duration-200 h-full min-h-[100px]">
                      <RadioGroupItem value={model.id} id={model.id} className="self-center" />
                      <Label htmlFor={model.id} className="flex-1 cursor-pointer text-center">
                        <div className="space-y-1">
                          <h5 className="font-medium text-gray-900 text-xs">{model.name}</h5>
                          <p className="text-xs text-muted-foreground leading-tight">{model.description}</p>
                          <div className="flex gap-1 justify-center flex-wrap">
                            <Badge variant="outline" className="text-xs px-1 py-0">{organizationType}</Badge>
                            <Badge variant="outline" className="text-xs px-1 py-0">{entityType}</Badge>
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
                  <h4 className="font-medium mb-3 flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                    Choose Frequency
                  </h4>
                  
                  <RadioGroup 
                    value={selectedFrequency} 
                    onValueChange={onFrequencyChange}
                    className="space-y-2"
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
                          <div className={`flex items-center space-x-2 p-3 border rounded-lg transition-colors duration-200 ${
                            pricing ? 'hover:border-primary/30' : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                          }`}>
                            <RadioGroupItem value={frequency} id={frequency} disabled={!pricing} />
                            <Label htmlFor={frequency} className={`flex-1 ${!pricing ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className={`font-medium text-sm ${!pricing ? 'text-gray-400' : 'text-gray-900'}`}>
                                    {frequencyLabels[frequency]}
                                  </div>
                                  <div className={`text-xs ${!pricing ? 'text-gray-300' : 'text-muted-foreground'}`}>
                                    {frequencyDesc[frequency]}
                                  </div>
                                </div>
                                <div className="text-right">
                                  {pricing ? (
                                    <>
                                      <div className="text-lg font-bold text-primary">
                                        {pricing.currency} {pricing.totalAmount.toLocaleString()}
                                      </div>
                                      {hasActiveMembership && pricing.discountPercentage && (
                                        <div className="text-xs text-green-600">
                                          {pricing.discountPercentage}% discount
                                        </div>
                                      )}
                                      <div className="text-xs text-muted-foreground">
                                        ~{pricing.currency} {pricing.basePrice}/month
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="text-sm font-bold text-gray-400">
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

            {/* No selection warning */}
            {!selectedModel && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-700 text-xs">
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

export default EngagementModelsSection;