import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  List,
  ListTree,
  Settings,
  Building,
  Tag,
  Tags,
  DollarSign,
  Shield,
  Database
} from 'lucide-react';
import EntityTypeConfig from './master-data/EntityTypeConfig';
import IndustrySegmentConfig from './master-data/IndustrySegmentConfig';
import DomainGroupsConfig from './master-data/DomainGroupsConfig';
import PricingConfig from './master-data/PricingConfig';
import DataHealthPanel from './master-data/debug/DataHealthPanel';
import CompetencyCapabilityConfig from './master-data/CompetencyCapabilityConfig';
import MasterDataRecoveryCenter from './master-data/recovery/MasterDataRecoveryCenter';

const MasterDataContent = () => {
  const [activeComponent, setActiveComponent] = useState<
    | 'entityTypes'
    | 'industrySegments'
    | 'domainGroups'
    | 'pricing'
    | 'debug'
    | 'recovery'
    | 'competencyCapabilities'
  >('entityTypes');

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'entityTypes':
        return <EntityTypeConfig />;
      case 'industrySegments':
        return <IndustrySegmentConfig />;
      case 'domainGroups':
        return <DomainGroupsConfig />;
      case 'pricing':
        return <PricingConfig />;
      case 'debug':
        return <DataHealthPanel />;
      case 'recovery':
        return <MasterDataRecoveryCenter />;
      case 'competencyCapabilities':
        return <CompetencyCapabilityConfig />;
      default:
        return <div>Select a configuration option from the menu.</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Master Data Portal</h1>
          <p className="text-lg text-muted-foreground">
            Configure and manage all master data for the platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveComponent('recovery')}
            variant={activeComponent === 'recovery' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Recovery Center
          </Button>
          <Button
            onClick={() => setActiveComponent('debug')}
            variant={activeComponent === 'debug' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            Data Health
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Menu</CardTitle>
          <CardDescription>Select the master data type to configure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              onClick={() => setActiveComponent('entityTypes')}
              variant={activeComponent === 'entityTypes' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Building className="w-4 h-4" />
              Organization Types
            </Button>
            <Button
              onClick={() => setActiveComponent('industrySegments')}
              variant={activeComponent === 'industrySegments' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Tag className="w-4 h-4" />
              Industry Segments
            </Button>
            <Button
              onClick={() => setActiveComponent('domainGroups')}
              variant={activeComponent === 'domainGroups' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Tags className="w-4 h-4" />
              Domain Groups
            </Button>
            <Button
              onClick={() => setActiveComponent('pricing')}
              variant={activeComponent === 'pricing' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Pricing Configuration
            </Button>
            <Button
              onClick={() => setActiveComponent('competencyCapabilities')}
              variant={activeComponent === 'competencyCapabilities' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <ListTree className="w-4 h-4" />
              Competency Capabilities
            </Button>
          </div>
        </CardContent>
      </Card>

      {renderActiveComponent()}
    </div>
  );
};

export default MasterDataContent;
