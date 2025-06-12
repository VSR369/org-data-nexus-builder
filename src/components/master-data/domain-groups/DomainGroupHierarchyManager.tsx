
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Upload, FileSpreadsheet, X, Building2, Target, Globe, FolderTree, Save } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import { DomainGroupsData, DomainGroup, Category, SubCategory } from '@/types/domainGroups';
import { domainGroupsDataManager } from './domainGroupsDataManager';
import { industrySegmentDataManager } from './industrySegmentDataManager';

interface DomainGroupHierarchyManagerProps {
  onBack: () => void;
}

interface ParsedExcelData {
  industrySegment: string;
  domainGroup: string;
  category: string;
  subCategory: string;
}

interface HierarchyData {
  [industrySegment: string]: {
    [domainGroup: string]: {
      [category: string]: string[];
    };
  };
}

interface SavedExcelDocument {
  fileName: string;
  fileSize: number;
  uploadDate: string;
  excelData: string[][];
  parsedData: ParsedExcelData[];
  hierarchyData: HierarchyData;
}

const STORAGE_KEY = 'domain_group_excel_document';

const DomainGroupHierarchyManager: React.FC<DomainGroupHierarchyManagerProps> = ({ onBack }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<string[][] | null>(null);
  const [parsedData, setParsedData] = useState<ParsedExcelData[]>([]);
  const [hierarchyData, setHierarchyData] = useState<HierarchyData>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedDocument, setSavedDocument] = useState<SavedExcelDocument | null>(null);
  const { toast } = useToast();

  // Load saved document on component mount
  useEffect(() => {
    const loadSavedDocument = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const document: SavedExcelDocument = JSON.parse(saved);
          setSavedDocument(document);
          setExcelData(document.excelData);
          setParsedData(document.parsedData);
          setHierarchyData(document.hierarchyData);
          
          // Create a mock file object for display
          const mockFile = new File([''], document.fileName, { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
          });
          Object.defineProperty(mockFile, 'size', { value: document.fileSize });
          setUploadedFile(mockFile);
          
          console.log('✅ Loaded saved Excel document:', document.fileName);
        }
      } catch (error) {
        console.error('❌ Error loading saved document:', error);
      }
    };

    loadSavedDocument();
  }, []);

  // Save document to localStorage
  const saveDocument = (file: File, excelData: string[][], parsedData: ParsedExcelData[], hierarchyData: HierarchyData) => {
    try {
      const documentToSave: SavedExcelDocument = {
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
        excelData,
        parsedData,
        hierarchyData
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documentToSave));
      setSavedDocument(documentToSave);
      console.log('💾 Excel document saved successfully:', file.name);
    } catch (error) {
      console.error('❌ Error saving document:', error);
    }
  };

  const parseExcelToHierarchy = (data: string[][]): { parsed: ParsedExcelData[], hierarchy: HierarchyData } => {
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

  const convertToMasterDataFormat = () => {
    if (!hierarchyData || Object.keys(hierarchyData).length === 0) {
      toast({
        title: "No Data",
        description: "No Excel data to convert to master data format",
        variant: "destructive"
      });
      return;
    }

    try {
      // Load existing data
      const existingData = domainGroupsDataManager.loadData();
      const industrySegments = industrySegmentDataManager.loadData().industrySegments || [];
      
      const newDomainGroups: DomainGroup[] = [];
      const newCategories: Category[] = [];
      const newSubCategories: SubCategory[] = [];
      
      let domainGroupCounter = existingData.domainGroups.length + 1;
      let categoryCounter = existingData.categories.length + 1;
      let subCategoryCounter = existingData.subCategories.length + 1;

      Object.entries(hierarchyData).forEach(([industrySegmentName, domainGroups]) => {
        // Find or create industry segment
        let industrySegment = industrySegments.find(is => is.industrySegment === industrySegmentName);
        if (!industrySegment) {
          console.warn(`Industry segment "${industrySegmentName}" not found in master data`);
          return; // Skip if industry segment doesn't exist
        }

        Object.entries(domainGroups).forEach(([domainGroupName, categories]) => {
          // Check if domain group already exists
          const existingDomainGroup = existingData.domainGroups.find(
            dg => dg.name === domainGroupName && dg.industrySegmentId === industrySegment!.id
          );
          
          if (existingDomainGroup) {
            console.log(`Domain group "${domainGroupName}" already exists, skipping`);
            return;
          }

          const domainGroupId = `dg_${domainGroupCounter++}`;
          const newDomainGroup: DomainGroup = {
            id: domainGroupId,
            name: domainGroupName,
            description: `Imported from Excel: ${savedDocument?.fileName || 'Unknown file'}`,
            industrySegmentId: industrySegment!.id,
            industrySegmentName: industrySegmentName,
            isActive: true,
            createdAt: new Date().toISOString()
          };
          newDomainGroups.push(newDomainGroup);

          Object.entries(categories).forEach(([categoryName, subCategories]) => {
            const categoryId = `cat_${categoryCounter++}`;
            const newCategory: Category = {
              id: categoryId,
              name: categoryName,
              description: `Imported from Excel`,
              domainGroupId: domainGroupId,
              isActive: true,
              createdAt: new Date().toISOString()
            };
            newCategories.push(newCategory);

            subCategories.forEach(subCategoryName => {
              const subCategoryId = `sub_${subCategoryCounter++}`;
              const newSubCategory: SubCategory = {
                id: subCategoryId,
                name: subCategoryName,
                description: `Imported from Excel`,
                categoryId: categoryId,
                isActive: true,
                createdAt: new Date().toISOString()
              };
              newSubCategories.push(newSubCategory);
            });
          });
        });
      });

      // Merge with existing data
      const updatedData: DomainGroupsData = {
        domainGroups: [...existingData.domainGroups, ...newDomainGroups],
        categories: [...existingData.categories, ...newCategories],
        subCategories: [...existingData.subCategories, ...newSubCategories]
      };

      // Save to master data
      domainGroupsDataManager.saveData(updatedData);

      toast({
        title: "Success",
        description: `Successfully imported ${newDomainGroups.length} domain groups with ${newCategories.length} categories and ${newSubCategories.length} sub-categories to master data`,
      });

      console.log('✅ Excel data converted and saved to master data format:', {
        domainGroups: newDomainGroups.length,
        categories: newCategories.length,
        subCategories: newSubCategories.length
      });

      // Navigate back to main page to see the integrated data
      onBack();

    } catch (error) {
      console.error('❌ Error converting Excel data to master data format:', error);
      toast({
        title: "Error",
        description: "Failed to convert Excel data to master data format",
        variant: "destructive"
      });
    }
  };

  const processExcelFile = async (file: File) => {
    return new Promise<string[][]>((resolve, reject) => {
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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setIsProcessing(true);
      
      try {
        const excelDataResult = await processExcelFile(file);
        setExcelData(excelDataResult);
        
        const { parsed, hierarchy } = parseExcelToHierarchy(excelDataResult);
        setParsedData(parsed);
        setHierarchyData(hierarchy);
        
        // Save the document permanently
        saveDocument(file, excelDataResult, parsed, hierarchy);
        
        setIsProcessing(false);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        setIsProcessing(false);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false
  });

  const clearUpload = () => {
    setUploadedFile(null);
    setExcelData(null);
    setParsedData([]);
    setHierarchyData({});
    setSavedDocument(null);
    
    // Clear from localStorage
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ Cleared saved Excel document');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Domain Groups
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Domain Group Hierarchy Manager</h1>
            <p className="text-muted-foreground">Import and manage domain group hierarchies via Excel upload</p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Excel Upload
            {savedDocument && (
              <Badge variant="secondary" className="ml-2">
                Document Saved
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Upload an Excel file (.xlsx, .xls) or CSV file containing your domain group hierarchy data
            {savedDocument && (
              <span className="block mt-1 text-green-600">
                Last saved: {new Date(savedDocument.uploadDate).toLocaleString()}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <FileSpreadsheet className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive ? 'Drop your file here' : 'Drag & drop your Excel file here'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or click to browse files
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Supported formats: .xlsx, .xls, .csv
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                      {savedDocument && (
                        <span className="ml-2 text-green-600">• Saved</span>
                      )}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={clearUpload}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Action Button to Save to Master Data */}
              {Object.keys(hierarchyData).length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-blue-900">Ready to Import</h3>
                      <p className="text-sm text-blue-700">
                        Click to add this hierarchy data to your main Domain Groups configuration
                      </p>
                    </div>
                    <Button 
                      onClick={convertToMasterDataFormat}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save to Master Data
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tree Display Section */}
      {Object.keys(hierarchyData).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="w-5 h-5" />
              Excel Data Preview
            </CardTitle>
            <CardDescription>
              Preview of your uploaded domain groups hierarchy (not yet saved to master data)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(hierarchyData).map(([industrySegment, domainGroups]) => (
                <div key={industrySegment} className="border rounded-lg p-6 bg-gradient-to-r from-orange-50 to-amber-50">
                  {/* Industry Segment Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-orange-900">{industrySegment}</h2>
                      <p className="text-sm text-orange-700">
                        {Object.keys(domainGroups).length} Domain Group{Object.keys(domainGroups).length !== 1 ? 's' : ''} • {' '}
                        {Object.values(domainGroups).reduce((sum, dg) => sum + Object.keys(dg).length, 0)} Categories • {' '}
                        {Object.values(domainGroups).reduce((sum, dg) => 
                          sum + Object.values(dg).reduce((catSum, cat) => catSum + cat.length, 0), 0
                        )} Sub-Categories
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      Excel Import Preview
                    </Badge>
                  </div>

                  {/* Domain Groups within this Industry Segment */}
                  <div className="space-y-4">
                    {Object.entries(domainGroups).map(([domainGroupName, categories]) => (
                      <div key={domainGroupName} className="bg-white border rounded-lg p-5 shadow-sm">
                        {/* Domain Group Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Building2 className="w-5 h-5 text-primary" />
                              <h3 className="text-lg font-semibold">{domainGroupName}</h3>
                              <Badge variant="outline" className="border-orange-300 text-orange-700">
                                Preview
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Target className="w-4 h-4" />
                                {Object.keys(categories).length} Categories
                              </span>
                              <span>
                                {Object.values(categories).reduce((sum, cat) => sum + cat.length, 0)} Sub-Categories
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Categories Accordion */}
                        {Object.keys(categories).length > 0 && (
                          <Accordion type="multiple" className="w-full">
                            {Object.entries(categories).map(([categoryName, subCategories], categoryIndex) => (
                              <AccordionItem key={categoryName} value={`category-${categoryName}`}>
                                <AccordionTrigger className="text-left hover:no-underline">
                                  <div className="flex items-center gap-3">
                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                      {categoryIndex + 1}
                                    </span>
                                    <div className="text-left">
                                      <div className="font-medium">{categoryName}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {subCategories.length} sub-categories
                                      </div>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-4">
                                  {/* Sub-Categories Grid */}
                                  <div className="grid gap-3 ml-6">
                                    {subCategories.map((subCategory, subIndex) => (
                                      <div key={subIndex} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border-l-2 border-primary/30">
                                        <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium mt-0.5 shrink-0">
                                          {categoryIndex + 1}.{subIndex + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-medium text-sm mb-1">{subCategory}</h4>
                                          <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                                              Excel Import
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DomainGroupHierarchyManager;
