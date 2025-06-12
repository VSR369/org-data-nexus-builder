
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { WizardData } from '@/types/wizardTypes';
import { DomainGroupsData } from '@/types/domainGroups';
import { WIZARD_STEPS } from './wizardStepsConfig';
import WizardProgressBar from './WizardProgressBar';
import WizardNavigation from './WizardNavigation';
import WizardStepContent from './WizardStepContent';

interface ManualEntryWizardProps {
  data: DomainGroupsData;
  onDataUpdate: (newData: DomainGroupsData) => void;
  onCancel: () => void;
}

const ManualEntryWizard: React.FC<ManualEntryWizardProps> = ({
  data,
  onDataUpdate,
  onCancel
}) => {
  // Start at step 0 (Domain Group Setup) since we skip data source selection
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState(WIZARD_STEPS);
  const [wizardData, setWizardData] = useState<WizardData>({
    step: 0,
    dataSource: 'manual', // Pre-set to manual since user clicked manual entry wizard
    selectedIndustrySegment: '',
    isValid: false
  });

  console.log('ManualEntryWizard: Current wizard data:', wizardData);

  const updateWizardData = useCallback((updates: Partial<WizardData>) => {
    console.log('ManualEntryWizard: Updating wizard data with:', updates);
    setWizardData(prev => {
      const newData = { ...prev, ...updates };
      console.log('ManualEntryWizard: New wizard data:', newData);
      return newData;
    });
  }, []);

  const markStepCompleted = useCallback((stepIndex: number, isValid: boolean) => {
    console.log('ManualEntryWizard: Marking step', stepIndex, 'as', isValid ? 'valid' : 'invalid');
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex 
        ? { ...step, isValid, isCompleted: isValid }
        : step
    ));
  }, []);

  const canProceed = () => {
    const canMove = steps[currentStep]?.isValid || false;
    console.log('ManualEntryWizard: Can proceed?', canMove, 'for step', currentStep);
    return canMove;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      console.log('ManualEntryWizard: Moving to next step from', currentStep, 'to', currentStep + 1);
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      updateWizardData({ step: nextStep });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      console.log('ManualEntryWizard: Moving to previous step from', currentStep, 'to', currentStep - 1);
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      updateWizardData({ step: prevStep });
    }
  };

  const handleSubmit = (newData: DomainGroupsData) => {
    console.log('ManualEntryWizard: Submitting data and closing wizard');
    onDataUpdate(newData);
    onCancel(); // Close the wizard
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Domain Group Creation Wizard</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onCancel} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Domain Groups
            </Button>
          </div>
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

export default ManualEntryWizard;
