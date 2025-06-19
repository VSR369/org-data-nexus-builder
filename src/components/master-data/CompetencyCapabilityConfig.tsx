
import React, { useState, useEffect } from 'react';
import CapabilityLevelsManagement from './competency-capability/CapabilityLevelsManagement';
import { CapabilityLevel } from './competency-capability/types';
import { DEFAULT_CAPABILITY_LEVELS, COLOR_OPTIONS } from './competency-capability/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LegacyDataManager } from '@/utils/core/DataManager';
import { Award, Target, BarChart3, Settings } from 'lucide-react';

const dataManager = new LegacyDataManager<CapabilityLevel[]>({
  key: 'master_data_capability_levels',
  defaultData: DEFAULT_CAPABILITY_LEVELS,
  version: 1
});

const competencyDataManager = new LegacyDataManager<any[]>({
  key: 'master_data_competencies',
  defaultData: [
    {
      id: 'technical',
      name: 'Technical Competencies',
      description: 'Technical skills and expertise',
      categories: [
        'Software Development',
        'Data Analysis',
        'System Architecture',
        'Database Management',
        'Network Administration'
      ]
    },
    {
      id: 'functional',
      name: 'Functional Competencies',
      description: 'Domain-specific functional knowledge',
      categories: [
        'Business Analysis',
        'Project Management',
        'Quality Assurance',
        'User Experience Design',
        'Product Management'
      ]
    },
    {
      id: 'behavioral',
      name: 'Behavioral Competencies',
      description: 'Soft skills and behavioral traits',
      categories: [
        'Leadership',
        'Communication',
        'Problem Solving',
        'Teamwork',
        'Adaptability'
      ]
    }
  ],
  version: 1
});

const CompetencyCapabilityConfig = () => {
  const [capabilityLevels, setCapabilityLevels] = useState<CapabilityLevel[]>([]);
  const [competencies, setCompetencies] = useState<any[]>([]);
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    const loadedLevels = dataManager.loadData();
    const loadedCompetencies = competencyDataManager.loadData();
    setCapabilityLevels(loadedLevels);
    setCompetencies(loadedCompetencies);
  }, []);

  // Save data whenever capabilityLevels change
  useEffect(() => {
    if (capabilityLevels.length > 0) {
      dataManager.saveData(capabilityLevels);
    }
  }, [capabilityLevels]);

  // Save data whenever competencies change
  useEffect(() => {
    if (competencies.length > 0) {
      competencyDataManager.saveData(competencies);
    }
  }, [competencies]);

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-foreground mb-2">Competency & Capability Configuration</h2>
        <p className="text-lg text-muted-foreground">
          Manage competency frameworks, capability levels, assessment parameters, and rating scales
        </p>
      </div>

      <Tabs defaultValue="capability-levels" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="capability-levels" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Capability Levels
          </TabsTrigger>
          <TabsTrigger value="competencies" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Competencies
          </TabsTrigger>
          <TabsTrigger value="assessment" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Assessment Rules
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="capability-levels">
          <CapabilityLevelsManagement
            capabilityLevels={capabilityLevels}
            onCapabilityLevelsChange={setCapabilityLevels}
            colorOptions={COLOR_OPTIONS}
          />
        </TabsContent>

        <TabsContent value="competencies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Competency Framework Management
              </CardTitle>
              <CardDescription>
                Define and manage competency categories and their associated skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {competencies.map((competency, index) => (
                  <Card key={competency.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{competency.name}</CardTitle>
                      <CardDescription>{competency.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {competency.categories.map((category: string, catIndex: number) => (
                          <div key={catIndex} className="p-2 bg-muted rounded-md text-sm">
                            {category}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Assessment Configuration
              </CardTitle>
              <CardDescription>
                Configure assessment rules, scoring methods, and evaluation criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Scoring Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Current: 5-point scale with weighted averages
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Assessment Frequency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Quarterly assessments with annual reviews
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Global Settings
              </CardTitle>
              <CardDescription>
                Configure global competency and capability management settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Rating Scale</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        5-point scale: Novice, Beginner, Competent, Proficient, Expert
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Validation Rules</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Minimum proficiency thresholds and certification requirements
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompetencyCapabilityConfig;
