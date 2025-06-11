
import * as XLSX from 'xlsx';
import { ExcelUploadData, ParsedExcelData, ExcelValidationError } from '@/types/wizardTypes';

export const EXCEL_TEMPLATE_HEADERS = [
  'Industry Segment',
  'Domain Group Name',
  'Domain Group Description',
  'Category Name', 
  'Category Description',
  'Sub-Category Name',
  'Sub-Category Description',
  'Is Active'
];

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
  const data: ExcelUploadData[] = [];
  const errors: ExcelValidationError[] = [];
  const warnings: string[] = [];
  
  if (rawData.length === 0) {
    errors.push({
      row: 0,
      column: 'A',
      field: 'file',
      message: 'Excel file is empty',
      severity: 'error'
    });
    return { data, errors, warnings };
  }
  
  // Validate headers
  const headers = rawData[0];
  const requiredHeaders = ['Industry Segment', 'Domain Group Name', 'Category Name', 'Sub-Category Name'];
  
  for (const required of requiredHeaders) {
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
  
  if (errors.length > 0) {
    return { data, errors, warnings };
  }
  
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
    
    data.push(rowData);
  }
  
  return { data, errors, warnings };
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

export const generateExcelTemplate = (industrySegments: { industrySegment: string }[]): Uint8Array => {
  const templateData = [
    EXCEL_TEMPLATE_HEADERS,
    // Add sample row for each industry segment
    ...industrySegments.map(segment => [
      segment.industrySegment,
      'Sample Domain Group',
      'Description for domain group',
      'Sample Category',
      'Description for category', 
      'Sample Sub-Category',
      'Description for sub-category',
      'TRUE'
    ])
  ];
  
  const worksheet = XLSX.utils.aoa_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Domain Groups Template');
  
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
};

export const exportHierarchyToExcel = (domainGroupsData: any): Uint8Array => {
  const exportData = [EXCEL_TEMPLATE_HEADERS];
  
  domainGroupsData.domainGroups?.forEach((domainGroup: any) => {
    const categories = domainGroupsData.categories?.filter((cat: any) => cat.domainGroupId === domainGroup.id) || [];
    
    categories.forEach((category: any) => {
      const subCategories = domainGroupsData.subCategories?.filter((sub: any) => sub.categoryId === category.id) || [];
      
      subCategories.forEach((subCategory: any) => {
        exportData.push([
          domainGroup.industrySegmentName || '',
          domainGroup.name,
          domainGroup.description || '',
          category.name,
          category.description || '',
          subCategory.name,
          subCategory.description || '',
          subCategory.isActive ? 'TRUE' : 'FALSE'
        ]);
      });
    });
  });
  
  const worksheet = XLSX.utils.aoa_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Domain Groups Export');
  
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
};
