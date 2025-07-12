import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Lock, CheckCircle } from "lucide-react";
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
          {/* Activation Status Alert */}
          {activationStatus?.isActivated && (
            <Alert className="border-orange-200 bg-orange-50">
              <Lock className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <div className="space-y-2">
                  <p className="font-semibold">
                    You have already activated an engagement model
                  </p>
                  {activatedModel && (
                    <div className="flex items-center gap-2 p-2 bg-white rounded border">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div className="flex items-center gap-2">
                        {activatedModel.icon}
                        <span className="font-medium">{activatedModel.name}</span>
                      </div>
                    </div>
                  )}
                  <p className="text-sm">
                    Our system allows only one engagement model per organization. If you need a different engagement model, 
                    you must register as a separate seeking organization.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <RadioGroup 
            value={selectedEngagementModel || ''} 
            onValueChange={handleModelChange}
            disabled={isDisabled}
          >
            <div className="space-y-3">
              {engagementModels.map((model) => (
                <Label 
                  key={model.id} 
                  htmlFor={`model-${model.id}`} 
                  className="cursor-pointer"
                >
                  <div className={`flex items-start space-x-3 p-3 border rounded-lg transition-colors ${
                    selectedEngagementModel === model.id 
                      ? 'border-primary bg-primary/5' 
                      : isDisabled 
                        ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                        : 'hover:bg-accent'
                  }`}>
                    <RadioGroupItem 
                      value={model.id} 
                      id={`model-${model.id}`} 
                      className="mt-1" 
                      disabled={isDisabled}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {model.icon}
                        <span className={`font-medium ${isDisabled ? 'text-gray-500' : ''}`}>
                          {model.name}
                        </span>
                        {activationStatus?.isActivated && model.id === activationStatus.activatedModel && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            Activated
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-muted-foreground'}`}>
                        {model.description}
                      </p>
                    </div>
                  </div>
                </Label>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};