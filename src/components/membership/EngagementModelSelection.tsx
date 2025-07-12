import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
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
}

export const EngagementModelSelection: React.FC<EngagementModelSelectionProps> = ({
  membershipType,
  selectedEngagementModel,
  engagementModels,
  onEngagementModelChange
}) => {
  // Activation functionality removed

  const handleModelChange = (value: string) => {
    onEngagementModelChange(value);
  };

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
          <RadioGroup 
            value={selectedEngagementModel || ''} 
            onValueChange={handleModelChange}
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
                      : 'hover:bg-accent'
                  }`}>
                    <RadioGroupItem 
                      value={model.id} 
                      id={`model-${model.id}`} 
                      className="mt-1" 
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {model.icon}
                        <span className="font-medium">
                          {model.name}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
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