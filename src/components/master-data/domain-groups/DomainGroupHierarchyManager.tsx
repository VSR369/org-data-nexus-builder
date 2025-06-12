
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ExcelUploadSection from './upload/ExcelUploadSection';
import ExcelPreviewDisplay from './upload/ExcelPreviewDisplay';
import { 
  processExcelFile, 
  parseExcelToHierarchy, 
  saveDocument, 
  loadSavedDocument, 
  clearSavedDocument,
  type HierarchyData,
  type ParsedExcelData,
  type SavedExcelDocument 
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
      const excelDataResult = await processExcelFile(file);
      setExcelData(excelDataResult);
      
      const { parsed, hierarchy } = parseExcelToHierarchy(excelDataResult);
      setParsedData(parsed);
      setHierarchyData(hierarchy);
      
      // Save the document permanently
      const savedDoc = saveDocument(file, excelDataResult, parsed, hierarchy);
      setSavedDocument(savedDoc);
      
      setIsProcessing(false);
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
    setUploadedFile(null);
    setExcelData(null);
    setParsedData([]);
    setHierarchyData({});
    setSavedDocument(null);
    clearSavedDocument();
  };

  const handleSaveToMasterData = () => {
    try {
      const result = convertToMasterDataFormat(hierarchyData, savedDocument);
      
      toast({
        title: "Success",
        description: `Successfully imported ${result.domainGroups} domain groups with ${result.categories} categories and ${result.subCategories} sub-categories to master data`,
      });

      // Navigate back to main page to see the integrated data
      onBack();
    } catch (error) {
      console.error('❌ Error converting Excel data to master data format:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to convert Excel data to master data format",
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
        onSaveToMasterData={handleSaveToMasterData}
      />

      {/* Preview Section */}
      <ExcelPreviewDisplay
        hierarchyData={hierarchyData}
        savedDocument={savedDocument}
      />
    </div>
  );
};

export default DomainGroupHierarchyManager;
