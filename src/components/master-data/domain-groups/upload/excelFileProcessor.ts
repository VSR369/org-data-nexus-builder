
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
        
        console.log('🎯 Reading ONLY the required columns: A (Industry), B (Domain), D (Category), F (Sub-Category)');
        
        // Process all rows from 0 to the last row with data
        for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
          const row: string[] = [];
          let hasRequiredData = false;
          
          // Read specific columns: A, B, D, F (plus a few extra for safety)
          const columnsToRead = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // A through J
          
          for (let colNum = 0; colNum <= 9; colNum++) {
            const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
            const cell = worksheet[cellAddress];
            
            let value = '';
            if (cell) {
              if (cell.v !== null && cell.v !== undefined) {
                value = String(cell.v).trim();
              }
            }
            
            row.push(value);
            
            // Check if we have data in any of the required columns (A, B, D, F)
            if (value && (colNum === 0 || colNum === 1 || colNum === 3 || colNum === 5)) {
              hasRequiredData = true;
            }
          }
          
          // Include header row always, and data rows that have required data
          if (rowNum === range.s.r || hasRequiredData) {
            jsonData.push(row);
            if (rowNum === range.s.r) {
              console.log(`📋 HEADER row:`, row);
            } else {
              console.log(`📝 DATA row ${rowNum + 1}: A="${row[0]}", B="${row[1]}", D="${row[3]}", F="${row[5]}"`);
            }
          } else {
            console.log(`⚠️ Skipping row ${rowNum + 1} - no data in required columns (A, B, D, F)`);
          }
        }

        console.log(`✅ Processed ${jsonData.length} total rows (including header) from ${range.e.r + 1} Excel rows`);
        console.log(`🎯 Filtered to only include rows with data in columns A, B, D, or F`);

        const processingResult: ProcessingResult = {
          totalRows: jsonData.length > 0 ? jsonData.length - 1 : 0,
          validRows: 0,
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
