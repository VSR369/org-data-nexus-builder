
import { ParsedExcelData, HierarchyData, ProcessingResult } from './types';

export const parseExcelToHierarchy = (
  data: string[][], 
  processingResult: ProcessingResult
): { parsed: ParsedExcelData[], hierarchy: HierarchyData, processingResult: ProcessingResult } => {
  console.log('🔄 Starting Excel data parsing with correct column mapping...');
  console.log('📊 Input data rows:', data.length);
  
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
  
  console.log('📋 Headers detected:', headers);
  console.log(`📊 Data rows to process: ${rows.length}`);
  
  // Analyze the data structure first
  console.log('🔍 Analyzing column structure:');
  console.log('Column A (0): Industry Segment');
  console.log('Column B (1): Domain Group'); 
  console.log('Column C (2): Unknown/Empty');
  console.log('Column D (3): Category');
  console.log('Column E (4): Unknown/Empty');
  console.log('Column F (5): Sub-Category');
  
  const parsed: ParsedExcelData[] = [];
  const hierarchy: HierarchyData = {};
  let validRowCount = 0;

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const errors: string[] = [];
    
    console.log(`🔍 Processing row ${rowNumber}:`, row);
    
    // Extract data from CORRECT columns based on your Excel format:
    // Column A (0): Industry Segment
    // Column B (1): Domain Group
    // Column D (3): Category (NOT column C!)
    // Column F (5): Sub-Category (NOT column D!)
    const industrySegment = String(row[0] || '').trim();
    const domainGroup = String(row[1] || '').trim();
    const category = String(row[3] || '').trim(); // Column D (index 3)
    const subCategory = String(row[5] || '').trim(); // Column F (index 5)

    console.log(`📝 Extracted values - IS: "${industrySegment}", DG: "${domainGroup}", Cat: "${category}", Sub: "${subCategory}"`);

    // Validation - require all four fields for a complete entry
    if (!industrySegment) {
      errors.push('Industry Segment is required');
    }
    if (!domainGroup) {
      errors.push('Domain Group is required');
    }
    if (!category) {
      errors.push('Category is required');
    }
    if (!subCategory) {
      errors.push('Sub-Category is required');
    }
    
    // A row is valid if it has all required fields
    const isValid = Boolean(industrySegment && domainGroup && category && subCategory);

    const item: ParsedExcelData = {
      industrySegment,
      domainGroup,
      category,
      subCategory,
      rowNumber,
      isValid,
      errors
    };
    
    parsed.push(item);

    // Build hierarchy for valid rows
    if (isValid) {
      validRowCount++;
      console.log(`✅ Processing VALID row ${rowNumber}: Building hierarchy...`);
      
      // Build hierarchy structure step by step
      if (!hierarchy[industrySegment]) {
        hierarchy[industrySegment] = {};
        console.log(`🏗️ Created NEW industry segment: "${industrySegment}"`);
      }
      
      if (!hierarchy[industrySegment][domainGroup]) {
        hierarchy[industrySegment][domainGroup] = {};
        console.log(`🏗️ Created NEW domain group: "${domainGroup}" under "${industrySegment}"`);
      }
      
      if (!hierarchy[industrySegment][domainGroup][category]) {
        hierarchy[industrySegment][domainGroup][category] = [];
        console.log(`🏗️ Created NEW category: "${category}" under "${domainGroup}"`);
      }
      
      // Add subcategory if not already present
      if (!hierarchy[industrySegment][domainGroup][category].includes(subCategory)) {
        hierarchy[industrySegment][domainGroup][category].push(subCategory);
        console.log(`🏗️ Added NEW sub-category: "${subCategory}" to category "${category}"`);
      } else {
        console.log(`⚠️ Sub-category "${subCategory}" already exists in category "${category}"`);
      }
      
      // Log current state of this branch
      console.log(`📊 Current hierarchy for "${industrySegment}" > "${domainGroup}" > "${category}":`, hierarchy[industrySegment][domainGroup][category]);
      
    } else {
      console.error(`❌ INVALID row ${rowNumber} - missing required fields:`, {
        industrySegment: !!industrySegment,
        domainGroup: !!domainGroup,
        category: !!category,
        subCategory: !!subCategory,
        errors
      });
      processingResult.errors.push(`Row ${rowNumber}: ${errors.join(', ')}`);
    }
  });

  // Update processing results
  processingResult.validRows = validRowCount;
  processingResult.totalRows = rows.length;

  console.log('✅ Parsing complete - FINAL RESULTS:');
  console.log(`📊 Total rows processed: ${processingResult.totalRows}`);
  console.log(`✅ Valid rows: ${processingResult.validRows}`);
  console.log(`❌ Invalid rows: ${processingResult.totalRows - processingResult.validRows}`);
  console.log(`🔥 FINAL HIERARCHY STRUCTURE:`);
  
  // Log detailed hierarchy breakdown
  Object.entries(hierarchy).forEach(([industry, domainGroups]) => {
    console.log(`🏭 Industry: ${industry}`);
    Object.entries(domainGroups).forEach(([domainGroup, categories]) => {
      console.log(`  🏢 Domain Group: ${domainGroup}`);
      Object.entries(categories).forEach(([category, subCategories]) => {
        console.log(`    📁 Category: ${category} (${subCategories.length} sub-categories)`);
        subCategories.forEach((sub, idx) => {
          console.log(`      📝 ${idx + 1}. ${sub}`);
        });
      });
    });
  });

  // Final stats
  const industryCount = Object.keys(hierarchy).length;
  const domainGroupCount = Object.values(hierarchy).reduce((sum, dgs) => sum + Object.keys(dgs).length, 0);
  const categoryCount = Object.values(hierarchy).reduce((sum, dgs) => 
    sum + Object.values(dgs).reduce((catSum, cats) => catSum + Object.keys(cats).length, 0), 0);
  const subCategoryCount = Object.values(hierarchy).reduce((sum, dgs) => 
    sum + Object.values(dgs).reduce((catSum, cats) => 
      catSum + Object.values(cats).reduce((subSum, subs) => subSum + subs.length, 0), 0), 0);

  console.log(`📈 FINAL HIERARCHY STATS: ${industryCount} Industries, ${domainGroupCount} Domain Groups, ${categoryCount} Categories, ${subCategoryCount} Sub-Categories`);

  return { parsed, hierarchy, processingResult };
};
