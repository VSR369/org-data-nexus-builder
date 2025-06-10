
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EnrollmentTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

const EnrollmentTabs: React.FC<EnrollmentTabsProps> = ({
  activeTab,
  onTabChange,
  children
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="basic-details">Basic Information</TabsTrigger>
        <TabsTrigger value="core-competencies">Core Competencies</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export default EnrollmentTabs;
