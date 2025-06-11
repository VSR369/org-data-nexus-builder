
import React from 'react';
import { WizardData } from '@/types/wizardTypes';
import { DomainGroupsData } from '@/types/domainGroups';
import DataSourceSelector from './DataSourceSelector';
import DomainGroupSetup from './DomainGroupSetup';
import DataEntryStep from './DataEntryStep';
import ReviewAndSubmit from './ReviewAndSubmit';

interface WizardStepContentProps {
  currentStep: number;
  wizardData: WizardData;
  existingData: DomainGroupsData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onSubmit: (newData: DomainGroupsData) => void;
  onValidationChange: (stepIndex: number, isValid: boolean) => void;
}

const WizardStepContent: React.FC<WizardStepContentProps> = ({
  currentStep,
  wizardData,
  existingData,
  onUpdate,
  onSubmit,
  onValidationChange
}) => {
  switch (currentStep) {
    case 0:
      return (
        <DataSourceSelector
          wizardData={wizardData}
          onUpdate={onUpdate}
          onValidationChange={(isValid) => onValidationChange(0, isValid)}
        />
      );
    case 1:
      return (
        <DomainGroupSetup
          wizardData={wizardData}
          onUpdate={onUpdate}
          onValidationChange={(isValid) => onValidationChange(1, isValid)}
        />
      );
    case 2:
      return (
        <DataEntryStep
          wizardData={wizardData}
          onUpdate={onUpdate}
          onValidationChange={(isValid) => onValidationChange(2, isValid)}
        />
      );
    case 3:
      return (
        <ReviewAndSubmit
          wizardData={wizardData}
          existingData={existingData}
          onUpdate={onUpdate}
          onSubmit={onSubmit}
          onValidationChange={(isValid) => onValidationChange(3, isValid)}
        />
      );
    default:
      return null;
  }
};

export default WizardStepContent;
