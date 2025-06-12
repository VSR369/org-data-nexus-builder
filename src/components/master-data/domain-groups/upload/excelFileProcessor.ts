
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
