
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, Download, Save } from 'lucide-react';
import { WizardData } from '@/types/wizardTypes';
import { DomainGroupsData } from '@/types/domainGroups';
import { industrySegmentDataManager } from '../industrySegmentDataManager';
import { exportHierarchyToExcel } from '@/utils/excelProcessing';

interface ReviewAndSubmitProps {
  wizardData: WizardData;
  existingData: DomainGroupsData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onSubmit: (data: DomainGroupsData) => void;
  onValidationChange: (isValid: boolean) => void;
}

const ReviewAndSubmit: React.FC<ReviewAndSubmitProps> = ({
  wizardData,
  existingData,
  onUpdate,
  onSubmit,
  onValidationChange
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [previewData, setPreviewData] = useState<DomainGroupsData | null>(null);

  useEffect(() => {
    // Generate preview data and validate
    const generatedData = generateHierarchyData();
    setPreviewData(generatedData);
    
    const isValid = generatedData.domainGroups.length > 0 && 
                   generatedData.categories.length > 0 && 
                   generatedData.subCategories.length > 0;
    onValidationChange(isValid);
  }, [wizardData, onValidationChange]);

  const generateHierarchyData = (): DomainGroupsData => {
    const industrySegments = industrySegmentDataManager.loadData().industrySegments || [];
    const selectedSegment = industrySegments.find(s => s.id === wizardData.selectedIndustrySegment);
    
    if (!selectedSegment) {
      return { domainGroups: [], categories: [], subCategories: [] };
    }

    const domainGroups: any[] = [];
    const categories: any[] = [];
    const subCategories: any[] = [];

    if (wizardData.dataSource === 'excel' && wizardData.excelData) {
      // Process Excel data
      const groupedData = new Map<string, any>();
      
      wizardData.excelData.data.forEach(row => {
        const domainGroupKey = row.domainGroup;
        
        if (!groupedData.has(domainGroupKey)) {
          groupedData.set(domainGroupKey, {
            domainGroup: row.domainGroup,
            domainGroupDescription: row.domainGroupDescription || '',
            categories: new Map()
          });
        }
        
        const domainGroupData = groupedData.get(domainGroupKey);
        const categoryKey = row.category;
        
        if (!domainGroupData.categories.has(categoryKey)) {
          domainGroupData.categories.set(categoryKey, {
            category: row.category,
            categoryDescription: row.categoryDescription || '',
            subCategories: []
          });
        }
        
        domainGroupData.categories.get(categoryKey).subCategories.push({
          subCategory: row.subCategory,
          subCategoryDescription: row.subCategoryDescription || '',
          isActive: row.isActive
        });
      });

      // Convert to arrays
      let domainGroupId = 1;
      let categoryId = 1;
      let subCategoryId = 1;

      groupedData.forEach((domainGroupData) => {
        const dg = {
          id: domainGroupId.toString(),
          name: domainGroupData.domainGroup,
          description: domainGroupData.domainGroupDescription,
          industrySegmentId: wizardData.selectedIndustrySegment,
          industrySegmentName: selectedSegment.industrySegment,
          isActive: true
        };
        domainGroups.push(dg);

        domainGroupData.categories.forEach((categoryData: any) => {
          const cat = {
            id: categoryId.toString(),
            name: categoryData.category,
            description: categoryData.categoryDescription,
            domainGroupId: dg.id,
            isActive: true
          };
          categories.push(cat);

          categoryData.subCategories.forEach((subCategoryData: any) => {
            subCategories.push({
              id: subCategoryId.toString(),
              name: subCategoryData.subCategory,
              description: subCategoryData.subCategoryDescription,
              categoryId: cat.id,
              isActive: subCategoryData.isActive
            });
            subCategoryId++;
          });
          categoryId++;
        });
        domainGroupId++;
      });
    } else if (wizardData.dataSource === 'manual' && wizardData.manualData) {
      // Process manual data
      // ... manual data processing logic would go here
    }

    return { domainGroups, categories, subCategories };
  };

  const handleSubmit = async () => {
    if (!previewData) return;

    setIsSubmitting(true);
    setSubmitProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setSubmitProgress(prev => Math.min(prev + 20, 90));
      }, 200);

      // Merge with existing data
      const mergedData: DomainGroupsData = {
        domainGroups: [...(existingData.domainGroups || []), ...previewData.domainGroups],
        categories: [...(existingData.categories || []), ...previewData.categories],
        subCategories: [...(existingData.subCategories || []), ...previewData.subCategories]
      };

      clearInterval(progressInterval);
      setSubmitProgress(100);

      // Wait a moment for visual feedback
      await new Promise(resolve => setTimeout(resolve, 500));

      onSubmit(mergedData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitProgress(0), 1000);
    }
  };

  const downloadPreview = () => {
    if (!previewData) return;

    try {
      const excelBuffer = exportHierarchyToExcel(previewData);
      const blob = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `domain-groups-preview-${Date.now()}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const getStats = () => {
    if (!previewData) return { domainGroups: 0, categories: 0, subCategories: 0 };
    
    return {
      domainGroups: previewData.domainGroups.length,
      categories: previewData.categories.length,
      subCategories: previewData.subCategories.length
    };
  };

  const stats = getStats();
  const industrySegments = industrySegmentDataManager.loadData().industrySegments || [];
  const selectedSegment = industrySegments.find(s => s.id === wizardData.selectedIndustrySegment);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Review & Submit</h2>
        <p className="text-muted-foreground">
          Review your domain group hierarchy before saving
        </p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Hierarchy Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1</div>
              <div className="text-sm text-muted-foreground">Industry Segment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.domainGroups}</div>
              <div className="text-sm text-muted-foreground">Domain Groups</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.categories}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.subCategories}</div>
              <div className="text-sm text-muted-foreground">Sub-Categories</div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Industry Segment:</p>
                <p className="text-sm text-muted-foreground">{selectedSegment?.industrySegment}</p>
              </div>
              <Badge variant="secondary">Ready to Save</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Source Info */}
      <Card>
        <CardHeader>
          <CardTitle>Data Source Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Data Source:</span>
              <Badge variant="outline">
                {wizardData.dataSource === 'excel' && 'Excel Upload'}
                {wizardData.dataSource === 'manual' && 'Manual Entry'}
                {wizardData.dataSource === 'template' && 'Template'}
              </Badge>
            </div>
            
            {wizardData.dataSource === 'excel' && wizardData.excelData && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processed Rows:</span>
                <span className="text-sm">{wizardData.excelData.data.length}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Preview Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={downloadPreview} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Warnings */}
      {existingData.domainGroups.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This hierarchy will be added to your existing domain groups. 
            Make sure there are no conflicts with existing data.
          </AlertDescription>
        </Alert>
      )}

      {/* Submit */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Button 
              onClick={handleSubmit}
              disabled={!previewData || isSubmitting}
              className="w-full flex items-center gap-2"
              size="lg"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save Domain Group Hierarchy'}
            </Button>

            {isSubmitting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Saving hierarchy...</span>
                  <span>{submitProgress}%</span>
                </div>
                <Progress value={submitProgress} className="w-full" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewAndSubmit;
