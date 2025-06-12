
import React, { useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, X, Trash2, CheckCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useToast } from "@/hooks/use-toast";

interface SavedExcelDocument {
  fileName: string;
  fileSize: number;
  uploadDate: string;
  excelData: string[][];
  parsedData: ParsedExcelData[];
  hierarchyData: HierarchyData;
  processingResult: ProcessingResult;
  dataSource: 'excel';
}

interface ParsedExcelData {
  industrySegment: string;
  domainGroup: string;
  category: string;
  subCategory: string;
  rowNumber: number;
  isValid: boolean;
  errors: string[];
}

interface HierarchyData {
  [industrySegment: string]: {
    [domainGroup: string]: {
      [category: string]: string[];
    };
  };
}

interface ProcessingResult {
  totalRows: number;
  validRows: number;
  errors: string[];
  warnings: string[];
}

interface ExcelUploadSectionProps {
  uploadedFile: File | null;
  savedDocument: SavedExcelDocument | null;
  hierarchyData: HierarchyData;
  isProcessing: boolean;
  onFileUpload: (file: File) => void;
  onClearUpload: () => void;
  onSaveToMasterData: () => void;
}

const ExcelUploadSection: React.FC<ExcelUploadSectionProps> = ({
  uploadedFile,
  savedDocument,
  hierarchyData,
  isProcessing,
  onFileUpload,
  onClearUpload,
  onSaveToMasterData
}) => {
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false
  });

  const handleDeleteFile = () => {
    onClearUpload();
    toast({
      title: "File Deleted",
      description: "Excel file and all associated data have been removed",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Excel Upload & Processing
          {savedDocument && (
            <Badge variant="secondary" className="ml-2">
              <CheckCircle className="w-3 h-3 mr-1" />
              Processed
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Upload an Excel file (.xlsx, .xls) or CSV file containing your domain group hierarchy data. 
          All rows will be processed and validated automatically.
          {savedDocument && (
            <span className="block mt-1 text-green-600">
              Last processed: {new Date(savedDocument.uploadDate).toLocaleString()}
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
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Supported formats: .xlsx, .xls, .csv</div>
                <div>Expected columns: Industry Segment | Domain Group | Category | Sub-Category</div>
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
                    {savedDocument && savedDocument.processingResult && (
                      <span className="ml-2 text-green-600">
                        • {savedDocument.processingResult.validRows}/{savedDocument.processingResult.totalRows} rows processed
                      </span>
                    )}
                    {isProcessing && (
                      <span className="ml-2 text-blue-600">• Processing...</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleDeleteFile}
                  className="flex items-center gap-2"
                  disabled={isProcessing}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete File
                </Button>
                <Button variant="ghost" size="sm" onClick={onClearUpload} disabled={isProcessing}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Processing Status */}
            {isProcessing && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <div>
                    <h3 className="font-medium text-blue-900">Processing Excel File</h3>
                    <p className="text-sm text-blue-700">
                      Reading all rows and building hierarchy structure...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExcelUploadSection;
