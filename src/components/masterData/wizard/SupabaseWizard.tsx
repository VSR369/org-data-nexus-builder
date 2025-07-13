import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, ArrowRight, CheckCircle, Circle, Wand2, 
  Target, Database, FolderTree, Save, X 
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WizardStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface IndustrySegment {
  id: string;
  name: string;
}

interface DomainGroup {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface WizardData {
  domainGroup: {
    name: string;
    description: string;
    industry_segment_id: string;
  };
  categories: Array<{
    name: string;
    description: string;
  }>;
  subCategories: Array<{
    name: string;
    description: string;
    categoryIndex: number;
  }>;
}

interface SupabaseWizardProps {
  onCancel: () => void;
  onComplete: () => void;
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'domain-group',
    title: 'Domain Group Setup',
    description: 'Create the master level domain group',
    completed: false
  },
  {
    id: 'categories',
    title: 'Categories',
    description: 'Add child categories to your domain group',
    completed: false
  },
  {
    id: 'sub-categories',
    title: 'Sub-Categories',
    description: 'Add sub-child categories',
    completed: false
  },
  {
    id: 'review',
    title: 'Review & Save',
    description: 'Review your hierarchy and save to database',
    completed: false
  }
];

const SupabaseWizard: React.FC<SupabaseWizardProps> = ({ onCancel, onComplete }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState(WIZARD_STEPS);
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [wizardData, setWizardData] = useState<WizardData>({
    domainGroup: {
      name: '',
      description: '',
      industry_segment_id: ''
    },
    categories: [],
    subCategories: []
  });

  useEffect(() => {
    fetchIndustrySegments();
  }, []);

  const fetchIndustrySegments = async () => {
    try {
      const { data, error } = await supabase
        .from('master_industry_segments')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setIndustrySegments(data || []);
    } catch (error) {
      console.error('Error fetching industry segments:', error);
      toast({
        title: "Warning",
        description: "Could not load industry segments",
        variant: "destructive",
      });
    }
  };

  const updateStep = (stepIndex: number, completed: boolean) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, completed } : step
    ));
  };

  const canProceedFromStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Domain Group
        return wizardData.domainGroup.name.trim().length > 0;
      case 1: // Categories
        return wizardData.categories.length > 0 && 
               wizardData.categories.every(cat => cat.name.trim().length > 0);
      case 2: // Sub-Categories
        return true; // Sub-categories are optional
      case 3: // Review
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1 && canProceedFromStep(currentStep)) {
      updateStep(currentStep, true);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addCategory = () => {
    setWizardData(prev => ({
      ...prev,
      categories: [...prev.categories, { name: '', description: '' }]
    }));
  };

  const updateCategory = (index: number, field: 'name' | 'description', value: string) => {
    setWizardData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === index ? { ...cat, [field]: value } : cat
      )
    }));
  };

  const removeCategory = (index: number) => {
    setWizardData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
      subCategories: prev.subCategories.filter(sub => sub.categoryIndex !== index)
        .map(sub => ({ 
          ...sub, 
          categoryIndex: sub.categoryIndex > index ? sub.categoryIndex - 1 : sub.categoryIndex 
        }))
    }));
  };

  const addSubCategory = (categoryIndex: number) => {
    setWizardData(prev => ({
      ...prev,
      subCategories: [...prev.subCategories, { 
        name: '', 
        description: '', 
        categoryIndex 
      }]
    }));
  };

  const updateSubCategory = (index: number, field: 'name' | 'description', value: string) => {
    setWizardData(prev => ({
      ...prev,
      subCategories: prev.subCategories.map((sub, i) => 
        i === index ? { ...sub, [field]: value } : sub
      )
    }));
  };

  const removeSubCategory = (index: number) => {
    setWizardData(prev => ({
      ...prev,
      subCategories: prev.subCategories.filter((_, i) => i !== index)
    }));
  };

  const saveToDatabase = async () => {
    setSaving(true);
    try {
      // 1. Create Domain Group
      const { data: domainGroupData, error: domainGroupError } = await supabase
        .from('master_domain_groups')
        .insert([{
          name: wizardData.domainGroup.name.trim(),
          description: wizardData.domainGroup.description.trim() || null,
          industry_segment_id: wizardData.domainGroup.industry_segment_id || null,
          is_active: true
        }])
        .select()
        .single();

      if (domainGroupError) throw domainGroupError;

      const domainGroupId = domainGroupData.id;

      // 2. Create Categories
      const categoriesData = [];
      for (let i = 0; i < wizardData.categories.length; i++) {
        const category = wizardData.categories[i];
        if (category.name.trim()) {
          const { data: categoryData, error: categoryError } = await supabase
            .from('master_domain_groups')
            .insert([{
              name: category.name.trim(),
              description: category.description.trim() || null,
              domain_group_id: domainGroupId,
              is_active: true
            }])
            .select()
            .single();

          if (categoryError) throw categoryError;
          categoriesData.push({ ...categoryData, originalIndex: i });
        }
      }

      // 3. Create Sub-Categories
      for (const subCategory of wizardData.subCategories) {
        if (subCategory.name.trim()) {
          const parentCategory = categoriesData.find(cat => cat.originalIndex === subCategory.categoryIndex);
          if (parentCategory) {
            const { error: subCategoryError } = await supabase
              .from('master_domain_groups')
              .insert([{
                name: subCategory.name.trim(),
                description: subCategory.description.trim() || null,
                category_id: parentCategory.id,
                is_active: true
              }]);

            if (subCategoryError) throw subCategoryError;
          }
        }
      }

      toast({
        title: "Success!",
        description: `Created domain group "${wizardData.domainGroup.name}" with ${categoriesData.length} categories and ${wizardData.subCategories.filter(sub => sub.name.trim()).length} sub-categories`,
      });

      onComplete();
    } catch (error) {
      console.error('Error saving to database:', error);
      toast({
        title: "Error",
        description: "Failed to save hierarchy to database",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Domain Group Setup
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Create Domain Group (Master Level)</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="domain-group-name">Domain Group Name *</Label>
                <Input
                  id="domain-group-name"
                  value={wizardData.domainGroup.name}
                  onChange={(e) => setWizardData(prev => ({
                    ...prev,
                    domainGroup: { ...prev.domainGroup, name: e.target.value }
                  }))}
                  placeholder="Enter domain group name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="domain-group-description">Description</Label>
                <Textarea
                  id="domain-group-description"
                  value={wizardData.domainGroup.description}
                  onChange={(e) => setWizardData(prev => ({
                    ...prev,
                    domainGroup: { ...prev.domainGroup, description: e.target.value }
                  }))}
                  placeholder="Enter description (optional)"
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="industry-segment">Industry Segment (Optional)</Label>
                <Select
                  value={wizardData.domainGroup.industry_segment_id}
                  onValueChange={(value) => setWizardData(prev => ({
                    ...prev,
                    domainGroup: { ...prev.domainGroup, industry_segment_id: value === 'none' ? '' : value }
                  }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select industry segment (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Industry Segment</SelectItem>
                    {industrySegments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        {segment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 1: // Categories
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold">Add Categories (Child Level)</h3>
              </div>
              <Button onClick={addCategory} size="sm" className="flex items-center gap-2">
                <Circle className="w-4 h-4" />
                Add Category
              </Button>
            </div>
            
            {wizardData.categories.length === 0 && (
              <div className="text-center p-6 border-2 border-dashed border-muted rounded-lg">
                <Database className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No categories added yet. Click "Add Category" to get started.</p>
              </div>
            )}
            
            <div className="space-y-3">
              {wizardData.categories.map((category, index) => (
                <div key={index} className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary">Category {index + 1}</Badge>
                    <Button 
                      onClick={() => removeCategory(index)} 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label>Category Name *</Label>
                      <Input
                        value={category.name}
                        onChange={(e) => updateCategory(index, 'name', e.target.value)}
                        placeholder="Enter category name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={category.description}
                        onChange={(e) => updateCategory(index, 'description', e.target.value)}
                        placeholder="Enter description (optional)"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2: // Sub-Categories
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FolderTree className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold">Add Sub-Categories (Sub-Child Level)</h3>
            </div>
            
            {wizardData.categories.length === 0 && (
              <div className="text-center p-6 border-2 border-dashed border-muted rounded-lg">
                <p className="text-muted-foreground">Please add categories first before creating sub-categories.</p>
              </div>
            )}
            
            <div className="space-y-4">
              {wizardData.categories.map((category, categoryIndex) => {
                const categorySubCategories = wizardData.subCategories.filter(
                  sub => sub.categoryIndex === categoryIndex
                );
                
                return (
                  <div key={categoryIndex} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <Button 
                        onClick={() => addSubCategory(categoryIndex)} 
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Circle className="w-3 h-3" />
                        Add Sub-Category
                      </Button>
                    </div>
                    
                    {categorySubCategories.length === 0 ? (
                      <div className="text-sm text-muted-foreground ml-6">
                        No sub-categories yet
                      </div>
                    ) : (
                      <div className="space-y-2 ml-6">
                        {categorySubCategories.map((subCategory, subIndex) => {
                          const globalIndex = wizardData.subCategories.indexOf(subCategory);
                          return (
                            <div key={globalIndex} className="p-3 border rounded bg-muted/20">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline">Sub-Category {subIndex + 1}</Badge>
                                <Button 
                                  onClick={() => removeSubCategory(globalIndex)} 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <Input
                                  value={subCategory.name}
                                  onChange={(e) => updateSubCategory(globalIndex, 'name', e.target.value)}
                                  placeholder="Sub-category name"
                                />
                                <Input
                                  value={subCategory.description}
                                  onChange={(e) => updateSubCategory(globalIndex, 'description', e.target.value)}
                                  placeholder="Description (optional)"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 3: // Review
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Review Your Hierarchy</h3>
            </div>
            
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="space-y-4">
                {/* Domain Group */}
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <div className="font-semibold text-blue-600">Domain Group:</div>
                    <div className="font-medium">{wizardData.domainGroup.name}</div>
                    {wizardData.domainGroup.description && (
                      <div className="text-sm text-muted-foreground">{wizardData.domainGroup.description}</div>
                    )}
                  </div>
                </div>
                
                {/* Categories */}
                <div className="ml-6 space-y-3">
                  {wizardData.categories.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <div className="flex items-start gap-3">
                        <Database className="w-4 h-4 text-green-600 mt-1" />
                        <div>
                          <div className="font-medium text-green-600">Category:</div>
                          <div>{category.name}</div>
                          {category.description && (
                            <div className="text-sm text-muted-foreground">{category.description}</div>
                          )}
                        </div>
                      </div>
                      
                      {/* Sub-Categories */}
                      <div className="ml-6 mt-2 space-y-2">
                        {wizardData.subCategories
                          .filter(sub => sub.categoryIndex === categoryIndex && sub.name.trim())
                          .map((subCategory, subIndex) => (
                            <div key={subIndex} className="flex items-start gap-3">
                              <FolderTree className="w-4 h-4 text-orange-600 mt-1" />
                              <div>
                                <div className="font-medium text-orange-600">Sub-Category:</div>
                                <div>{subCategory.name}</div>
                                {subCategory.description && (
                                  <div className="text-sm text-muted-foreground">{subCategory.description}</div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={saveToDatabase} 
                disabled={saving}
                className="flex items-center gap-2"
                size="lg"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving to Database...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save to Database
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wand2 className="w-6 h-6 text-blue-600" />
            <div>
              <CardTitle>Domain Groups Creation Wizard</CardTitle>
              <CardDescription>Step-by-step hierarchy setup for Supabase</CardDescription>
            </div>
          </div>
          <Button variant="ghost" onClick={onCancel} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.title}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          {steps.map((step, index) => (
            <div key={step.id} className={`flex items-center gap-2 ${
              index === currentStep ? 'text-blue-600 font-medium' : 
              step.completed ? 'text-green-600' : 'text-muted-foreground'
            }`}>
              {step.completed ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{step.title}</span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="min-h-96">
          {renderStepContent()}
        </div>

        {currentStep < 3 && (
          <div className="flex justify-between">
            <Button 
              onClick={handlePrevious} 
              disabled={currentStep === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={!canProceedFromStep(currentStep)}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupabaseWizard;