
import * as XLSX from 'xlsx';
import { ProcessingResult } from './types';

export const processExcelFile = async (file: File): Promise<{
  excelData: string[][];
  processingResult: ProcessingResult;
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        console.log('🔄 Starting Excel file processing for:', file.name);
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        console.log('📊 Processing worksheet:', firstSheetName);
        
        // Get the range to find the last row with data
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        console.log('📐 Excel range detected:', range);
        
        const jsonData: string[][] = [];
        
        // Process all rows from 0 to the last row with data
        for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
          const row: string[] = [];
          let hasAnyData = false;
          
          // Check up to 8 columns to accommodate extended format (includes descriptions and active status)
          const maxCol = Math.max(range.e.c, 7);
          for (let colNum = range.s.c; colNum <= maxCol; colNum++) {
            const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
            const cell = worksheet[cellAddress];
            
            // Handle different cell value types and ensure proper string conversion
            let value = '';
            if (cell) {
              if (cell.v !== null && cell.v !== undefined) {
                value = String(cell.v).trim();
              }
            }
            
            row.push(value);
            if (value) hasAnyData = true;
          }
          
          // Include header row always
          if (rowNum === range.s.r) {
            jsonData.push(row);
            console.log(`📝 Header row ${rowNum + 1}:`, row);
          } 
          // For data rows, include if there's any meaningful data in the first 4 required columns
          else if (hasAnyData) {
            const industrySegment = (row[0] || '').trim();
            const domainGroup = (row[1] || '').trim();
            const category = (row[2] || '').trim();
            const subCategory = (row[3] || '').trim();
            
            // Include row if it has at least the first 3 required fields (more lenient)
            if (industrySegment && domainGroup && category) {
              jsonData.push(row);
              console.log(`📝 Valid data row ${rowNum + 1}:`, row);
            } else {
              console.log(`⚠️ Skipping incomplete row ${rowNum + 1} - missing required fields:`, {
                industrySegment: !!industrySegment,
                domainGroup: !!domainGroup,
                category: !!category,
                subCategory: !!subCategory
              });
            }
          } else {
            console.log(`⚠️ Skipping empty row ${rowNum + 1}`);
          }
        }

        console.log(`✅ Processed ${jsonData.length} total rows (including header) from ${range.e.r + 1} Excel rows`);

        const processingResult: ProcessingResult = {
          totalRows: jsonData.length > 0 ? jsonData.length - 1 : 0, // Exclude header
          validRows: 0, // Will be updated by parser
          errors: [],
          warnings: []
        };

        console.log('📊 Initial processing result:', processingResult);
        resolve({ excelData: jsonData, processingResult });
        
      } catch (error) {
        console.error('❌ Excel processing error:', error);
        reject(new Error(`Failed to process Excel file: ${error}`));
      }
    };
    
    reader.onerror = () => {
      console.error('❌ File reader error');
      reject(new Error('Failed to read Excel file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
