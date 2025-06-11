
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { WizardStep } from '@/types/wizardTypes';

interface WizardProgressBarProps {
  steps: WizardStep[];
  currentStep: number;
}

const WizardProgressBar: React.FC<WizardProgressBarProps> = ({
  steps,
  currentStep
}) => {
  const progressValue = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-2">
      <Progress value={progressValue} className="w-full" />
      <div className="flex justify-between text-sm text-muted-foreground">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`flex flex-col items-center ${
              index === currentStep ? 'text-primary font-medium' : ''
            } ${step.isCompleted ? 'text-green-600' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              index === currentStep 
                ? 'border-primary bg-primary text-primary-foreground' 
                : step.isCompleted 
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-muted'
            }`}>
              {index + 1}
            </div>
            <span className="mt-1 text-xs text-center">{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WizardProgressBar;
