
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
        console.log('🔄 Starting Excel file processing...');
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        console.log('📊 Worksheet loaded:', firstSheetName);
        
        // Get the range to find the last row with data
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        console.log('📐 Excel range:', range);
        
        const jsonData: string[][] = [];
        
        // Process all rows from 0 to the last row with data
        for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
          const row: string[] = [];
          let hasData = false;
          
          // Check each column in the row (ensure we check at least 4 columns for the required data)
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
            console.log(`📝 Row ${rowNum + 1}:`, row);
          }
        }

        console.log(`✅ Processed ${jsonData.length} rows with data`);

        const processingResult: ProcessingResult = {
          totalRows: jsonData.length > 0 ? jsonData.length - 1 : 0, // Exclude header if exists
          validRows: 0,
          errors: [],
          warnings: []
        };

        resolve({ excelData: jsonData, processingResult });
      } catch (error) {
        console.error('❌ Excel processing error:', error);
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
  console.log('🔄 Starting Excel data parsing...');
  console.log('📊 Input data:', data);
  
  if (!data || data.length < 2) {
    console.warn('⚠️ No sufficient data found in Excel file');
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
  
  console.log('📋 Headers:', headers);
  console.log(`📊 Data rows to process: ${rows.length}`);
  
  const parsed: ParsedExcelData[] = [];
  const hierarchy: HierarchyData = {};
  let validRowCount = 0;

  rows.forEach((row, index) => {
    const rowNumber = index + 2; // Excel row number (1-based + header)
    const errors: string[] = [];
    
    console.log(`🔍 Processing row ${rowNumber}:`, row);
    
    // Validate required columns - ensure we trim whitespace
    const industrySegment = (row[0] || '').toString().trim();
    const domainGroup = (row[1] || '').toString().trim();
    const category = (row[2] || '').toString().trim();
    const subCategory = (row[3] || '').toString().trim();

    console.log(`📝 Parsed values - IS: "${industrySegment}", DG: "${domainGroup}", Cat: "${category}", Sub: "${subCategory}"`);

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
      validRowCount++;
      console.log(`✅ Valid row ${rowNumber}: Building hierarchy...`);
      
      // Build hierarchy structure
      if (!hierarchy[item.industrySegment]) {
        hierarchy[item.industrySegment] = {};
        console.log(`🏗️ Created industry segment: ${item.industrySegment}`);
      }
      if (!hierarchy[item.industrySegment][item.domainGroup]) {
        hierarchy[item.industrySegment][item.domainGroup] = {};
        console.log(`🏗️ Created domain group: ${item.domainGroup}`);
      }
      if (!hierarchy[item.industrySegment][item.domainGroup][item.category]) {
        hierarchy[item.industrySegment][item.domainGroup][item.category] = [];
        console.log(`🏗️ Created category: ${item.category}`);
      }
      
      if (!hierarchy[item.industrySegment][item.domainGroup][item.category].includes(item.subCategory)) {
        hierarchy[item.industrySegment][item.domainGroup][item.category].push(item.subCategory);
        console.log(`🏗️ Added sub-category: ${item.subCategory}`);
      } else {
        console.log(`⚠️ Duplicate sub-category skipped: ${item.subCategory}`);
      }
    } else {
      console.error(`❌ Invalid row ${rowNumber}:`, errors);
      processingResult.errors.push(`Row ${rowNumber}: ${errors.join(', ')}`);
    }
  });

  processingResult.validRows = validRowCount;
  processingResult.totalRows = rows.length;

  console.log('✅ Parsing complete:');
  console.log(`📊 Total rows: ${processingResult.totalRows}`);
  console.log(`✅ Valid rows: ${processingResult.validRows}`);
  console.log(`❌ Errors: ${processingResult.errors.length}`);
  console.log('🏗️ Final hierarchy:', hierarchy);

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
