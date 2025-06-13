
import { ParsedExcelData, HierarchyData, ProcessingResult } from './types';

export const parseExcelToHierarchy = (
  data: string[][], 
  processingResult: ProcessingResult
): { parsed: ParsedExcelData[], hierarchy: HierarchyData, processingResult: ProcessingResult } => {
  console.log('🔄 Starting Excel data parsing with CORRECT hierarchy building...');
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
  
  // Track unique elements for accurate counting
  const uniqueIndustrySegments = new Set<string>();
  const uniqueDomainGroups = new Set<string>();
  const uniqueCategories = new Set<string>();
  const uniqueSubCategories = new Set<string>();
  
  const parsed: ParsedExcelData[] = [];
  const hierarchy: HierarchyData = {};
  let validRowCount = 0;

  console.log('🔍 Processing each row to build hierarchy with unique grouping...');

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const errors: string[] = [];
    
    console.log(`🔍 Processing row ${rowNumber}:`, row);
    
    // Extract data from CORRECT columns:
    // Column A (0): Industry Segment
    // Column B (1): Domain Group  
    // Column D (3): Category
    // Column F (5): Sub-Category
    const industrySegment = String(row[0] || '').trim();
    const domainGroup = String(row[1] || '').trim();
    const category = String(row[3] || '').trim();
    const subCategory = String(row[5] || '').trim();

    console.log(`📝 Row ${rowNumber} - IS: "${industrySegment}", DG: "${domainGroup}", Cat: "${category}", Sub: "${subCategory}"`);

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

    // Build hierarchy for valid rows - handling duplicates correctly
    if (isValid) {
      validRowCount++;
      
      // Track unique elements
      uniqueIndustrySegments.add(industrySegment);
      uniqueDomainGroups.add(domainGroup);
      uniqueCategories.add(category);
      uniqueSubCategories.add(subCategory);
      
      console.log(`✅ Processing VALID row ${rowNumber}: Building hierarchy...`);
      
      // Build hierarchy structure - only create if doesn't exist
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
      
      // Add subcategory ONLY if not already present (avoid duplicates)
      if (!hierarchy[industrySegment][domainGroup][category].includes(subCategory)) {
        hierarchy[industrySegment][domainGroup][category].push(subCategory);
        console.log(`🏗️ Added NEW sub-category: "${subCategory}" to category "${category}"`);
      } else {
        console.log(`⚠️ Sub-category "${subCategory}" already exists in category "${category}" - skipping duplicate`);
      }
      
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

  console.log('✅ Parsing complete - FINAL RESULTS WITH UNIQUE COUNTS:');
  console.log(`📊 Total Excel rows processed: ${processingResult.totalRows}`);
  console.log(`✅ Valid rows: ${processingResult.validRows}`);
  console.log(`❌ Invalid rows: ${processingResult.totalRows - processingResult.validRows}`);
  
  // Log UNIQUE counts as expected by user
  console.log(`🎯 UNIQUE ELEMENTS FOUND:`);
  console.log(`🏭 Industry Segments: ${uniqueIndustrySegments.size} (${Array.from(uniqueIndustrySegments).join(', ')})`);
  console.log(`🏢 Domain Groups: ${uniqueDomainGroups.size} (${Array.from(uniqueDomainGroups).join(', ')})`);
  console.log(`📁 Categories: ${uniqueCategories.size}`);
  console.log(`📝 Sub-Categories: ${uniqueSubCategories.size}`);
  
  console.log(`🔥 FINAL HIERARCHY STRUCTURE:`);
  
  // Log detailed hierarchy breakdown with counts
  Object.entries(hierarchy).forEach(([industry, domainGroups]) => {
    console.log(`🏭 Industry: ${industry}`);
    Object.entries(domainGroups).forEach(([domainGroup, categories]) => {
      console.log(`  🏢 Domain Group: ${domainGroup} (${Object.keys(categories).length} categories)`);
      Object.entries(categories).forEach(([category, subCategories]) => {
        console.log(`    📁 Category: ${category} (${subCategories.length} sub-categories)`);
        subCategories.forEach((sub, idx) => {
          console.log(`      📝 ${idx + 1}. ${sub}`);
        });
      });
    });
  });

  // Verify the counts match expectations
  const hierarchyStats = {
    industrySegments: Object.keys(hierarchy).length,
    domainGroups: Object.values(hierarchy).reduce((sum, dgs) => sum + Object.keys(dgs).length, 0),
    categories: Object.values(hierarchy).reduce((sum, dgs) => 
      sum + Object.values(dgs).reduce((catSum, cats) => catSum + Object.keys(cats).length, 0), 0),
    subCategories: Object.values(hierarchy).reduce((sum, dgs) => 
      sum + Object.values(dgs).reduce((catSum, cats) => 
        catSum + Object.values(cats).reduce((subSum, subs) => subSum + subs.length, 0), 0), 0)
  };

  console.log(`📈 FINAL HIERARCHY STATS:`);
  console.log(`🏭 ${hierarchyStats.industrySegments} Industry Segments (Expected: 1)`);
  console.log(`🏢 ${hierarchyStats.domainGroups} Domain Groups (Expected: 4)`);  
  console.log(`📁 ${hierarchyStats.categories} Categories (Expected: 15)`);
  console.log(`📝 ${hierarchyStats.subCategories} Sub-Categories (Expected: 75)`);

  // Add verification warnings if counts don't match expectations
  if (hierarchyStats.domainGroups !== 4) {
    processingResult.warnings.push(`Expected 4 domain groups, but found ${hierarchyStats.domainGroups}`);
  }
  if (hierarchyStats.categories !== 15) {
    processingResult.warnings.push(`Expected 15 categories, but found ${hierarchyStats.categories}`);
  }
  if (hierarchyStats.subCategories !== 75) {
    processingResult.warnings.push(`Expected 75 sub-categories, but found ${hierarchyStats.subCategories}`);
  }

  return { parsed, hierarchy, processingResult };
};
