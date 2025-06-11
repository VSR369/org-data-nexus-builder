
import * as XLSX from 'xlsx';
import { ExcelUploadData, ParsedExcelData } from '@/types/wizardTypes';
import { validateExcelData } from './validator';

export const parseExcelFile = async (file: File): Promise<ParsedExcelData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        const result = processExcelData(jsonData as any[][]);
        resolve(result);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error.message}`));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
};

const processExcelData = (rawData: any[][]): ParsedExcelData => {
  if (rawData.length === 0) {
    return {
      data: [],
      errors: [{
        row: 0,
        column: 'A',
        field: 'file',
        message: 'Excel file is empty',
        severity: 'error'
      }],
      warnings: []
    };
  }

  const validationResult = validateExcelData(rawData);
  if (validationResult.errors.length > 0) {
    return validationResult;
  }

  const data: ExcelUploadData[] = [];
  const errors = validationResult.errors;
  const warnings = validationResult.warnings;

  // Process data rows
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    const rowNum = i + 1;
    
    if (row.length === 0 || !row.some(cell => cell)) {
      continue; // Skip empty rows
    }
    
    const rowData: ExcelUploadData = {
      industrySegment: String(row[0] || '').trim(),
      domainGroup: String(row[1] || '').trim(),
      domainGroupDescription: String(row[2] || '').trim(),
      category: String(row[3] || '').trim(),
      categoryDescription: String(row[4] || '').trim(),
      subCategory: String(row[5] || '').trim(),
      subCategoryDescription: String(row[6] || '').trim(),
      isActive: parseBoolean(row[7])
    };
    
    // Validate required fields
    validateRowData(rowData, rowNum, errors);
    data.push(rowData);
  }
  
  return { data, errors, warnings };
};

const validateRowData = (rowData: ExcelUploadData, rowNum: number, errors: any[]) => {
  if (!rowData.industrySegment) {
    errors.push({
      row: rowNum,
      column: 'A',
      field: 'industrySegment',
      message: 'Industry Segment is required',
      severity: 'error'
    });
  }
  
  if (!rowData.domainGroup) {
    errors.push({
      row: rowNum,
      column: 'B', 
      field: 'domainGroup',
      message: 'Domain Group Name is required',
      severity: 'error'
    });
  }
  
  if (!rowData.category) {
    errors.push({
      row: rowNum,
      column: 'D',
      field: 'category',
      message: 'Category Name is required',
      severity: 'error'
    });
  }
  
  if (!rowData.subCategory) {
    errors.push({
      row: rowNum,
      column: 'F',
      field: 'subCategory', 
      message: 'Sub-Category Name is required',
      severity: 'error'
    });
  }
};

const parseBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return lower === 'true' || lower === 'yes' || lower === '1';
  }
  if (typeof value === 'number') return value === 1;
  return true; // Default to active
};
