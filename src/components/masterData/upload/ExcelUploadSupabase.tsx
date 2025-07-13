import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, FileSpreadsheet, Download, AlertTriangle, 
  CheckCircle, X, ArrowLeft, Database, Save 
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';

interface ExcelRow {
  'Domain Group': string;
  'Domain Group Description'?: string;
  'Category': string;
  'Category Description'?: string;
  'Sub-Category'?: string;
  'Sub-Category Description'?: string;
  'Industry Segment'?: string;
}

interface ProcessedData {
  domainGroups: Array<{
    name: string;
    description?: string;
    industry_segment_id?: string;
    categories: Array<{
      name: string;
      description?: string;
      subCategories: Array<{
        name: string;
        description?: string;
      }>;
    }>;
  }>;
}

interface ExcelUploadSupabaseProps {
  onCancel: () => void;
  onComplete: () => void;
}

const ExcelUploadSupabase: React.FC<ExcelUploadSupabaseProps> = ({ onCancel, onComplete }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [industrySegments, setIndustrySegments] = useState<Array<{id: string, name: string}>>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    fetchIndustrySegments();
  }, []);

  const fetchIndustrySegments = async () => {
    try {
      const { data, error } = await supabase
        .from('master_industry_segments')
        .select('id, name');
      
      if (error) throw error;
      setIndustrySegments(data || []);
    } catch (error) {
      console.error('Error fetching industry segments:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProcessedData(null);
      setErrors([]);
      setWarnings([]);
    }
  };

  const processExcelFile = async () => {
    if (!file) return;

    setProcessing(true);
    setProgress(0);
    const newErrors: string[] = [];
    const newWarnings: string[] = [];

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);

      setProgress(25);

      if (jsonData.length === 0) {
        throw new Error('Excel file is empty or has no valid data');
      }

      // Validate required columns
      const requiredColumns = ['Domain Group', 'Category'];
      const firstRow = jsonData[0];
      const missingColumns = requiredColumns.filter(col => !(col in firstRow));
      
      if (missingColumns.length > 0) {
        throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
      }

      setProgress(50);

      // Process the data
      const domainGroupsMap = new Map<string, {
        name: string;
        description?: string;
        industry_segment_id?: string;
        categories: Map<string, {
          name: string;
          description?: string;
          subCategories: Array<{ name: string; description?: string }>;
        }>;
      }>();

      jsonData.forEach((row, index) => {
        const rowNum = index + 2; // Excel row number (1-indexed + header)
        
        if (!row['Domain Group']?.trim()) {
          newErrors.push(`Row ${rowNum}: Domain Group is required`);
          return;
        }
        
        if (!row['Category']?.trim()) {
          newErrors.push(`Row ${rowNum}: Category is required`);
          return;
        }

        const domainGroupName = row['Domain Group'].trim();
        const categoryName = row['Category'].trim();
        const subCategoryName = row['Sub-Category']?.trim();

        // Find industry segment ID if specified
        let industry_segment_id: string | undefined;
        if (row['Industry Segment']?.trim()) {
          const segment = industrySegments.find(s => 
            s.name.toLowerCase() === row['Industry Segment'].trim().toLowerCase()
          );
          if (segment) {
            industry_segment_id = segment.id;
          } else {
            newWarnings.push(`Row ${rowNum}: Industry segment "${row['Industry Segment']}" not found`);
          }
        }

        // Get or create domain group
        if (!domainGroupsMap.has(domainGroupName)) {
          domainGroupsMap.set(domainGroupName, {
            name: domainGroupName,
            description: row['Domain Group Description']?.trim(),
            industry_segment_id,
            categories: new Map()
          });
        }

        const domainGroup = domainGroupsMap.get(domainGroupName)!;

        // Get or create category
        if (!domainGroup.categories.has(categoryName)) {
          domainGroup.categories.set(categoryName, {
            name: categoryName,
            description: row['Category Description']?.trim(),
            subCategories: []
          });
        }

        const category = domainGroup.categories.get(categoryName)!;

        // Add sub-category if specified
        if (subCategoryName) {
          const existingSubCategory = category.subCategories.find(sub => sub.name === subCategoryName);
          if (!existingSubCategory) {
            category.subCategories.push({
              name: subCategoryName,
              description: row['Sub-Category Description']?.trim()
            });
          }
        }
      });

      setProgress(75);

      // Convert to final format
      const processedResult: ProcessedData = {
        domainGroups: Array.from(domainGroupsMap.values()).map(dg => ({
          ...dg,
          categories: Array.from(dg.categories.values())
        }))
      };

      setProgress(100);
      setProcessedData(processedResult);
      setErrors(newErrors);
      setWarnings(newWarnings);

      toast({
        title: "File Processed Successfully",
        description: `Found ${processedResult.domainGroups.length} domain groups with ${processedResult.domainGroups.reduce((sum, dg) => sum + dg.categories.length, 0)} categories`,
      });

    } catch (error) {
      console.error('Error processing Excel file:', error);
      setErrors([error instanceof Error ? error.message : 'Unknown error occurred']);
      toast({
        title: "Processing Failed",
        description: "Failed to process Excel file",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const uploadToSupabase = async () => {
    if (!processedData) return;

    setUploading(true);
    setProgress(0);
    let completedOperations = 0;
    const totalOperations = processedData.domainGroups.length;

    try {
      // Create domain groups with hierarchy
      for (const domainGroup of processedData.domainGroups) {
        // Build hierarchy structure
        const categories = domainGroup.categories.map(category => ({
          id: crypto.randomUUID(),
          name: category.name,
          description: category.description || undefined,
          subCategories: category.subCategories.map(subCategory => ({
            id: crypto.randomUUID(),
            name: subCategory.name,
            description: subCategory.description || undefined
          }))
        }));

        const { error: dgError } = await supabase
          .from('master_domain_groups')
          .insert([{
            name: domainGroup.name,
            description: domainGroup.description || null,
            industry_segment_id: domainGroup.industry_segment_id || null,
            is_active: true,
            hierarchy: { categories }
          }]);

        if (dgError) throw dgError;

        completedOperations++;
        setProgress((completedOperations / totalOperations) * 100);
      }

      const totalCategories = processedData.domainGroups.reduce((sum, dg) => sum + dg.categories.length, 0);
      const totalSubCategories = processedData.domainGroups.reduce((sum, dg) => 
        sum + dg.categories.reduce((catSum, cat) => catSum + cat.subCategories.length, 0), 0
      );

      toast({
        title: "Upload Successful!",
        description: `Successfully uploaded ${processedData.domainGroups.length} domain groups with ${totalCategories} categories and ${totalSubCategories} sub-categories`,
      });

      onComplete();
    } catch (error) {
      console.error('Error uploading to Supabase:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload data to Supabase",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        'Domain Group': 'Technology',
        'Domain Group Description': 'Technology-related domain',
        'Category': 'Software Development',
        'Category Description': 'Software development category',
        'Sub-Category': 'Web Development',
        'Sub-Category Description': 'Web development sub-category',
        'Industry Segment': 'Information Technology'
      },
      {
        'Domain Group': 'Technology',
        'Domain Group Description': '',
        'Category': 'Software Development',
        'Category Description': '',
        'Sub-Category': 'Mobile Development',
        'Sub-Category Description': 'Mobile app development',
        'Industry Segment': ''
      },
      {
        'Domain Group': 'Technology',
        'Domain Group Description': '',
        'Category': 'Data Science',
        'Category Description': 'Data science and analytics',
        'Sub-Category': '',
        'Sub-Category Description': '',
        'Industry Segment': ''
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Domain Groups Template');
    XLSX.writeFile(wb, 'domain-groups-template.xlsx');

    toast({
      title: "Template Downloaded",
      description: "Excel template has been downloaded",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Upload className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle>Excel Upload to Supabase</CardTitle>
                <CardDescription>Bulk import domain groups hierarchy from Excel file</CardDescription>
              </div>
            </div>
            <Button variant="ghost" onClick={onCancel} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Template Download */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download Template
          </CardTitle>
          <CardDescription>
            Download the Excel template to see the required format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={downloadTemplate} variant="outline" className="flex items-center gap-2">
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
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="flex-1"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Choose File
            </Button>
          </div>
          
          {file && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                <span className="font-medium">{file.name}</span>
                <Badge variant="secondary">{(file.size / 1024).toFixed(1)} KB</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={processExcelFile} 
                  disabled={processing}
                  className="flex items-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4" />
                      Process File
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => setFile(null)} 
                  variant="ghost" 
                  size="sm"
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
          
          {processing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing Excel file...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Errors and Warnings */}
      {(errors.length > 0 || warnings.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Processing Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">Errors:</h4>
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                      <X className="w-3 h-3" />
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {warnings.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-orange-600">Warnings:</h4>
                <div className="space-y-1">
                  {warnings.map((warning, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-orange-600">
                      <AlertTriangle className="w-3 h-3" />
                      {warning}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Processed Data Preview */}
      {processedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Data Preview
            </CardTitle>
            <CardDescription>
              Preview of processed data ready for upload
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{processedData.domainGroups.length}</div>
                <div className="text-sm text-blue-600">Domain Groups</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {processedData.domainGroups.reduce((sum, dg) => sum + dg.categories.length, 0)}
                </div>
                <div className="text-sm text-green-600">Categories</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {processedData.domainGroups.reduce((sum, dg) => 
                    sum + dg.categories.reduce((catSum, cat) => catSum + cat.subCategories.length, 0), 0
                  )}
                </div>
                <div className="text-sm text-orange-600">Sub-Categories</div>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto border rounded-lg p-4">
              {processedData.domainGroups.map((dg, dgIndex) => (
                <div key={dgIndex} className="mb-4">
                  <div className="font-semibold text-blue-600">{dg.name}</div>
                  {dg.description && <div className="text-sm text-muted-foreground">{dg.description}</div>}
                  <div className="ml-4 mt-2">
                    {dg.categories.map((cat, catIndex) => (
                      <div key={catIndex} className="mb-2">
                        <div className="font-medium text-green-600">→ {cat.name}</div>
                        {cat.description && <div className="text-sm text-muted-foreground ml-4">{cat.description}</div>}
                        {cat.subCategories.map((sub, subIndex) => (
                          <div key={subIndex} className="ml-8 text-orange-600">
                            → → {sub.name}
                            {sub.description && <span className="text-sm text-muted-foreground ml-2">({sub.description})</span>}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {errors.length === 0 && (
              <div className="text-center">
                <Button 
                  onClick={uploadToSupabase} 
                  disabled={uploading}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading to Supabase...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Upload to Supabase
                    </>
                  )}
                </Button>
                
                {uploading && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading to database...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExcelUploadSupabase;