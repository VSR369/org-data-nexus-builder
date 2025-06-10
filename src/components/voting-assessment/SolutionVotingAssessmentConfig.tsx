import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Settings, Target, Users, Bot, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { industrySegmentsDataManager } from '@/utils/sharedDataManagers';

interface Parameter {
  id: string;
  name: string;
  description: string;
  weightage: number;
}

interface AssessmentLevel {
  id: string;
  name: string;
  parameters: Parameter[];
  overrideParent: boolean;
}

interface VotingConfig {
  veryHigh: number;
  high: number;
  moderate: number;
  low: number;
  veryLow: number;
}

interface WeightConfig {
  votingWeight: number;
  assessmentWeight: number;
}

interface RatingThreshold {
  min: number;
  max: number;
  label: string;
}

interface DomainGroup {
  id: string;
  name: string;
  industrySegmentId: string;
  categories: Category[];
}

interface Category {
  id: string;
  name: string;
  domainGroupId: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

const SolutionVotingAssessmentConfig = () => {
  const { toast } = useToast();
  
  // Voting Scale Configuration (Fixed)
  const [votingScale] = useState<VotingConfig>({
    veryHigh: 5,
    high: 4,
    moderate: 3,
    low: 2,
    veryLow: 1
  });

  // Master Data
  const [industrySegments, setIndustrySegments] = useState<string[]>([]);
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  
  // Selection State
  const [selectedIndustrySegment, setSelectedIndustrySegment] = useState<string>('');
  const [selectedDomainGroup, setSelectedDomainGroup] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Assessment Parameters
  const [groupParameters, setGroupParameters] = useState<Parameter[]>([]);
  const [categoryParameters, setCategoryParameters] = useState<Parameter[]>([]);

  // Voting + Assessment Mix
  const [weights, setWeights] = useState<WeightConfig>({
    votingWeight: 10,
    assessmentWeight: 90
  });

  // Rating Thresholds (Fixed)
  const [ratingThresholds] = useState<RatingThreshold[]>([
    { min: 1.0000, max: 1.9999, label: 'Very Low' },
    { min: 2.0000, max: 2.9999, label: 'Low' },
    { min: 3.0000, max: 3.9999, label: 'Moderate' },
    { min: 4.0000, max: 4.4999, label: 'High' },
    { min: 4.5000, max: 5.0000, label: 'Very High' }
  ]);

  // AI Configuration
  const [aiAssessmentEnabled, setAiAssessmentEnabled] = useState(false);
  const [humanAiComparisonEnabled, setHumanAiComparisonEnabled] = useState(false);

  // Load industry segments on mount
  useEffect(() => {
    const segments = industrySegmentsDataManager.loadData();
    setIndustrySegments(segments);
  }, []);

  // Load domain groups when industry segment changes
  useEffect(() => {
    if (selectedIndustrySegment) {
      // This would typically load from your domain groups data
      // For now, using mock data
      const mockDomainGroups: DomainGroup[] = [
        {
          id: '1',
          name: 'Strategy Innovation & Growth',
          industrySegmentId: selectedIndustrySegment,
          categories: [
            {
              id: '1',
              name: 'Market Strategy',
              domainGroupId: '1',
              subCategories: [
                { id: '1', name: 'Market Analysis', categoryId: '1' },
                { id: '2', name: 'Competitive Intelligence', categoryId: '1' }
              ]
            },
            {
              id: '2',
              name: 'Innovation Management',
              domainGroupId: '1',
              subCategories: [
                { id: '3', name: 'Product Innovation', categoryId: '2' },
                { id: '4', name: 'Process Innovation', categoryId: '2' }
              ]
            }
          ]
        },
        {
          id: '2',
          name: 'Technology & Digital Transformation',
          industrySegmentId: selectedIndustrySegment,
          categories: [
            {
              id: '3',
              name: 'Digital Strategy',
              domainGroupId: '2',
              subCategories: [
                { id: '5', name: 'Digital Roadmap', categoryId: '3' },
                { id: '6', name: 'Technology Architecture', categoryId: '3' }
              ]
            }
          ]
        }
      ];
      setDomainGroups(mockDomainGroups);
      setSelectedDomainGroup('');
      setSelectedCategory('');
      setGroupParameters([]);
      setCategoryParameters([]);
    }
  }, [selectedIndustrySegment]);

  // Reset parameters when group or category changes
  useEffect(() => {
    if (selectedDomainGroup) {
      setSelectedCategory('');
      setCategoryParameters([]);
    }
  }, [selectedDomainGroup]);

  const addParameter = (level: 'group' | 'category') => {
    const newParameter: Parameter = {
      id: Date.now().toString(),
      name: '',
      description: '',
      weightage: 0
    };

    if (level === 'group') {
      setGroupParameters(prev => [...prev, newParameter]);
    } else {
      setCategoryParameters(prev => [...prev, newParameter]);
    }
  };

  const updateParameter = (level: 'group' | 'category', parameterId: string, field: keyof Parameter, value: string | number) => {
    const updateParams = (params: Parameter[]) => 
      params.map(param => 
        param.id === parameterId 
          ? { ...param, [field]: value }
          : param
      );

    if (level === 'group') {
      setGroupParameters(updateParams);
    } else {
      setCategoryParameters(updateParams);
    }
  };

  const removeParameter = (level: 'group' | 'category', parameterId: string) => {
    if (level === 'group') {
      setGroupParameters(prev => prev.filter(param => param.id !== parameterId));
    } else {
      setCategoryParameters(prev => prev.filter(param => param.id !== parameterId));
    }
  };

  const calculateTotalWeightage = (parameters: Parameter[]) => {
    return parameters.reduce((total, param) => total + param.weightage, 0);
  };

  const getFilteredDomainGroups = () => {
    return domainGroups.filter(group => group.industrySegmentId === selectedIndustrySegment);
  };

  const getSelectedDomainGroup = () => {
    return domainGroups.find(group => group.id === selectedDomainGroup);
  };

  const getSelectedCategory = () => {
    const group = getSelectedDomainGroup();
    return group?.categories.find(cat => cat.id === selectedCategory);
  };

  const validateWeights = () => {
    return weights.votingWeight + weights.assessmentWeight === 100;
  };

  const calculateFinalScore = (votingScore: number, assessmentScore: number) => {
    return ((weights.votingWeight / 100) * votingScore) + ((weights.assessmentWeight / 100) * assessmentScore);
  };

  const handleSave = () => {
    if (!validateWeights()) {
      toast({
        title: "Error",
        description: "Voting weight and assessment weight must total 100%",
        variant: "destructive",
      });
      return;
    }

    const groupTotal = calculateTotalWeightage(groupParameters);
    const categoryTotal = calculateTotalWeightage(categoryParameters);

    if (groupTotal > 100) {
      toast({
        title: "Error",
        description: "Group parameters total weightage cannot exceed 100%",
        variant: "destructive",
      });
      return;
    }

    if (categoryTotal > 100) {
      toast({
        title: "Error",
        description: "Category parameters total weightage cannot exceed 100%\",\n        variant: \"destructive\",\n      });\n      return;\n    }\n\n    toast({\n      title: \"Success\",\n      description: \"Voting & Assessment configuration saved successfully\",\n    });\n  };\n\n  const activeParameters = groupParameters.length > 0 ? groupParameters : categoryParameters;\n  const activeLevel = groupParameters.length > 0 ? 'group' : 'category';\n  const totalWeightage = calculateTotalWeightage(activeParameters);\n\n  return (\n    <div className=\"space-y-6\">\n      <Card>\n        <CardHeader>\n          <CardTitle className=\"flex items-center gap-2\">\n            <Target className=\"w-5 h-5\" />\n            Solution Voting & Assessment Configuration\n          </CardTitle>\n        </CardHeader>\n        <CardContent>\n          <Tabs defaultValue=\"voting-scale\" className=\"space-y-6\">\n            <TabsList className=\"grid w-full grid-cols-5\">\n              <TabsTrigger value=\"voting-scale\">Voting Scale</TabsTrigger>\n              <TabsTrigger value=\"assessment\">Assessment</TabsTrigger>\n              <TabsTrigger value=\"weights\">Weights</TabsTrigger>\n              <TabsTrigger value=\"thresholds\">Thresholds</TabsTrigger>\n              <TabsTrigger value=\"ai-config\">AI Config</TabsTrigger>\n            </TabsList>\n\n            <TabsContent value=\"voting-scale\">\n              <Card>\n                <CardHeader>\n                  <CardTitle className=\"text-base\">Voting Scale Configuration</CardTitle>\n                </CardHeader>\n                <CardContent>\n                  <div className=\"grid grid-cols-5 gap-4\">\n                    {Object.entries(votingScale).map(([key, value]) => (\n                      <div key={key} className=\"text-center\">\n                        <Badge variant=\"outline\" className=\"mb-2\">\n                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}\n                        </Badge>\n                        <div className=\"text-2xl font-bold\">{value}</div>\n                      </div>\n                    ))}\n                  </div>\n                </CardContent>\n              </Card>\n            </TabsContent>\n\n            <TabsContent value=\"assessment\">\n              <div className=\"space-y-6\">\n                {/* Selection Section */}\n                <Card>\n                  <CardHeader>\n                    <CardTitle className=\"text-base\">Solution Assessment Criteria</CardTitle>\n                  </CardHeader>\n                  <CardContent className=\"space-y-4\">\n                    {/* Industry Segment Selection */}\n                    <div>\n                      <Label htmlFor=\"industry-segment\">Industry Segment</Label>\n                      <Select value={selectedIndustrySegment} onValueChange={setSelectedIndustrySegment}>\n                        <SelectTrigger>\n                          <SelectValue placeholder=\"Select industry segment\" />\n                        </SelectTrigger>\n                        <SelectContent>\n                          {industrySegments.map((segment, index) => (\n                            <SelectItem key={index} value={index.toString()}>\n                              {segment}\n                            </SelectItem>\n                          ))}\n                        </SelectContent>\n                      </Select>\n                    </div>\n\n                    {/* Domain Group Selection */}\n                    {selectedIndustrySegment && (\n                      <div>\n                        <Label htmlFor=\"domain-group\">Domain Group</Label>\n                        <Select value={selectedDomainGroup} onValueChange={setSelectedDomainGroup}>\n                          <SelectTrigger>\n                            <SelectValue placeholder=\"Select domain group\" />\n                          </SelectTrigger>\n                          <SelectContent>\n                            {getFilteredDomainGroups().map((group) => (\n                              <SelectItem key={group.id} value={group.id}>\n                                {group.name}\n                              </SelectItem>\n                            ))}\n                          </SelectContent>\n                        </Select>\n                      </div>\n                    )}\n\n                    {/* Category Selection */}\n                    {selectedDomainGroup && (\n                      <div>\n                        <Label htmlFor=\"category\">Category (Optional)</Label>\n                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>\n                          <SelectTrigger>\n                            <SelectValue placeholder=\"Select category (optional)\" />\n                          </SelectTrigger>\n                          <SelectContent>\n                            <SelectItem value=\"none\">No specific category</SelectItem>\n                            {getSelectedDomainGroup()?.categories.map((category) => (\n                              <SelectItem key={category.id} value={category.id}>\n                                {category.name}\n                              </SelectItem>\n                            ))}\n                          </SelectContent>\n                        </Select>\n                      </div>\n                    )}\n                  </CardContent>\n                </Card>\n\n                {/* Parameters Configuration */}\n                {selectedDomainGroup && (\n                  <Card>\n                    <CardHeader>\n                      <CardTitle className=\"text-base flex items-center justify-between\">\n                        Assessment Parameters\n                        <div className=\"flex items-center gap-2\">\n                          <Badge variant={totalWeightage > 100 ? \"destructive\" : totalWeightage === 100 ? \"default\" : \"secondary\"}>\n                            Total: {totalWeightage}%\n                          </Badge>\n                          <Button \n                            onClick={() => addParameter(selectedCategory && selectedCategory !== 'none' ? 'category' : 'group')} \n                            size=\"sm\"\n                          >\n                            <Plus className=\"w-4 h-4 mr-2\" />\n                            Add Parameter\n                          </Button>\n                        </div>\n                      </CardTitle>\n                    </CardHeader>\n                    <CardContent>\n                      {/* Configuration Info */}\n                      <Alert className=\"mb-4\">\n                        <AlertTriangle className=\"h-4 w-4\" />\n                        <AlertDescription>\n                          {selectedCategory && selectedCategory !== 'none'\n                            ? `Setting parameters at Category level: ${getSelectedCategory()?.name}. These will apply to all sub-categories.`\n                            : `Setting parameters at Group level: ${getSelectedDomainGroup()?.name}. These will apply to all categories and sub-categories unless overridden.`\n                          }\n                        </AlertDescription>\n                      </Alert>\n\n                      {/* Parameters List */}\n                      <div className=\"space-y-4\">\n                        {activeParameters.length === 0 ? (\n                          <div className=\"text-center py-8 text-muted-foreground\">\n                            No parameters configured. Click \"Add Parameter\" to get started.\n                          </div>\n                        ) : (\n                          activeParameters.map((param) => (\n                            <div key={param.id} className=\"border rounded-lg p-4 space-y-3\">\n                              <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">\n                                <div>\n                                  <Label htmlFor={`param-name-${param.id}`}>Parameter Name</Label>\n                                  <Input\n                                    id={`param-name-${param.id}`}\n                                    placeholder=\"Enter parameter name\"\n                                    value={param.name}\n                                    onChange={(e) => updateParameter(activeLevel, param.id, 'name', e.target.value)}\n                                  />\n                                </div>\n                                <div>\n                                  <Label htmlFor={`param-weight-${param.id}`}>Weightage (%)</Label>\n                                  <Input\n                                    id={`param-weight-${param.id}`}\n                                    type=\"number\"\n                                    min=\"0\"\n                                    max=\"100\"\n                                    placeholder=\"0\"\n                                    value={param.weightage}\n                                    onChange={(e) => updateParameter(activeLevel, param.id, 'weightage', Number(e.target.value))}\n                                  />\n                                </div>\n                                <div className=\"flex items-end\">\n                                  <Button\n                                    variant=\"outline\"\n                                    size=\"sm\"\n                                    onClick={() => removeParameter(activeLevel, param.id)}\n                                    className=\"w-full\"\n                                  >\n                                    <Trash2 className=\"w-4 h-4 mr-2\" />\n                                    Remove\n                                  </Button>\n                                </div>\n                              </div>\n                              <div>\n                                <Label htmlFor={`param-desc-${param.id}`}>Description</Label>\n                                <Textarea\n                                  id={`param-desc-${param.id}`}\n                                  placeholder=\"Enter parameter description\"\n                                  value={param.description}\n                                  onChange={(e) => updateParameter(activeLevel, param.id, 'description', e.target.value)}\n                                  rows={2}\n                                />\n                              </div>\n                            </div>\n                          )))\n                        }\n                      </div>\n\n                      {/* Weightage Validation */}\n                      {totalWeightage > 100 && (\n                        <Alert className=\"mt-4\" variant=\"destructive\">\n                          <AlertTriangle className=\"h-4 w-4\" />\n                          <AlertDescription>\n                            Total weightage ({totalWeightage}%) exceeds 100%. Please adjust the parameter weightages.\n                          </AlertDescription>\n                        </Alert>\n                      )}\n                    </CardContent>\n                  </Card>\n                )}\n              </div>\n            </TabsContent>\n\n            <TabsContent value=\"weights\">\n              <Card>\n                <CardHeader>\n                  <CardTitle className=\"text-base\">Voting + Assessment Mix Configuration</CardTitle>\n                </CardHeader>\n                <CardContent>\n                  <div className=\"grid grid-cols-2 gap-6\">\n                    <div>\n                      <Label htmlFor=\"votingWeight\">Voting Weight (%)</Label>\n                      <Input\n                        id=\"votingWeight\"\n                        type=\"number\"\n                        value={weights.votingWeight}\n                        onChange={(e) => setWeights(prev => ({ ...prev, votingWeight: Number(e.target.value) }))}\n                      />\n                    </div>\n                    <div>\n                      <Label htmlFor=\"assessmentWeight\">Assessment Weight (%)</Label>\n                      <Input\n                        id=\"assessmentWeight\"\n                        type=\"number\"\n                        value={weights.assessmentWeight}\n                        onChange={(e) => setWeights(prev => ({ ...prev, assessmentWeight: Number(e.target.value) }))}\n                      />\n                    </div>\n                  </div>\n                  \n                  <div className=\"mt-6 p-4 bg-muted rounded-lg\">\n                    <h4 className=\"font-medium mb-2\">Calculation Example:</h4>\n                    <p className=\"text-sm text-muted-foreground\">\n                      Voting = Moderate (3), Assessment = Good (4)<br/>\n                      Final Score = ({weights.votingWeight}% × 3) + ({weights.assessmentWeight}% × 4) = {calculateFinalScore(3, 4).toFixed(1)}\n                    </p>\n                    {!validateWeights() && (\n                      <p className=\"text-sm text-destructive mt-2\">\n                        ⚠️ Weights must total 100%\n                      </p>\n                    )}\n                  </div>\n                </CardContent>\n              </Card>\n            </TabsContent>\n\n            <TabsContent value=\"thresholds\">\n              <Card>\n                <CardHeader>\n                  <CardTitle className=\"text-base\">Final Rating Thresholds</CardTitle>\n                </CardHeader>\n                <CardContent>\n                  <div className=\"space-y-3\">\n                    {ratingThresholds.map((threshold, index) => (\n                      <div key={index} className=\"flex items-center justify-between p-3 border rounded-lg\">\n                        <div className=\"flex items-center gap-4\">\n                          <Badge variant={\n                            threshold.label === 'Very High' ? 'default' :\n                            threshold.label === 'High' ? 'secondary' :\n                            threshold.label === 'Moderate' ? 'outline' :\n                            threshold.label === 'Low' ? 'secondary' : 'destructive'\n                          }>\n                            {threshold.label}\n                          </Badge>\n                          <span className=\"text-sm text-muted-foreground\">\n                            {threshold.min.toFixed(4)} – {threshold.max.toFixed(4)}\n                          </span>\n                        </div>\n                      </div>\n                    ))}\n                  </div>\n                </CardContent>\n              </Card>\n            </TabsContent>\n\n            <TabsContent value=\"ai-config\">\n              <div className=\"space-y-6\">\n                <Card>\n                  <CardHeader>\n                    <CardTitle className=\"text-base flex items-center gap-2\">\n                      <Bot className=\"w-5 h-5\" />\n                      AI-based Assessment Integration\n                    </CardTitle>\n                  </CardHeader>\n                  <CardContent>\n                    <div className=\"flex items-center space-x-2\">\n                      <Switch\n                        id=\"ai-assessment\"\n                        checked={aiAssessmentEnabled}\n                        onCheckedChange={setAiAssessmentEnabled}\n                      />\n                      <Label htmlFor=\"ai-assessment\">Enable AI-Based Assessment</Label>\n                    </div>\n                  </CardContent>\n                </Card>\n\n                <Card>\n                  <CardHeader>\n                    <CardTitle className=\"text-base flex items-center gap-2\">\n                      <Users className=\"w-5 h-5\" />\n                      Human vs AI Comparison\n                    </CardTitle>\n                  </CardHeader>\n                  <CardContent>\n                    <div className=\"flex items-center space-x-2\">\n                      <Switch\n                        id=\"human-ai-comparison\"\n                        checked={humanAiComparisonEnabled}\n                        onCheckedChange={setHumanAiComparisonEnabled}\n                      />\n                      <Label htmlFor=\"human-ai-comparison\">Enable Human–AI Comparison</Label>\n                    </div>\n                  </CardContent>\n                </Card>\n              </div>\n            </TabsContent>\n          </Tabs>\n\n          <div className=\"flex justify-end mt-6\">\n            <Button onClick={handleSave}>\n              <Settings className=\"w-4 h-4 mr-2\" />\n              Save Configuration\n            </Button>\n          </div>\n        </CardContent>\n      </Card>\n    </div>\n  );\n};\n\nexport default SolutionVotingAssessmentConfig;
