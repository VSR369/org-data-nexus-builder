
import { ParsedExcelData, ExcelValidationError } from '@/types/wizardTypes';
import { REQUIRED_HEADERS } from './constants';

export const validateExcelData = (rawData: any[][]): ParsedExcelData => {
  const data: any[] = [];
  const errors: ExcelValidationError[] = [];
  const warnings: string[] = [];
  
  // Validate headers
  const headers = rawData[0];
  
  for (const required of REQUIRED_HEADERS) {
    if (!headers.includes(required)) {
      errors.push({
        row: 1,
        column: 'A',
        field: 'headers',
        message: `Missing required column: ${required}`,
        severity: 'error'
      });
    }
  }
  
  return { data, errors, warnings };
};
