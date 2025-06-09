
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '../components/AppSidebar';
import IndustrySegmentConfig from '../components/master-data/IndustrySegmentConfig';
import OrganizationTypeConfig from '../components/master-data/OrganizationTypeConfig';
import EntityTypeConfig from '../components/master-data/EntityTypeConfig';
import DepartmentConfig from '../components/master-data/DepartmentConfig';
import { Settings } from 'lucide-react';

const Index = () => {
  const [activeSection, setActiveSection] = useState('industry-segments');

  const renderContent = () => {
    switch (activeSection) {
      case 'industry-segments':
        return <IndustrySegmentConfig />;
      case 'organization-types':
        return <OrganizationTypeConfig />;
      case 'entity-types':
        return <EntityTypeConfig />;
      case 'departments':
        return <DepartmentConfig />;
      default:
        return <IndustrySegmentConfig />;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'industry-segments':
        return 'Industry Segments';
      case 'organization-types':
        return 'Organization Types';
      case 'entity-types':
        return 'Entity Types';
      case 'departments':
        return 'Departments';
      default:
        return 'Industry Segments';
    }
  };

  const getSectionDescription = () => {
    switch (activeSection) {
      case 'industry-segments':
        return 'Configure and manage industry segment classifications';
      case 'organization-types':
        return 'Set up organization type categories for different business entities';
      case 'entity-types':
        return 'Configure organization entity types for legal classification';
      case 'departments':
        return 'Manage department categories and subcategories';
      default:
        return 'Configure and manage industry segment classifications';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <SidebarTrigger />
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Master Data Setup</h1>
                <p className="text-xl text-muted-foreground">Configure organization master data and taxonomies</p>
              </div>
            </div>

            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  {getSectionTitle()}
                </CardTitle>
                <CardDescription>
                  {getSectionDescription()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderContent()}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
