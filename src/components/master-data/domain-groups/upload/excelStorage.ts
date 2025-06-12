
import { SavedExcelDocument, ParsedExcelData, HierarchyData, ProcessingResult } from './types';

export const STORAGE_KEY = 'domain_group_excel_document';

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
