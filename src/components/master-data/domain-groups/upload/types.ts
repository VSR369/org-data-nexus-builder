
export interface ParsedExcelData {
  industrySegment: string;
  domainGroup: string;
  category: string;
  subCategory: string;
  rowNumber: number;
  isValid: boolean;
  errors: string[];
}

export interface HierarchyData {
  [industrySegment: string]: {
    [domainGroup: string]: {
      [category: string]: string[];
    };
  };
}

export interface ProcessingResult {
  totalRows: number;
  validRows: number;
  errors: string[];
  warnings: string[];
}

export interface SavedExcelDocument {
  fileName: string;
  fileSize: number;
  uploadDate: string;
  excelData: string[][];
  parsedData: ParsedExcelData[];
  hierarchyData: HierarchyData;
  processingResult: ProcessingResult;
  dataSource: 'excel';
}
