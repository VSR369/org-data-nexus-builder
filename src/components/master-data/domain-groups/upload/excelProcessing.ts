
import * as XLSX from 'xlsx';

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

export const STORAGE_KEY = 'domain_group_excel_document';

export const processExcelFile = async (file: File): Promise<{
  excelData: string[][];
  processingResult: ProcessingResult;
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Get the range to find the last row with data
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        const jsonData: string[][] = [];
        
        // Process all rows from 0 to the last row with data
        for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
          const row: string[] = [];
          let hasData = false;
          
          // Check each column in the row
          for (let colNum = range.s.c; colNum <= Math.max(range.e.c, 3); colNum++) {
            const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
            const cell = worksheet[cellAddress];
            const value = cell ? String(cell.v || '').trim() : '';
            row.push(value);
            if (value) hasData = true;
          }
          
          // Only add rows that have some data
          if (hasData) {
            jsonData.push(row);
          }
        }

        const processingResult: ProcessingResult = {
          totalRows: jsonData.length - 1, // Exclude header
          validRows: 0,
          errors: [],
          warnings: []
        };

        resolve({ excelData: jsonData, processingResult });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const parseExcelToHierarchy = (
  data: string[][], 
  processingResult: ProcessingResult
): { parsed: ParsedExcelData[], hierarchy: HierarchyData, processingResult: ProcessingResult } => {
  if (!data || data.length < 2) {
    return { 
      parsed: [], 
      hierarchy: {}, 
      processingResult: { 
        totalRows: 0, 
        validRows: 0, 
        errors: ['No data found in Excel file'], 
        warnings: [] 
      } 
    };
  }

  const headers = data[0];
  const rows = data.slice(1);
  
  const parsed: ParsedExcelData[] = [];
  const hierarchy: HierarchyData = {};

  rows.forEach((row, index) => {
    const rowNumber = index + 2; // Excel row number (1-based + header)
    const errors: string[] = [];
    
    // Validate required columns
    const industrySegment = (row[0] || '').trim();
    const domainGroup = (row[1] || '').trim();
    const category = (row[2] || '').trim();
    const subCategory = (row[3] || '').trim();

    if (!industrySegment) errors.push('Industry Segment is required');
    if (!domainGroup) errors.push('Domain Group is required');
    if (!category) errors.push('Category is required');
    if (!subCategory) errors.push('Sub-Category is required');

    const item: ParsedExcelData = {
      industrySegment,
      domainGroup,
      category,
      subCategory,
      rowNumber,
      isValid: errors.length === 0,
      errors
    };
    
    parsed.push(item);

    if (item.isValid) {
      processingResult.validRows++;
      
      // Build hierarchy structure
      if (!hierarchy[item.industrySegment]) {
        hierarchy[item.industrySegment] = {};
      }
      if (!hierarchy[item.industrySegment][item.domainGroup]) {
        hierarchy[item.industrySegment][item.domainGroup] = {};
      }
      if (!hierarchy[item.industrySegment][item.domainGroup][item.category]) {
        hierarchy[item.industrySegment][item.domainGroup][item.category] = [];
      }
      
      if (!hierarchy[item.industrySegment][item.domainGroup][item.category].includes(item.subCategory)) {
        hierarchy[item.industrySegment][item.domainGroup][item.category].push(item.subCategory);
      }
    } else {
      processingResult.errors.push(`Row ${rowNumber}: ${errors.join(', ')}`);
    }
  });

  // Add warnings for empty rows that were skipped
  if (processingResult.totalRows > rows.length) {
    processingResult.warnings.push(`${processingResult.totalRows - rows.length} empty rows were skipped`);
  }

  return { parsed, hierarchy, processingResult };
};

export const saveDocument = (
  file: File, 
  excelData: string[][], 
  parsedData: ParsedExcelData[], 
  hierarchyData: HierarchyData,
  processingResult: ProcessingResult
): SavedExcelDocument => {
  const documentToSave: SavedExcelDocument = {
    fileName: file.name,
    fileSize: file.size,
    uploadDate: new Date().toISOString(),
    excelData,
    parsedData,
    hierarchyData,
    processingResult,
    dataSource: 'excel'
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(documentToSave));
  console.log('💾 Excel document saved successfully:', file.name);
  return documentToSave;
};

export const loadSavedDocument = (): SavedExcelDocument | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const document: SavedExcelDocument = JSON.parse(saved);
      console.log('✅ Loaded saved Excel document:', document.fileName);
      return document;
    }
  } catch (error) {
    console.error('❌ Error loading saved document:', error);
  }
  return null;
};

export const clearSavedDocument = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  console.log('🗑️ Cleared saved Excel document and all associated data');
};

export const deleteExcelFile = (): void => {
  clearSavedDocument();
  console.log('🗑️ Deleted Excel file and all tree-structured data from storage');
};
