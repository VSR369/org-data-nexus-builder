import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useEngagementActivation } from "@/hooks/useEngagementActivation";

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
  const { hasActivation, activeModel, loading } = useEngagementActivation();

  const handleModelChange = (value: string) => {
    // If there's an existing activation and user tries to select a different model
    if (hasActivation && activeModel && value !== activeModel) {
      // Don't allow the change, the alert will be shown
      return;
    }
    onEngagementModelChange(value);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            Engagement Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Loading activation status...
          </div>
        </CardContent>
      </Card>
    );
  }

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
          {/* Show alert if user has activation and tries to select different model */}
          {hasActivation && activeModel && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                You have already activated the "<strong>{activeModel}</strong>" engagement model.
                If you wish to activate another engagement model in parallel, please register again as a new solution-seeking organization.
              </AlertDescription>
            </Alert>
          )}

          <RadioGroup 
            value={selectedEngagementModel || ''} 
            onValueChange={handleModelChange}
          >
            <div className="space-y-3">
              {engagementModels.map((model) => {
                const isActiveModel = hasActivation && activeModel === model.id;
                const isDisabled = hasActivation && activeModel && activeModel !== model.id;
                
                return (
                  <Label 
                    key={model.id} 
                    htmlFor={`model-${model.id}`} 
                    className={`cursor-pointer ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`flex items-start space-x-3 p-3 border rounded-lg transition-colors ${
                      selectedEngagementModel === model.id 
                        ? 'border-primary bg-primary/5' 
                        : isDisabled 
                          ? 'border-gray-200 bg-gray-50' 
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
                          <span className={`font-medium ${isDisabled ? 'text-gray-400' : ''}`}>
                            {model.name}
                          </span>
                          {isActiveModel && (
                            <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                              Active
                            </Badge>
                          )}
                          {isDisabled && (
                            <Badge variant="outline" className="text-xs border-gray-300 text-gray-500">
                              Locked
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-muted-foreground'}`}>
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