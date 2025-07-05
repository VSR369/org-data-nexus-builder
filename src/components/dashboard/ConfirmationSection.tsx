import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, AlertCircle } from 'lucide-react';

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

interface ConfirmationSectionProps {
  selectedModel: EngagementModelOption | null;
  selectedFrequency: 'quarterly' | 'half-yearly' | 'annually';
  isConfirmed: boolean;
  hasActiveMembership: boolean;
  onConfirmSelection: () => void;
  onModifySelection: () => void;
  calculatePricing: (model: EngagementModelOption, frequency: 'quarterly' | 'half-yearly' | 'annually') => PricingDetails | null;
}

const ConfirmationSection: React.FC<ConfirmationSectionProps> = ({
  selectedModel,
  selectedFrequency,
  isConfirmed,
  hasActiveMembership,
  onConfirmSelection,
  onModifySelection,
  calculatePricing
}) => {
  return (
    <Card className="h-fit sticky top-4">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
          <CardTitle className="text-lg">Confirm Selection</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
        {selectedModel && selectedFrequency ? (
          (() => {
            const currentPricing = calculatePricing(selectedModel, selectedFrequency);
            
            if (!currentPricing) {
              return (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    No pricing data available for {selectedModel.name} with {selectedFrequency} billing frequency. 
                    Please configure pricing in Master Data or select a different option.
                  </AlertDescription>
                </Alert>
              );
            }
            
            return (
              <div className="space-y-4">
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <h5 className="font-medium text-primary mb-2 text-sm">Selection Summary</h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Model:</span>
                      <div className="font-medium text-right">{selectedModel.name}</div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frequency:</span>
                      <div className="font-medium text-right capitalize">{selectedFrequency.replace('-', ' ')}</div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total:</span>
                      <div className="font-bold text-sm text-primary">
                        {currentPricing.currency} {currentPricing.totalAmount.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount:</span>
                      <div className="font-medium text-right">
                        {hasActiveMembership && currentPricing.discountPercentage ? 
                          `${currentPricing.discountPercentage}% Applied` : 
                          'None'
                        }
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={onConfirmSelection}
                    disabled={isConfirmed}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    {isConfirmed ? 'Confirmed ✅' : 'Confirm & Save'}
                  </Button>
                  
                  {isConfirmed && (
                    <Button 
                      variant="outline"
                      onClick={onModifySelection}
                      className="w-full rounded-lg border hover:bg-gray-50 text-sm py-2"
                    >
                      Modify
                    </Button>
                  )}
                </div>
              </div>
            );
          })()
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">
              Select an engagement model and frequency to see confirmation details
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConfirmationSection;