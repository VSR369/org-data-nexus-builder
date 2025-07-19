import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  Settings, 
  Users, 
  Globe, 
  Building, 
  Factory, 
  Crown,
  Calculator,
  Target,
  MessageCircle,
  FileText,
  Layers,
  BarChart3
} from 'lucide-react';

const OrganizationDashboard = () => {
  const navigate = useNavigate();

  const masterDataSections = [
    { id: 'countries', title: 'Countries', description: 'Manage global country data', icon: Globe, count: '195+' },
    { id: 'currencies', title: 'Currencies', description: 'Currency configurations', icon: BarChart3, count: '180+' },
    { id: 'organization-types', title: 'Organization Types', description: 'MSME, Enterprise, etc.', icon: Building, count: '8' },
    { id: 'entity-types', title: 'Entity Types', description: 'Legal entity classifications', icon: FileText, count: '12' },
    { id: 'industry-segments', title: 'Industry Segments', description: 'Business sector categories', icon: Factory, count: '25+' },
    { id: 'engagement-models', title: 'Engagement Models', description: 'Platform engagement types', icon: Target, count: '4' },
    { id: 'pricing-tiers', title: 'Pricing Tiers', description: 'Subscription level management', icon: Crown, count: '6' },
    { id: 'platform-fee-formulas', title: 'Fee Formulas', description: 'Complex calculation rules', icon: Calculator, count: '15+' },
    { id: 'tier-configurations', title: 'Tier Configurations', description: 'Advanced tier settings', icon: Settings, count: '50+' },
    { id: 'domain-groups', title: 'Domain Groups', description: 'Business domain categories', icon: Layers, count: '30+' },
    { id: 'departments', title: 'Departments', description: 'Organizational departments', icon: Users, count: '20+' },
    { id: 'communication-types', title: 'Communication', description: 'Contact methods & channels', icon: MessageCircle, count: '10+' }
  ];

  const handleCardClick = (sectionId: string) => {
    navigate(`/master-data/${sectionId}`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Organization Dashboard</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Manage your platform's master data configurations, pricing models, and business rules
          </p>
          <Badge variant="secondary" className="text-sm">
            <Database className="w-4 h-4 mr-1" />
            Master Data Management System
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Database className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Active Modules</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm text-muted-foreground">Configurations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Crown className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">6</p>
                  <p className="text-sm text-muted-foreground">Pricing Tiers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calculator className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">15+</p>
                  <p className="text-sm text-muted-foreground">Fee Formulas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Master Data Sections */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Master Data Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {masterDataSections.map((section) => {
              const Icon = section.icon;
              return (
                <Card 
                  key={section.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-2 hover:border-primary/50"
                  onClick={() => handleCardClick(section.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                        </div>
                      </div>
                      <Badge variant="outline">{section.count}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm mb-4">
                      {section.description}
                    </CardDescription>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(section.id);
                      }}
                    >
                      Manage {section.title}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDashboard;