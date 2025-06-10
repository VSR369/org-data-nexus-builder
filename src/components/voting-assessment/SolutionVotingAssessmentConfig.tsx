import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Eye, Settings, Users, Vote, Target } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Temporary hardcoded industry segments
const industrySegments = [
  'Banking & Finance',
  'Healthcare & Life Sciences', 
  'Technology & Software',
  'Manufacturing',
  'Retail & Consumer Goods',
  'Logistics & Supply Chain',
  'Energy & Utilities',
  'Education',
  'Government & Public Sector',
  'Real Estate & Construction'
];

const SolutionVotingAssessmentConfig: React.FC = () => {
  const [selectedIndustrySegment, setSelectedIndustrySegment] = useState('');
  const [votingSettings, setVotingSettings] = useState({
    isEnabled: true,
    votingDuration: 30,
    minVotesToClose: 10,
    allowAnonymousVoting: false,
    requireComments: true
  });

  const [assessmentSettings, setAssessmentSettings] = useState({
    isEnabled: true,
    assessmentDuration: 14,
    minAssessorsRequired: 3,
    allowSelfAssessment: false,
    requireDetailedFeedback: true
  });

  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const savedVotingSettings = localStorage.getItem('votingSettings');
      const savedAssessmentSettings = localStorage.getItem('assessmentSettings');
      
      if (savedVotingSettings) {
        setVotingSettings(JSON.parse(savedVotingSettings));
      }
      
      if (savedAssessmentSettings) {
        setAssessmentSettings(JSON.parse(savedAssessmentSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('votingSettings', JSON.stringify(votingSettings));
      localStorage.setItem('assessmentSettings', JSON.stringify(assessmentSettings));
      
      toast({
        title: "Settings Saved",
        description: "Solution voting and assessment settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="w-5 h-5" />
            Solution Voting & Assessment Configuration
          </CardTitle>
          <CardDescription>
            Configure voting and assessment settings for solution evaluation across different industry segments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="industry-segment">Industry Segment</Label>
              <Select value={selectedIndustrySegment} onValueChange={setSelectedIndustrySegment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry segment" />
                </SelectTrigger>
                <SelectContent>
                  {industrySegments.map((segment, index) => (
                    <SelectItem key={index} value={segment}>
                      {segment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="voting" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="voting" className="flex items-center gap-2">
            <Vote className="w-4 h-4" />
            Voting Settings
          </TabsTrigger>
          <TabsTrigger value="assessment" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Assessment Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="voting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Voting Configuration</CardTitle>
              <CardDescription>
                Configure how community voting works for solutions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="voting-enabled">Enable Voting</Label>
                  <p className="text-sm text-muted-foreground">Allow community to vote on solutions</p>
                </div>
                <Switch
                  id="voting-enabled"
                  checked={votingSettings.isEnabled}
                  onCheckedChange={(checked) => 
                    setVotingSettings(prev => ({ ...prev, isEnabled: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="voting-duration">Voting Duration (days)</Label>
                  <Input
                    id="voting-duration"
                    type="number"
                    min="1"
                    max="365"
                    value={votingSettings.votingDuration}
                    onChange={(e) => 
                      setVotingSettings(prev => ({ 
                        ...prev, 
                        votingDuration: parseInt(e.target.value) || 30 
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="min-votes">Minimum Votes to Close</Label>
                  <Input
                    id="min-votes"
                    type="number"
                    min="1"
                    max="1000"
                    value={votingSettings.minVotesToClose}
                    onChange={(e) => 
                      setVotingSettings(prev => ({ 
                        ...prev, 
                        minVotesToClose: parseInt(e.target.value) || 10 
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="anonymous-voting">Allow Anonymous Voting</Label>
                  <p className="text-sm text-muted-foreground">Users can vote without revealing identity</p>
                </div>
                <Switch
                  id="anonymous-voting"
                  checked={votingSettings.allowAnonymousVoting}
                  onCheckedChange={(checked) => 
                    setVotingSettings(prev => ({ ...prev, allowAnonymousVoting: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="require-comments">Require Comments</Label>
                  <p className="text-sm text-muted-foreground">Voters must provide feedback comments</p>
                </div>
                <Switch
                  id="require-comments"
                  checked={votingSettings.requireComments}
                  onCheckedChange={(checked) => 
                    setVotingSettings(prev => ({ ...prev, requireComments: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assessment Configuration</CardTitle>
              <CardDescription>
                Configure professional assessment process for solutions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="assessment-enabled">Enable Assessment</Label>
                  <p className="text-sm text-muted-foreground">Enable professional solution assessment</p>
                </div>
                <Switch
                  id="assessment-enabled"
                  checked={assessmentSettings.isEnabled}
                  onCheckedChange={(checked) => 
                    setAssessmentSettings(prev => ({ ...prev, isEnabled: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assessment-duration">Assessment Duration (days)</Label>
                  <Input
                    id="assessment-duration"
                    type="number"
                    min="1"
                    max="90"
                    value={assessmentSettings.assessmentDuration}
                    onChange={(e) => 
                      setAssessmentSettings(prev => ({ 
                        ...prev, 
                        assessmentDuration: parseInt(e.target.value) || 14 
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="min-assessors">Minimum Assessors Required</Label>
                  <Input
                    id="min-assessors"
                    type="number"
                    min="1"
                    max="20"
                    value={assessmentSettings.minAssessorsRequired}
                    onChange={(e) => 
                      setAssessmentSettings(prev => ({ 
                        ...prev, 
                        minAssessorsRequired: parseInt(e.target.value) || 3 
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="self-assessment">Allow Self Assessment</Label>
                  <p className="text-sm text-muted-foreground">Solution providers can assess their own solutions</p>
                </div>
                <Switch
                  id="self-assessment"
                  checked={assessmentSettings.allowSelfAssessment}
                  onCheckedChange={(checked) => 
                    setAssessmentSettings(prev => ({ ...prev, allowSelfAssessment: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="detailed-feedback">Require Detailed Feedback</Label>
                  <p className="text-sm text-muted-foreground">Assessors must provide comprehensive feedback</p>
                </div>
                <Switch
                  id="detailed-feedback"
                  checked={assessmentSettings.requireDetailedFeedback}
                  onCheckedChange={(checked) => 
                    setAssessmentSettings(prev => ({ ...prev, requireDetailedFeedback: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={loadSettings}>
          Reset to Saved
        </Button>
        <Button onClick={saveSettings}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SolutionVotingAssessmentConfig;
