import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar, Zap, Crown } from "lucide-react";

interface FrequencySelectorProps {
  selectedFrequency: string | null;
  onFrequencyChange: (frequency: string) => void;
  disabled?: boolean;
}

export const FrequencySelector: React.FC<FrequencySelectorProps> = ({
  selectedFrequency,
  onFrequencyChange,
  disabled = false
}) => {
  const frequencies = [
    {
      id: 'quarterly',
      label: 'Quarterly',
      description: 'Pay every 3 months',
      icon: Calendar,
      popular: false
    },
    {
      id: 'half-yearly',
      label: 'Half-Yearly',
      description: 'Pay every 6 months',
      icon: Zap,
      popular: true
    },
    {
      id: 'annual',
      label: 'Annual',
      description: 'Pay once a year - Best Value',
      icon: Crown,
      popular: false
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-primary" />
        <h4 className="font-medium">Select Billing Frequency</h4>
      </div>
      
      <RadioGroup 
        value={selectedFrequency || ''} 
        onValueChange={onFrequencyChange}
        disabled={disabled}
        className="grid gap-3"
      >
        {frequencies.map((frequency) => {
          const Icon = frequency.icon;
          return (
            <div key={frequency.id} className="relative">
              <Card className={`cursor-pointer transition-all hover:shadow-md ${
                selectedFrequency === frequency.id 
                  ? 'ring-2 ring-primary border-primary' 
                  : 'border-border'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={frequency.id} 
                      id={frequency.id}
                      disabled={disabled}
                    />
                    <Label 
                      htmlFor={frequency.id} 
                      className={`flex-1 cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {frequency.label}
                              {frequency.popular && (
                                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                  Most Popular
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {frequency.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};