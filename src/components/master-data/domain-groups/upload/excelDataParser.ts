
import { ParsedExcelData, HierarchyData, ProcessingResult } from './types';

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

    const isValid = hasMinimumData && !!category && !!subCategory; // Fix: ensure boolean type

    const item: ParsedExcelData = {
      industrySegment,
      domainGroup,
      category,
      subCategory,
      rowNumber,
      isValid, // This is now properly boolean
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
