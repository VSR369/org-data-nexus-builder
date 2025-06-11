
import React from 'react';
import { WizardData } from '@/types/wizardTypes';
import ManualDataEntry from './ManualDataEntry';

interface DataEntryStepProps {
  wizardData: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const DataEntryStep: React.FC<DataEntryStepProps> = ({
  wizardData,
  onUpdate,
  onValidationChange
}) => {
  console.log('DataEntryStep: Rendering with dataSource:', wizardData.dataSource);

  const renderDataEntryComponent = () => {
    if (wizardData.dataSource === 'manual') {
      console.log('DataEntryStep: Rendering ManualDataEntry');
      return (
        <ManualDataEntry
          wizardData={wizardData}
          onUpdate={onUpdate}
          onValidationChange={onValidationChange}
        />
      );
    } else {
      console.log('DataEntryStep: No valid dataSource, showing fallback');
      return (
        <div className="text-center p-8">
          <p className="text-muted-foreground">
            Please select a data source method in the previous step.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Manual Data Entry</h2>
        <p className="text-muted-foreground">
          Add categories and sub-categories manually
        </p>
      </div>

      {renderDataEntryComponent()}
    </div>
  );
};

export default DataEntryStep;
