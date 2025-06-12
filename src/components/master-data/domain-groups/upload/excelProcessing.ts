
import * as XLSX from 'xlsx';

export interface ParsedExcelData {
  industrySegment: string;
  domainGroup: string;
  category: string;
  subCategory: string;
}

export interface HierarchyData {
  [industrySegment: string]: {
    [domainGroup: string]: {
      [category: string]: string[];
    };
  };
}

export interface SavedExcelDocument {
  fileName: string;
  fileSize: number;
  uploadDate: string;
  excelData: string[][];
  parsedData: ParsedExcelData[];
  hierarchyData: HierarchyData;
}

export const STORAGE_KEY = 'domain_group_excel_document';

export const processExcelFile = async (file: File): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const parseExcelToHierarchy = (data: string[][]): { parsed: ParsedExcelData[], hierarchy: HierarchyData } => {
  if (!data || data.length < 2) return { parsed: [], hierarchy: {} };

  const headers = data[0];
  const rows = data.slice(1);
  
  const parsed: ParsedExcelData[] = [];
  const hierarchy: HierarchyData = {};

  rows.forEach(row => {
    if (row.length >= 4) {
      const item: ParsedExcelData = {
        industrySegment: row[0] || '',
        domainGroup: row[1] || '',
        category: row[2] || '',
        subCategory: row[3] || ''
      };
      
      parsed.push(item);

      // Build hierarchy structure
      if (!hierarchy[item.industrySegment]) {
        hierarchy[item.industrySegment] = {};
      }
      if (!hierarchy[item.industrySegment][item.domainGroup]) {
        hierarchy[item.industrySegment][item.domainGroup] = {};
      }
      if (!hierarchy[item.industrySegment][item.domainGroup][item.category]) {
        hierarchy[item.industrySegment][item.domainGroup][item.category] = [];
      }
      
      if (!hierarchy[item.industrySegment][item.domainGroup][item.category].includes(item.subCategory)) {
        hierarchy[item.industrySegment][item.domainGroup][item.category].push(item.subCategory);
      }
    }
  });

  return { parsed, hierarchy };
};

export const saveDocument = (file: File, excelData: string[][], parsedData: ParsedExcelData[], hierarchyData: HierarchyData): SavedExcelDocument => {
  const documentToSave: SavedExcelDocument = {
    fileName: file.name,
    fileSize: file.size,
    uploadDate: new Date().toISOString(),
    excelData,
    parsedData,
    hierarchyData
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
  console.log('🗑️ Cleared saved Excel document');
};
