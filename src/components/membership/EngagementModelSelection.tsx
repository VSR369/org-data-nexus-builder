import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, CheckCircle } from "lucide-react";
// Activation functionality removed

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
  activationStatus?: {
    isActivated: boolean;
    activatedModel?: string;
    loading: boolean;
  };
}

export const EngagementModelSelection: React.FC<EngagementModelSelectionProps> = ({
  membershipType,
  selectedEngagementModel,
  engagementModels,
  onEngagementModelChange,
  activationStatus
}) => {
  // Activation functionality removed

  const handleModelChange = (value: string) => {
    // Prevent changes if already activated
    if (activationStatus?.isActivated) {
      return;
    }
    onEngagementModelChange(value);
  };

  const isDisabled = activationStatus?.isActivated || false;
  const activatedModel = engagementModels.find(m => m.id === activationStatus?.activatedModel);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full" />
          Engagement Models
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Engagement Model Lock Alert */}
          {activationStatus?.isActivated && (
            <Alert className="border-orange-200 bg-orange-50">
              <Lock className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Engagement Model Locked:</strong> You can select only one engagement model. 
                If you want to have another engagement model in parallel, register as separate seeking organization.
                <br />
                <span className="text-sm text-orange-600 mt-1 inline-block">
                  Currently activated: <strong>{activationStatus.activatedModel}</strong>
                </span>
              </AlertDescription>
            </Alert>
          )}

          <RadioGroup 
            value={selectedEngagementModel || ''} 
            onValueChange={handleModelChange}
            disabled={isDisabled}
          >
            <div className="space-y-3">
              {engagementModels.map((model) => {
                const isCurrentlyActivated = activationStatus?.isActivated && activationStatus.activatedModel === model.name;
                const isDisabledOption = activationStatus?.isActivated && !isCurrentlyActivated;
                
                return (
                  <Label 
                    key={model.id} 
                    htmlFor={`model-${model.id}`} 
                    className={isDisabledOption ? "cursor-not-allowed" : "cursor-pointer"}
                  >
                    <div className={`flex items-start space-x-3 p-3 border rounded-lg transition-colors ${
                      isCurrentlyActivated 
                        ? 'border-primary bg-primary/5' 
                        : isDisabledOption 
                          ? 'opacity-50 bg-muted/30' 
                          : selectedEngagementModel === model.id
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-accent'
                    }`}>
                      <RadioGroupItem 
                        value={model.id} 
                        id={`model-${model.id}`} 
                        className="mt-1" 
                        disabled={isDisabledOption}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {model.icon}
                          <span className={`font-medium ${isDisabledOption ? 'text-gray-500' : ''}`}>
                            {model.name}
                          </span>
                          {isCurrentlyActivated && (
                            <div className="flex items-center gap-1">
                              <Lock className="h-3 w-3 text-primary" />
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                Active
                              </Badge>
                            </div>
                          )}
                        </div>
                        <p className={`text-sm ${isDisabledOption ? 'text-gray-400' : 'text-muted-foreground'}`}>
                          {model.description}
                        </p>
                      </div>
                    </div>
                  </Label>
                );
              })}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};