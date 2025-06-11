
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
    dataSource: '' as any,
    selectedIndustrySegment: '',
    isValid: false
  });

  console.log('ExcelUploadWizard: Current wizard data:', wizardData);

  const updateWizardData = (updates: Partial<WizardData>) => {
    console.log('ExcelUploadWizard: Updating wizard data with:', updates);
    setWizardData(prev => {
      const newData = { ...prev, ...updates };
      console.log('ExcelUploadWizard: New wizard data:', newData);
      return newData;
    });
  };

  const markStepCompleted = (stepIndex: number, isValid: boolean) => {
    console.log('ExcelUploadWizard: Marking step', stepIndex, 'as', isValid ? 'valid' : 'invalid');
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex 
        ? { ...step, isValid, isCompleted: isValid }
        : step
    ));
  };

  const canProceed = () => {
    const canMove = steps[currentStep]?.isValid || false;
    console.log('ExcelUploadWizard: Can proceed?', canMove, 'for step', currentStep);
    return canMove;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      console.log('ExcelUploadWizard: Moving to next step from', currentStep, 'to', currentStep + 1);
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      updateWizardData({ step: nextStep });
      
      // For Excel uploads, auto-advance through certain steps
      if (wizardData.dataSource === 'excel' && wizardData.excelData?.data.length > 0) {
        if (nextStep === 1) {
          // Auto-validate step 1 for Excel uploads
          setTimeout(() => {
            markStepCompleted(1, true);
          }, 100);
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      console.log('ExcelUploadWizard: Moving to previous step from', currentStep, 'to', currentStep - 1);
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      updateWizardData({ step: prevStep });
    }
  };

  const handleSubmit = (newData: DomainGroupsData) => {
    console.log('ExcelUploadWizard: Submitting data and closing wizard');
    onDataUpdate(newData);
    onCancel(); // Close the wizard
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
            onSubmit={handleSubmit}
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
