
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);
    setProcessingStatus('idle');

    try {
      const parsedData = await parseExcelFile(file);
      
      if (parsedData.errors.length > 0) {
        setProcessingStatus('error');
        onValidationChange(false);
      } else {
        setProcessingStatus('success');
        onValidationChange(true);
      }

      onUpdate({ excelData: parsedData });
    } catch (error) {
      console.error('Error processing Excel file:', error);
      setProcessingStatus('error');
      onValidationChange(false);
    } finally {
      setIsProcessing(false);
    }
  }, [onUpdate, onValidationChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  });

  const handleDownloadTemplate = () => {
    try {
      const industrySegments = industrySegmentDataManager.loadData().industrySegments || [];
      
      // Fix: Use the correct property name 'industrySegment' instead of 'name'
      const templateData = industrySegments.map(segment => ({
        industrySegment: segment.industrySegment
      }));
      
      const templateBuffer = generateExcelTemplate(templateData);
      const blob = new Blob([templateBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'domain-groups-template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating template:', error);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setProcessingStatus('idle');
    onUpdate({ excelData: undefined });
    onValidationChange(false);
  };

  const hasValidData = wizardData.excelData && 
                      wizardData.excelData.errors.length === 0 && 
                      wizardData.excelData.data.length > 0;

  return (
    <div className="space-y-6">
      {/* Template Download */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Download the Excel template pre-populated with your configured industry segments.
          </p>
          <Button onClick={handleDownloadTemplate} variant="outline" className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            Download Excel Template
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
          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop your Excel file here' : 'Drag & drop your Excel file here'}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse files (.xlsx, .xls)
              </p>
              <Button variant="outline">Browse Files</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={clearFile}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Processing Status */}
              {isProcessing && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Processing Excel file...</AlertDescription>
                </Alert>
              )}

              {processingStatus === 'success' && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Excel file processed successfully! Found {wizardData.excelData?.data.length} valid records.
                  </AlertDescription>
                </Alert>
              )}

              {processingStatus === 'error' && wizardData.excelData?.errors && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Found {wizardData.excelData.errors.length} error(s) in the Excel file.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Results */}
      {wizardData.excelData && (
        <Card>
          <CardHeader>
            <CardTitle>Validation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {wizardData.excelData.data.length}
                </div>
                <div className="text-sm text-muted-foreground">Valid Records</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {wizardData.excelData.errors.length}
                </div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {wizardData.excelData.warnings.length}
                </div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
            </div>

            {/* Errors List */}
            {wizardData.excelData.errors.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-red-600">Errors Found:</h4>
                <div className="space-y-2">
                  {wizardData.excelData.errors.map((error, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Badge variant="destructive">Row {error.row}</Badge>
                      <span>{error.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success Message */}
            {hasValidData && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Ready to proceed! Your Excel data has been validated and is ready for import.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExcelUploader;
