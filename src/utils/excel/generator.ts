
import * as XLSX from 'xlsx';
import { EXCEL_TEMPLATE_HEADERS } from './constants';

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
