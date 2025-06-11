
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WizardData, WizardStep } from '@/types/wizardTypes';
import { DomainGroupsData } from '@/types/domainGroups';
import DataSourceSelector from './DataSourceSelector';
import DomainGroupSetup from './DomainGroupSetup';
import DataEntryStep from './DataEntryStep';
import ReviewAndSubmit from './ReviewAndSubmit';

interface ExcelUploadWizardProps {
  data: DomainGroupsData;
  onDataUpdate: (newData: DomainGroupsData) => void;
  onCancel: () => void;
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'source',
    title: 'Data Source',
    description: 'Choose how to add your domain groups',
    isValid: false,
    isCompleted: false
  },
  {
    id: 'setup',
    title: 'Domain Group Setup',
    description: 'Configure industry segment and domain group',
    isValid: false,
    isCompleted: false
  },
  {
    id: 'entry',
    title: 'Data Entry',
    description: 'Add categories and sub-categories',
    isValid: false,
    isCompleted: false
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Review and submit your hierarchy',
    isValid: false,
    isCompleted: false
  }
];

const ExcelUploadWizard: React.FC<ExcelUploadWizardProps> = ({
  data,
  onDataUpdate,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState(WIZARD_STEPS);
  const [wizardData, setWizardData] = useState<WizardData>({
    step: 0,
    dataSource: 'manual',
    selectedIndustrySegment: '',
    isValid: false
  });

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const markStepCompleted = (stepIndex: number, isValid: boolean) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex 
        ? { ...step, isValid, isCompleted: isValid }
        : step
    ));
  };

  const canProceed = () => {
    return steps[currentStep]?.isValid || false;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      setCurrentStep(prev => prev + 1);
      updateWizardData({ step: currentStep + 1 });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      updateWizardData({ step: currentStep - 1 });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <DataSourceSelector
            wizardData={wizardData}
            onUpdate={updateWizardData}
            onValidationChange={(isValid) => markStepCompleted(0, isValid)}
          />
        );
      case 1:
        return (
          <DomainGroupSetup
            wizardData={wizardData}
            onUpdate={updateWizardData}
            onValidationChange={(isValid) => markStepCompleted(1, isValid)}
          />
        );
      case 2:
        return (
          <DataEntryStep
            wizardData={wizardData}
            onUpdate={updateWizardData}
            onValidationChange={(isValid) => markStepCompleted(2, isValid)}
          />
        );
      case 3:
        return (
          <ReviewAndSubmit
            wizardData={wizardData}
            existingData={data}
            onUpdate={updateWizardData}
            onSubmit={onDataUpdate}
            onValidationChange={(isValid) => markStepCompleted(3, isValid)}
          />
        );
      default:
        return null;
    }
  };

  const progressValue = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Domain Group Creation Wizard</span>
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        </CardTitle>
        
        {/* Progress Bar */}
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
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Step Content */}
        <div className="min-h-96">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed() || currentStep === steps.length - 1}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExcelUploadWizard;
