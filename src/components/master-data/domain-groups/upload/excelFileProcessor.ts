
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
          
          // Read up to 10 columns to ensure we capture all data (A through J)
          const maxCol = Math.max(range.e.c, 9);
          for (let colNum = 0; colNum <= maxCol; colNum++) {
            const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
            const cell = worksheet[cellAddress];
            
            let value = '';
            if (cell) {
              if (cell.v !== null && cell.v !== undefined) {
                value = String(cell.v).trim();
              }
            }
            
            row.push(value);
            if (value) hasAnyData = true;
          }
          
          // Include header row always, and data rows that have any content
          if (rowNum === range.s.r || hasAnyData) {
            jsonData.push(row);
            console.log(`📝 Row ${rowNum + 1} [${rowNum === range.s.r ? 'HEADER' : 'DATA'}]:`, row);
          } else {
            console.log(`⚠️ Skipping completely empty row ${rowNum + 1}`);
          }
        }

        console.log(`✅ Processed ${jsonData.length} total rows (including header) from ${range.e.r + 1} Excel rows`);

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
