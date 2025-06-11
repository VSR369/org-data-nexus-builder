
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { WizardData } from '@/types/wizardTypes';
import { parseExcelFile, generateExcelTemplate } from '@/utils/excelProcessing';
import { industrySegmentDataManager } from '../industrySegmentDataManager';

interface ExcelUploaderProps {
  wizardData: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const ExcelUploader: React.FC<ExcelUploaderProps> = ({
  wizardData,
  onUpdate,
  onValidationChange
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 80));
      }, 100);

      const parsedData = await parseExcelFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Validate that industry segments in Excel match selected segment
      const selectedSegmentData = industrySegmentDataManager.loadData()
        .industrySegments?.find(s => s.id === wizardData.selectedIndustrySegment);
      
      if (selectedSegmentData) {
        // Filter and validate data against selected industry segment
        const filteredData = parsedData.data.filter(row => 
          row.industrySegment === selectedSegmentData.industrySegment
        );
        
        if (filteredData.length === 0) {
          parsedData.errors.push({
            row: 0,
            column: 'A',
            field: 'industrySegment',
            message: `No data found for selected industry segment: ${selectedSegmentData.industrySegment}`,
            severity: 'error'
          });
        }
        
        parsedData.data = filteredData;
      }

      onUpdate({ excelData: parsedData });
      onValidationChange(parsedData.errors.length === 0 && parsedData.data.length > 0);
      
    } catch (error) {
      console.error('Excel upload error:', error);
      onUpdate({ 
        excelData: { 
          data: [], 
          errors: [{
            row: 0,
            column: 'A',
            field: 'file',
            message: error.message || 'Failed to process Excel file',
            severity: 'error'
          }], 
          warnings: [] 
        } 
      });
      onValidationChange(false);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [wizardData.selectedIndustrySegment, onUpdate, onValidationChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    disabled: isProcessing
  });

  const downloadTemplate = () => {
    try {
      const industrySegments = industrySegmentDataManager.loadData().industrySegments || [];
      const selectedSegment = industrySegments.find(s => s.id === wizardData.selectedIndustrySegment);
      
      const templateData = selectedSegment ? [selectedSegment] : industrySegments;
      const excelBuffer = generateExcelTemplate(templateData);
      
      const blob = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `domain-groups-template-${selectedSegment?.industrySegment || 'all'}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Template download error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Download */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download Excel Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Download a pre-formatted Excel template with the correct column structure and sample data.
          </p>
          <Button onClick={downloadTemplate} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Template
          </Button>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Excel File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <FileSpreadsheet className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  {isDragActive ? 'Drop your Excel file here' : 'Upload Excel File'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Drag and drop your Excel file here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports .xlsx and .xls files
                </p>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {isProcessing && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing file...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Results */}
      {wizardData.excelData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {wizardData.excelData.errors.length === 0 ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              Upload Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Success Summary */}
            {wizardData.excelData.data.length > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Successfully processed {wizardData.excelData.data.length} rows from your Excel file.
                </AlertDescription>
              </Alert>
            )}

            {/* Errors */}
            {wizardData.excelData.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">
                      Found {wizardData.excelData.errors.length} error(s) in your Excel file:
                    </p>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {wizardData.excelData.errors.slice(0, 5).map((error, index) => (
                        <div key={index} className="text-xs">
                          Row {error.row}, Column {error.column}: {error.message}
                        </div>
                      ))}
                      {wizardData.excelData.errors.length > 5 && (
                        <p className="text-xs">
                          ... and {wizardData.excelData.errors.length - 5} more errors
                        </p>
                      )}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Data Preview */}
            {wizardData.excelData.data.length > 0 && wizardData.excelData.errors.length === 0 && (
              <div>
                <h4 className="font-medium mb-2">Data Preview (first 5 rows):</h4>
                <div className="border rounded overflow-hidden">
                  <div className="max-h-48 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-2 text-left">Domain Group</th>
                          <th className="p-2 text-left">Category</th>
                          <th className="p-2 text-left">Sub-Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wizardData.excelData.data.slice(0, 5).map((row, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2">{row.domainGroup}</td>
                            <td className="p-2">{row.category}</td>
                            <td className="p-2">{row.subCategory}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExcelUploader;
