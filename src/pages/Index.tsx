
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IndustrySegmentConfig from '../components/master-data/IndustrySegmentConfig';
import OrganizationTypeConfig from '../components/master-data/OrganizationTypeConfig';
import EntityTypeConfig from '../components/master-data/EntityTypeConfig';
import DepartmentConfig from '../components/master-data/DepartmentConfig';
import { Building2, Settings, Users, Briefcase } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Master Data Setup</h1>
          <p className="text-xl text-muted-foreground">Configure organization master data and taxonomies</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Organization Configuration
            </CardTitle>
            <CardDescription>
              Set up and manage master data for industry segments, organization types, entity types, and department structures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="industry-segments" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="industry-segments" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Industry Segments
                </TabsTrigger>
                <TabsTrigger value="organization-types" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Organization Types
                </TabsTrigger>
                <TabsTrigger value="entity-types" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Entity Types
                </TabsTrigger>
                <TabsTrigger value="departments" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Departments
                </TabsTrigger>
              </TabsList>

              <TabsContent value="industry-segments" className="mt-6">
                <IndustrySegmentConfig />
              </TabsContent>

              <TabsContent value="organization-types" className="mt-6">
                <OrganizationTypeConfig />
              </TabsContent>

              <TabsContent value="entity-types" className="mt-6">
                <EntityTypeConfig />
              </TabsContent>

              <TabsContent value="departments" className="mt-6">
                <DepartmentConfig />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
