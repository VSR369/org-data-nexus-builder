
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WizardData } from '@/types/wizardTypes';
import { DomainGroupsData } from '@/types/domainGroups';
import { WIZARD_STEPS } from './wizardStepsConfig';
import WizardProgressBar from './WizardProgressBar';
import WizardNavigation from './WizardNavigation';
import WizardStepContent from './WizardStepContent';

interface ExcelUploadWizardProps {
  data: DomainGroupsData;
  onDataUpdate: (newData: DomainGroupsData) => void;
  onCancel: () => void;
}

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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Domain Group Creation Wizard</span>
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        </CardTitle>
        
        <WizardProgressBar steps={steps} currentStep={currentStep} />
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="min-h-96">
          <WizardStepContent
            currentStep={currentStep}
            wizardData={wizardData}
            existingData={data}
            onUpdate={updateWizardData}
            onSubmit={onDataUpdate}
            onValidationChange={markStepCompleted}
          />
        </div>

        <WizardNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          canProceed={canProceed()}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </CardContent>
    </Card>
  );
};

export default ExcelUploadWizard;
