import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface EngagementModel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface EngagementModelSelectionProps {
  membershipType: string;
  selectedEngagementModel: string;
  engagementModels: EngagementModel[];
  onEngagementModelChange: (value: string) => void;
}

export const EngagementModelSelection: React.FC<EngagementModelSelectionProps> = ({
  membershipType,
  selectedEngagementModel,
  engagementModels,
  onEngagementModelChange
}) => {
  // Group A: Marketplace-based models (mutually exclusive within group)
  const groupAModels = engagementModels.filter(model => 
    model.name === 'Market Place' || 
    model.name === 'Aggregator' || 
    model.name === 'Market Place & Aggregator'
  );

  // Group B: Platform as a Service (separate)
  const groupBModels = engagementModels.filter(model => 
    model.name === 'Platform as a Service'
  );

  // Check if any Group A model is selected
  const isGroupASelected = groupAModels.some(model => model.id === selectedEngagementModel);
  
  // Check if Group B model is selected
  const isGroupBSelected = groupBModels.some(model => model.id === selectedEngagementModel);

  // Determine which models should be disabled
  const isModelDisabled = (model: EngagementModel): boolean => {
    // If Group A is selected, disable Group B
    if (isGroupASelected && groupBModels.some(b => b.id === model.id)) {
      return true;
    }
    
    // If Group B is selected, disable Group A
    if (isGroupBSelected && groupAModels.some(a => a.id === model.id)) {
      return true;
    }

    // Within Group A exclusivity rules
    if (groupAModels.some(a => a.id === model.id)) {
      // If "Market Place & Aggregator" is selected, disable "Market Place" and "Aggregator"
      if (selectedEngagementModel && 
          engagementModels.find(m => m.id === selectedEngagementModel)?.name === 'Market Place & Aggregator') {
        if (model.name === 'Market Place' || model.name === 'Aggregator') {
          return true;
        }
      }
      
      // If "Market Place" is selected, disable "Aggregator"
      if (selectedEngagementModel && 
          engagementModels.find(m => m.id === selectedEngagementModel)?.name === 'Market Place') {
        if (model.name === 'Aggregator') {
          return true;
        }
      }
      
      // If "Aggregator" is selected, disable "Market Place"
      if (selectedEngagementModel && 
          engagementModels.find(m => m.id === selectedEngagementModel)?.name === 'Aggregator') {
        if (model.name === 'Market Place') {
          return true;
        }
      }
    }

    return false;
  };

  const handleModelChange = (value: string) => {
    // Only allow selection if the model is not disabled
    const model = engagementModels.find(m => m.id === value);
    if (model && !isModelDisabled(model)) {
      onEngagementModelChange(value);
    }
  };

  return (
    <Card className={membershipType ? '' : 'opacity-50'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full" />
          Engagement Models
          {!membershipType && (
            <Badge variant="outline" className="text-xs">Select Plan First</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {membershipType ? (
          <div className="space-y-4">
            {/* Group A: Marketplace-based Models */}
            {groupAModels.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">Marketplace Models</div>
                <RadioGroup 
                  value={selectedEngagementModel || ''} 
                  onValueChange={handleModelChange}
                >
                  <div className="space-y-3">
                    {groupAModels.map((model) => {
                      const disabled = isModelDisabled(model);
                      return (
                        <Label 
                          key={model.id} 
                          htmlFor={`model-${model.id}`} 
                          className={`cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className={`flex items-start space-x-3 p-3 border rounded-lg transition-colors ${
                            selectedEngagementModel === model.id ? 'border-primary bg-primary/5' : ''
                          } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:bg-accent'}`}>
                            <RadioGroupItem 
                              value={model.id} 
                              id={`model-${model.id}`} 
                              className="mt-1" 
                              disabled={disabled}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {model.icon}
                                <span className="font-medium">{model.name}</span>
                                {disabled && (
                                  <Badge variant="secondary" className="text-xs">Disabled</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{model.description}</p>
                            </div>
                          </div>
                        </Label>
                      );
                    })}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Group B: Platform as a Service */}
            {groupBModels.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">Platform Services</div>
                <RadioGroup 
                  value={selectedEngagementModel || ''} 
                  onValueChange={handleModelChange}
                >
                  <div className="space-y-3">
                    {groupBModels.map((model) => {
                      const disabled = isModelDisabled(model);
                      return (
                        <Label 
                          key={model.id} 
                          htmlFor={`model-${model.id}`} 
                          className={`cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className={`flex items-start space-x-3 p-3 border rounded-lg transition-colors ${
                            selectedEngagementModel === model.id ? 'border-primary bg-primary/5' : ''
                          } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:bg-accent'}`}>
                            <RadioGroupItem 
                              value={model.id} 
                              id={`model-${model.id}`} 
                              className="mt-1" 
                              disabled={disabled}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {model.icon}
                                <span className="font-medium">{model.name}</span>
                                {disabled && (
                                  <Badge variant="secondary" className="text-xs">Disabled</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{model.description}</p>
                            </div>
                          </div>
                        </Label>
                      );
                    })}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Other models (if any) */}
            {engagementModels.filter(model => 
              !groupAModels.some(a => a.id === model.id) && 
              !groupBModels.some(b => b.id === model.id)
            ).length > 0 && (
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">Other Models</div>
                <RadioGroup 
                  value={selectedEngagementModel || ''} 
                  onValueChange={handleModelChange}
                >
                  <div className="space-y-3">
                    {engagementModels.filter(model => 
                      !groupAModels.some(a => a.id === model.id) && 
                      !groupBModels.some(b => b.id === model.id)
                    ).map((model) => (
                      <Label key={model.id} htmlFor={`model-${model.id}`} className="cursor-pointer">
                        <div className={`flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent transition-colors ${
                          selectedEngagementModel === model.id ? 'border-primary bg-primary/5' : ''
                        }`}>
                          <RadioGroupItem value={model.id} id={`model-${model.id}`} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {model.icon}
                              <span className="font-medium">{model.name}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{model.description}</p>
                          </div>
                        </div>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Select a membership plan first</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};