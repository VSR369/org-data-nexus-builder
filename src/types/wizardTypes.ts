
export interface WizardStep {
  id: string;
  title: string;
  description: string;
  isValid: boolean;
  isCompleted: boolean;
}

export interface ExcelUploadData {
  industrySegment: string;
  domainGroup: string;
  domainGroupDescription?: string;
  category: string;
  categoryDescription?: string;
  subCategory: string;
  subCategoryDescription?: string;
  isActive: boolean;
}

export interface ParsedExcelData {
  data: ExcelUploadData[];
  errors: ExcelValidationError[];
  warnings: string[];
}

export interface ExcelValidationError {
  row: number;
  column: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface WizardData {
  step: number;
  dataSource: 'manual' | 'excel' | 'template';
  selectedIndustrySegment: string;
  selectedDomainGroup?: string;
  selectedTemplate?: string;
  excelData?: ParsedExcelData;
  manualData?: {
    domainGroups: any[];
    categories: any[];
    subCategories: any[];
  };
  isValid: boolean;
}
