
import React from 'react';
import { WizardData } from '@/types/wizardTypes';
import ExcelUploader from './ExcelUploader';
import ManualDataEntry from './ManualDataEntry';
import TemplateSelector from './TemplateSelector';

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
  const renderDataEntryComponent = () => {
    switch (wizardData.dataSource) {
      case 'excel':
        return (
          <ExcelUploader
            wizardData={wizardData}
            onUpdate={onUpdate}
            onValidationChange={onValidationChange}
          />
        );
      case 'manual':
        return (
          <ManualDataEntry
            wizardData={wizardData}
            onUpdate={onUpdate}
            onValidationChange={onValidationChange}
          />
        );
      case 'template':
        return (
          <TemplateSelector
            wizardData={wizardData}
            onUpdate={onUpdate}
            onValidationChange={onValidationChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">
          {wizardData.dataSource === 'excel' && 'Upload Excel File'}
          {wizardData.dataSource === 'manual' && 'Manual Data Entry'}
          {wizardData.dataSource === 'template' && 'Select Template'}
        </h2>
        <p className="text-muted-foreground">
          {wizardData.dataSource === 'excel' && 'Upload your Excel file with domain group hierarchy'}
          {wizardData.dataSource === 'manual' && 'Add categories and sub-categories manually'}
          {wizardData.dataSource === 'template' && 'Choose from pre-built industry templates'}
        </p>
      </div>

      {renderDataEntryComponent()}
    </div>
  );
};

export default DataEntryStep;
