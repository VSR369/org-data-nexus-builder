
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ExcelUploadSection from './upload/ExcelUploadSection';
import ExcelTreeStructureDisplay from './upload/ExcelTreeStructureDisplay';
import { 
  processExcelFile, 
  parseExcelToHierarchy, 
  saveDocument, 
  loadSavedDocument, 
  clearSavedDocument,
  deleteExcelFile,
  type HierarchyData,
  type ParsedExcelData,
  type SavedExcelDocument,
  type ProcessingResult
} from './upload/excelProcessing';
import { convertToMasterDataFormat } from './upload/masterDataConverter';

interface DomainGroupHierarchyManagerProps {
  onBack: () => void;
}

const DomainGroupHierarchyManager: React.FC<DomainGroupHierarchyManagerProps> = ({ onBack }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<string[][] | null>(null);
  const [parsedData, setParsedData] = useState<ParsedExcelData[]>([]);
  const [hierarchyData, setHierarchyData] = useState<HierarchyData>({});
  const [processingResult, setProcessingResult] = useState<ProcessingResult>({
    totalRows: 0,
    validRows: 0,
    errors: [],
    warnings: []
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedDocument, setSavedDocument] = useState<SavedExcelDocument | null>(null);
  const { toast } = useToast();

  // Load saved document on component mount
  useEffect(() => {
    const document = loadSavedDocument();
    if (document) {
      setSavedDocument(document);
      setExcelData(document.excelData);
      setParsedData(document.parsedData);
      setHierarchyData(document.hierarchyData);
      setProcessingResult(document.processingResult || {
        totalRows: 0,
        validRows: 0,
        errors: [],
        warnings: []
      });
      
      // Create a mock file object for display
      const mockFile = new File([''], document.fileName, { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      Object.defineProperty(mockFile, 'size', { value: document.fileSize });
      setUploadedFile(mockFile);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    
    try {
      console.log('🔄 Processing Excel file:', file.name);
      const { excelData: excelDataResult, processingResult: processingResultData } = await processExcelFile(file);
      setExcelData(excelDataResult);
      setProcessingResult(processingResultData);
      
      console.log('📊 Processing result:', processingResultData);
      
      const { parsed, hierarchy, processingResult: finalProcessingResult } = parseExcelToHierarchy(excelDataResult, processingResultData);
      setParsedData(parsed);
      setHierarchyData(hierarchy);
      setProcessingResult(finalProcessingResult);
      
      // Save the document permanently
      const savedDoc = saveDocument(file, excelDataResult, parsed, hierarchy, finalProcessingResult);
      setSavedDocument(savedDoc);
      
      setIsProcessing(false);
      
      toast({
        title: "Excel File Processed",
        description: `Successfully processed ${finalProcessingResult.validRows} out of ${finalProcessingResult.totalRows} rows`,
      });
      
    } catch (error) {
      console.error('Error processing Excel file:', error);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to process Excel file",
        variant: "destructive"
      });
    }
  };

  const handleClearUpload = () => {
    // Clear all state
    setUploadedFile(null);
    setExcelData(null);
    setParsedData([]);
    setHierarchyData({});
    setProcessingResult({
      totalRows: 0,
      validRows: 0,
      errors: [],
      warnings: []
    });
    setSavedDocument(null);
    
    // Delete from storage
    deleteExcelFile();
    
    toast({
      title: "File Deleted",
      description: "Excel file and all tree-structured data have been completely removed",
    });
  };

  const handleIntegrateToMasterData = async () => {
    try {
      const result = await convertToMasterDataFormat(hierarchyData, savedDocument);
      
      toast({
        title: "Success",
        description: `Successfully integrated ${result.domainGroups} new domain groups, ${result.categories} new categories, and ${result.subCategories} new sub-categories. ${result.mergedCategories + result.mergedSubCategories} items were merged with existing data.`,
      });

      // Navigate back to main page to see the integrated data
      onBack();
    } catch (error) {
      console.error('❌ Error converting Excel data to master data format:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to integrate Excel data to master data format",
        variant: "destructive"
      });
    }
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
      <ExcelUploadSection
        uploadedFile={uploadedFile}
        savedDocument={savedDocument}
        hierarchyData={hierarchyData}
        isProcessing={isProcessing}
        onFileUpload={handleFileUpload}
        onClearUpload={handleClearUpload}
        onSaveToMasterData={handleIntegrateToMasterData}
      />

      {/* Tree Structure Display */}
      <ExcelTreeStructureDisplay
        hierarchyData={hierarchyData}
        savedDocument={savedDocument}
        processingResult={processingResult}
        onIntegrateToMasterData={handleIntegrateToMasterData}
      />
    </div>
  );
};

export default DomainGroupHierarchyManager;
