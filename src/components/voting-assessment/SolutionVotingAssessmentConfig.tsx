
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
        description: "Category parameters total weightage cannot exceed 100%",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Voting & Assessment configuration saved successfully",
    });
  };

  const activeParameters = groupParameters.length > 0 ? groupParameters : categoryParameters;
  const activeLevel = groupParameters.length > 0 ? 'group' : 'category';
  const totalWeightage = calculateTotalWeightage(activeParameters);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Solution Voting & Assessment Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="voting-scale" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="voting-scale">Voting Scale</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="weights">Weights</TabsTrigger>
              <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
              <TabsTrigger value="ai-config">AI Config</TabsTrigger>
            </TabsList>

            <TabsContent value="voting-scale">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Voting Scale Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(votingScale).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <Badge variant="outline" className="mb-2">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Badge>
                        <div className="text-2xl font-bold">{value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assessment">
              <div className="space-y-6">
                {/* Selection Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Solution Assessment Criteria</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Industry Segment Selection */}
                    <div>
                      <Label htmlFor="industry-segment">Industry Segment</Label>
                      <Select value={selectedIndustrySegment} onValueChange={setSelectedIndustrySegment}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry segment" />
                        </SelectTrigger>
                        <SelectContent>
                          {industrySegments.map((segment, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {segment}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Domain Group Selection */}
                    {selectedIndustrySegment && (
                      <div>
                        <Label htmlFor="domain-group">Domain Group</Label>
                        <Select value={selectedDomainGroup} onValueChange={setSelectedDomainGroup}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select domain group" />
                          </SelectTrigger>
                          <SelectContent>
                            {getFilteredDomainGroups().map((group) => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Category Selection */}
                    {selectedDomainGroup && (
                      <div>
                        <Label htmlFor="category">Category (Optional)</Label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No specific category</SelectItem>
                            {getSelectedDomainGroup()?.categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Parameters Configuration */}
                {selectedDomainGroup && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center justify-between">
                        Assessment Parameters
                        <div className="flex items-center gap-2">
                          <Badge variant={totalWeightage > 100 ? "destructive" : totalWeightage === 100 ? "default" : "secondary"}>
                            Total: {totalWeightage}%
                          </Badge>
                          <Button 
                            onClick={() => addParameter(selectedCategory && selectedCategory !== 'none' ? 'category' : 'group')} 
                            size="sm"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Parameter
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Configuration Info */}
                      <Alert className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          {selectedCategory && selectedCategory !== 'none'
                            ? `Setting parameters at Category level: ${getSelectedCategory()?.name}. These will apply to all sub-categories.`
                            : `Setting parameters at Group level: ${getSelectedDomainGroup()?.name}. These will apply to all categories and sub-categories unless overridden.`
                          }
                        </AlertDescription>
                      </Alert>

                      {/* Parameters List */}
                      <div className="space-y-4">
                        {activeParameters.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No parameters configured. Click "Add Parameter" to get started.
                          </div>
                        ) : (
                          activeParameters.map((param) => (
                            <div key={param.id} className="border rounded-lg p-4 space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <Label htmlFor={`param-name-${param.id}`}>Parameter Name</Label>
                                  <Input
                                    id={`param-name-${param.id}`}
                                    placeholder="Enter parameter name"
                                    value={param.name}
                                    onChange={(e) => updateParameter(activeLevel, param.id, 'name', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`param-weight-${param.id}`}>Weightage (%)</Label>
                                  <Input
                                    id={`param-weight-${param.id}`}
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="0"
                                    value={param.weightage}
                                    onChange={(e) => updateParameter(activeLevel, param.id, 'weightage', Number(e.target.value))}
                                  />
                                </div>
                                <div className="flex items-end">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeParameter(activeLevel, param.id)}
                                    className="w-full"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remove
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Label htmlFor={`param-desc-${param.id}`}>Description</Label>
                                <Textarea
                                  id={`param-desc-${param.id}`}
                                  placeholder="Enter parameter description"
                                  value={param.description}
                                  onChange={(e) => updateParameter(activeLevel, param.id, 'description', e.target.value)}
                                  rows={2}
                                />
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Weightage Validation */}
                      {totalWeightage > 100 && (
                        <Alert className="mt-4" variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Total weightage ({totalWeightage}%) exceeds 100%. Please adjust the parameter weightages.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="weights">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Voting + Assessment Mix Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="votingWeight">Voting Weight (%)</Label>
                      <Input
                        id="votingWeight"
                        type="number"
                        value={weights.votingWeight}
                        onChange={(e) => setWeights(prev => ({ ...prev, votingWeight: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="assessmentWeight">Assessment Weight (%)</Label>
                      <Input
                        id="assessmentWeight"
                        type="number"
                        value={weights.assessmentWeight}
                        onChange={(e) => setWeights(prev => ({ ...prev, assessmentWeight: Number(e.target.value) }))}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Calculation Example:</h4>
                    <p className="text-sm text-muted-foreground">
                      Voting = Moderate (3), Assessment = Good (4)<br/>
                      Final Score = ({weights.votingWeight}% × 3) + ({weights.assessmentWeight}% × 4) = {calculateFinalScore(3, 4).toFixed(1)}
                    </p>
                    {!validateWeights() && (
                      <p className="text-sm text-destructive mt-2">
                        ⚠️ Weights must total 100%
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="thresholds">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Final Rating Thresholds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ratingThresholds.map((threshold, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Badge variant={
                            threshold.label === 'Very High' ? 'default' :
                            threshold.label === 'High' ? 'secondary' :
                            threshold.label === 'Moderate' ? 'outline' :
                            threshold.label === 'Low' ? 'secondary' : 'destructive'
                          }>
                            {threshold.label}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {threshold.min.toFixed(4)} – {threshold.max.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-config">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bot className="w-5 h-5" />
                      AI-based Assessment Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="ai-assessment"
                        checked={aiAssessmentEnabled}
                        onCheckedChange={setAiAssessmentEnabled}
                      />
                      <Label htmlFor="ai-assessment">Enable AI-Based Assessment</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Human vs AI Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="human-ai-comparison"
                        checked={humanAiComparisonEnabled}
                        onCheckedChange={setHumanAiComparisonEnabled}
                      />
                      <Label htmlFor="human-ai-comparison">Enable Human–AI Comparison</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSave}>
              <Settings className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolutionVotingAssessmentConfig;
