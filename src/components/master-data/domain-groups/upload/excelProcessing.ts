
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
          let hasAnyData = false;
          
          // Check each column in the row (ensure we check at least 4 columns for the required data)
          for (let colNum = range.s.c; colNum <= Math.max(range.e.c, 3); colNum++) {
            const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
            const cell = worksheet[cellAddress];
            const value = cell ? String(cell.v || '').trim() : '';
            row.push(value);
            if (value) hasAnyData = true;
          }
          
          // For data rows (not header), we need at least the first 4 columns to have meaningful hierarchy data
          // But we should be more lenient - if at least 2 of the 4 required columns have data, include the row
          if (rowNum === range.s.r) {
            // Always include header row
            jsonData.push(row);
            console.log(`📝 Header row ${rowNum + 1}:`, row);
          } else if (hasAnyData) {
            // For data rows, check if we have meaningful hierarchy data
            const industrySegment = (row[0] || '').toString().trim();
            const domainGroup = (row[1] || '').toString().trim();
            const category = (row[2] || '').toString().trim();
            const subCategory = (row[3] || '').toString().trim();
            
            // Include row if at least 2 of the 4 main columns have data
            const nonEmptyColumns = [industrySegment, domainGroup, category, subCategory].filter(val => val).length;
            
            if (nonEmptyColumns >= 2) {
              jsonData.push(row);
              console.log(`📝 Data row ${rowNum + 1} (${nonEmptyColumns} columns filled):`, row);
            } else {
              console.log(`⚠️ Skipping row ${rowNum + 1} - insufficient data (${nonEmptyColumns} columns):`, row);
            }
          }
        }

        console.log(`✅ Processed ${jsonData.length} total rows (including header)`);

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

    // More flexible validation - allow missing values but require at least industry segment and domain group
    if (!industrySegment) errors.push('Industry Segment is required');
    if (!domainGroup) errors.push('Domain Group is required');
    
    // If we have industry segment and domain group, but missing category/subcategory, 
    // we can still create a partial hierarchy entry
    const hasMinimumData = industrySegment && domainGroup;
    
    if (!hasMinimumData) {
      errors.push('Minimum required: Industry Segment and Domain Group');
    }
    
    // For complete hierarchy, we need all 4 fields
    if (!category && hasMinimumData) {
      errors.push('Category is recommended for complete hierarchy');
    }
    if (!subCategory && hasMinimumData && category) {
      errors.push('Sub-Category is recommended for complete hierarchy');
    }

    const item: ParsedExcelData = {
      industrySegment,
      domainGroup,
      category,
      subCategory,
      rowNumber,
      isValid: hasMinimumData && category && subCategory, // Only fully valid if all 4 fields present
      errors
    };
    
    parsed.push(item);

    // Build hierarchy even for partially valid data (if we have minimum data)
    if (hasMinimumData) {
      validRowCount++;
      console.log(`✅ Processing row ${rowNumber}: Building hierarchy...`);
      
      // Build hierarchy structure
      if (!hierarchy[item.industrySegment]) {
        hierarchy[item.industrySegment] = {};
        console.log(`🏗️ Created industry segment: ${item.industrySegment}`);
      }
      if (!hierarchy[item.industrySegment][item.domainGroup]) {
        hierarchy[item.industrySegment][item.domainGroup] = {};
        console.log(`🏗️ Created domain group: ${item.domainGroup}`);
      }
      
      // Only add category and subcategory if they exist
      if (item.category) {
        if (!hierarchy[item.industrySegment][item.domainGroup][item.category]) {
          hierarchy[item.industrySegment][item.domainGroup][item.category] = [];
          console.log(`🏗️ Created category: ${item.category}`);
        }
        
        if (item.subCategory && !hierarchy[item.industrySegment][item.domainGroup][item.category].includes(item.subCategory)) {
          hierarchy[item.industrySegment][item.domainGroup][item.category].push(item.subCategory);
          console.log(`🏗️ Added sub-category: ${item.subCategory}`);
        } else if (item.subCategory) {
          console.log(`⚠️ Duplicate sub-category skipped: ${item.subCategory}`);
        }
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

  // Add warnings for rows with partial data
  const partialRows = parsed.filter(p => !p.isValid && (p.industrySegment || p.domainGroup)).length;
  if (partialRows > 0) {
    processingResult.warnings.push(`${partialRows} rows had partial data and were included where possible`);
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
