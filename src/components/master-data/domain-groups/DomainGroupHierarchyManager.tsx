
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, FileSpreadsheet, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DomainGroupHierarchyManagerProps {
  onBack: () => void;
}

const DomainGroupHierarchyManager: React.FC<DomainGroupHierarchyManagerProps> = ({ onBack }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any[][] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setIsProcessing(true);
      
      // Simulate processing the Excel file
      setTimeout(() => {
        // Mock Excel data for demonstration
        const mockData = [
          ['Industry Segment', 'Domain Group', 'Category', 'Sub Category'],
          ['Technology', 'Software Development', 'Frontend', 'React'],
          ['Technology', 'Software Development', 'Frontend', 'Vue.js'],
          ['Technology', 'Software Development', 'Backend', 'Node.js'],
          ['Technology', 'Software Development', 'Backend', 'Python'],
          ['Healthcare', 'Medical Devices', 'Diagnostics', 'MRI'],
          ['Healthcare', 'Medical Devices', 'Diagnostics', 'CT Scan'],
          ['Healthcare', 'Pharmaceuticals', 'Research', 'Drug Discovery'],
        ];
        setExcelData(mockData);
        setIsProcessing(false);
      }, 1500);
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
          </CardTitle>
          <CardDescription>
            Upload an Excel file (.xlsx, .xls) or CSV file containing your domain group hierarchy data
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
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <FileSpreadsheet className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={clearUpload}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Display Section */}
      {uploadedFile && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Document Preview</CardTitle>
            <CardDescription>
              Preview of the uploaded Excel data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isProcessing ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Processing Excel file...</p>
                </div>
              </div>
            ) : excelData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {excelData.length - 1} rows of data
                  </p>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto max-h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {excelData[0]?.map((header, index) => (
                            <TableHead key={index} className="font-semibold">
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {excelData.slice(1).map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <TableCell key={cellIndex}>{cell}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Future Sections Placeholder */}
      <Card className="border-dashed">
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <h3 className="font-medium mb-2">Tree Display Section</h3>
            <p className="text-sm">
              This section will display the hierarchical tree view of your domain groups
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainGroupHierarchyManager;
