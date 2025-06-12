
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
    
    // Extract and clean data - ensure proper string conversion and trimming
    const industrySegment = String(row[0] || '').trim();
    const domainGroup = String(row[1] || '').trim();
    const category = String(row[2] || '').trim();
    const subCategory = String(row[3] || '').trim();

    console.log(`📝 Cleaned values - IS: "${industrySegment}", DG: "${domainGroup}", Cat: "${category}", Sub: "${subCategory}"`);

    // Validation logic - require all 4 fields for complete hierarchy
    if (!industrySegment) errors.push('Industry Segment is required');
    if (!domainGroup) errors.push('Domain Group is required');
    if (!category) errors.push('Category is required');
    if (!subCategory) errors.push('Sub-Category is required');
    
    // A row is valid only if all required fields are present
    const isValid = industrySegment && domainGroup && category && subCategory;

    const item: ParsedExcelData = {
      industrySegment,
      domainGroup,
      category,
      subCategory,
      rowNumber,
      isValid: Boolean(isValid), // Ensure proper boolean type
      errors
    };
    
    parsed.push(item);

    // Build hierarchy only for completely valid rows
    if (isValid) {
      validRowCount++;
      console.log(`✅ Processing valid row ${rowNumber}: Building hierarchy...`);
      
      // Build hierarchy structure step by step
      if (!hierarchy[industrySegment]) {
        hierarchy[industrySegment] = {};
        console.log(`🏗️ Created industry segment: ${industrySegment}`);
      }
      
      if (!hierarchy[industrySegment][domainGroup]) {
        hierarchy[industrySegment][domainGroup] = {};
        console.log(`🏗️ Created domain group: ${domainGroup}`);
      }
      
      if (!hierarchy[industrySegment][domainGroup][category]) {
        hierarchy[industrySegment][domainGroup][category] = [];
        console.log(`🏗️ Created category: ${category}`);
      }
      
      // Add subcategory if not already present
      if (!hierarchy[industrySegment][domainGroup][category].includes(subCategory)) {
        hierarchy[industrySegment][domainGroup][category].push(subCategory);
        console.log(`🏗️ Added sub-category: ${subCategory} to category ${category}`);
      } else {
        console.log(`⚠️ Duplicate sub-category skipped: ${subCategory}`);
      }
    } else {
      console.error(`❌ Invalid row ${rowNumber}:`, errors);
      processingResult.errors.push(`Row ${rowNumber}: ${errors.join(', ')}`);
    }
  });

  // Update processing results
  processingResult.validRows = validRowCount;
  processingResult.totalRows = rows.length;

  console.log('✅ Parsing complete:');
  console.log(`📊 Total rows: ${processingResult.totalRows}`);
  console.log(`✅ Valid rows: ${processingResult.validRows}`);
  console.log(`❌ Errors: ${processingResult.errors.length}`);
  console.log('🏗️ Final hierarchy structure:');
  console.log(JSON.stringify(hierarchy, null, 2));

  // Log detailed hierarchy stats
  const industryCount = Object.keys(hierarchy).length;
  const domainGroupCount = Object.values(hierarchy).reduce((sum, dgs) => sum + Object.keys(dgs).length, 0);
  const categoryCount = Object.values(hierarchy).reduce((sum, dgs) => 
    sum + Object.values(dgs).reduce((catSum, cats) => catSum + Object.keys(cats).length, 0), 0);
  const subCategoryCount = Object.values(hierarchy).reduce((sum, dgs) => 
    sum + Object.values(dgs).reduce((catSum, cats) => 
      catSum + Object.values(cats).reduce((subSum, subs) => subSum + subs.length, 0), 0), 0);

  console.log(`📈 Hierarchy Stats: ${industryCount} Industries, ${domainGroupCount} Domain Groups, ${categoryCount} Categories, ${subCategoryCount} Sub-Categories`);

  return { parsed, hierarchy, processingResult };
};
