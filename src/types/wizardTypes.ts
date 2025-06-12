
export interface WizardStep {
  id: string;
  title: string;
  description: string;
  isValid: boolean;
  isCompleted: boolean;
}

export interface WizardData {
  step: number;
  dataSource: 'manual';
  selectedIndustrySegment: string;
  selectedDomainGroup?: string;
  existingDataViewed?: boolean;
  hasExistingData?: boolean;
  manualData?: {
    domainGroupDescription?: string;
    categories: Array<{
      name: string;
      description?: string;
    }>;
    subCategories: Array<{
      name: string;
      description?: string;
      categoryName: string;
    }>;
  };
  isValid: boolean;
}
