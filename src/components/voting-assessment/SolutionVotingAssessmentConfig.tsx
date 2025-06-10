
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Settings, Target, Users, Bot } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Parameter {
  id: string;
  name: string;
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

  // Assessment Parameters
  const [groups, setGroups] = useState<AssessmentLevel[]>([]);
  const [categories, setCategories] = useState<AssessmentLevel[]>([]);
  const [subCategories, setSubCategories] = useState<AssessmentLevel[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

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

  const addParameter = (levelType: 'group' | 'category' | 'subCategory', levelId: string) => {
    const newParameter: Parameter = {
      id: Date.now().toString(),
      name: '',
      weightage: 0
    };

    if (levelType === 'group') {
      setGroups(prev => prev.map(group => 
        group.id === levelId 
          ? { ...group, parameters: [...group.parameters, newParameter] }
          : group
      ));
    } else if (levelType === 'category') {
      setCategories(prev => prev.map(category => 
        category.id === levelId 
          ? { ...category, parameters: [...category.parameters, newParameter] }
          : category
      ));
    } else {
      setSubCategories(prev => prev.map(subCategory => 
        subCategory.id === levelId 
          ? { ...subCategory, parameters: [...subCategory.parameters, newParameter] }
          : subCategory
      ));
    }
  };

  const updateParameter = (levelType: 'group' | 'category' | 'subCategory', levelId: string, parameterId: string, field: 'name' | 'weightage', value: string | number) => {
    const updateLevel = (levels: AssessmentLevel[]) => 
      levels.map(level => 
        level.id === levelId 
          ? {
              ...level,
              parameters: level.parameters.map(param => 
                param.id === parameterId 
                  ? { ...param, [field]: value }
                  : param
              )
            }
          : level
      );

    if (levelType === 'group') {
      setGroups(updateLevel);
    } else if (levelType === 'category') {
      setCategories(updateLevel);
    } else {
      setSubCategories(updateLevel);
    }
  };

  const removeParameter = (levelType: 'group' | 'category' | 'subCategory', levelId: string, parameterId: string) => {
    const updateLevel = (levels: AssessmentLevel[]) => 
      levels.map(level => 
        level.id === levelId 
          ? {
              ...level,
              parameters: level.parameters.filter(param => param.id !== parameterId)
            }
          : level
      );

    if (levelType === 'group') {
      setGroups(updateLevel);
    } else if (levelType === 'category') {
      setCategories(updateLevel);
    } else {
      setSubCategories(updateLevel);
    }
  };

  const addGroup = () => {
    const newGroup: AssessmentLevel = {
      id: Date.now().toString(),
      name: '',
      parameters: [],
      overrideParent: false
    };
    setGroups(prev => [...prev, newGroup]);
  };

  const calculateFinalScore = (votingScore: number, assessmentScore: number) => {
    return ((weights.votingWeight / 100) * votingScore) + ((weights.assessmentWeight / 100) * assessmentScore);
  };

  const getRatingLabel = (score: number) => {
    const threshold = ratingThresholds.find(t => score >= t.min && score <= t.max);
    return threshold?.label || 'Unknown';
  };

  const validateWeights = () => {
    return weights.votingWeight + weights.assessmentWeight === 100;
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

    // Here you would typically save to backend
    toast({
      title: "Success",
      description: "Voting & Assessment configuration saved successfully",
    });
  };

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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between">
                      Competency Group Level
                      <Button onClick={addGroup} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Group
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {groups.map((group) => (
                      <div key={group.id} className="border rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-4 mb-4">
                          <Input
                            placeholder="Group Name"
                            value={group.name}
                            onChange={(e) => setGroups(prev => prev.map(g => 
                              g.id === group.id ? { ...g, name: e.target.value } : g
                            ))}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addParameter('group', group.id)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          {group.parameters.map((param) => (
                            <div key={param.id} className="flex items-center gap-2">
                              <Input
                                placeholder="Parameter Name"
                                value={param.name}
                                onChange={(e) => updateParameter('group', group.id, param.id, 'name', e.target.value)}
                              />
                              <Input
                                type="number"
                                placeholder="Weight %"
                                value={param.weightage}
                                onChange={(e) => updateParameter('group', group.id, param.id, 'weightage', Number(e.target.value))}
                                className="w-24"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeParameter('group', group.id, param.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
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
