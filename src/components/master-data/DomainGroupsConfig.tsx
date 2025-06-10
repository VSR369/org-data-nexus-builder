
import React, { useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DomainGroupsManagement } from './domain-groups/DomainGroupsManagement';
import { QuickAddForm } from './domain-groups/QuickAddForm';
import { useDomainGroupsData } from './domain-groups/hooks/useDomainGroupsData';

const DomainGroupsConfig = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('domain-groups-creation');
  
  const {
    industrySegments,
    domainGroups,
    categories,
    subCategories,
    selectedIndustrySegment,
    selectedDomainGroup,
    selectedCategory,
    setSelectedIndustrySegment,
    setSelectedDomainGroup,
    setSelectedCategory,
    addDomainGroup,
    updateDomainGroup,
    deleteDomainGroup,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory
  } = useDomainGroupsData();

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-foreground mb-2">Domain Groups Configuration</h2>
        <p className="text-lg text-muted-foreground">
          Configure the hierarchical structure of Domain Groups, Categories, and Sub-Categories for each industry segment
        </p>
      </div>

      {message && (
        <Alert>
          <AlertDescription className="text-left text-base">{message}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="domain-groups-creation">Domain Groups Creation</TabsTrigger>
          <TabsTrigger value="domain-group-hierarchy">Domain Group Hierarchy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="domain-groups-creation" className="space-y-4">
          <QuickAddForm
            industrySegments={industrySegments}
            domainGroups={domainGroups}
            selectedIndustrySegment={selectedIndustrySegment}
            selectedDomainGroup={selectedDomainGroup}
            selectedCategory={selectedCategory}
            onSelectIndustrySegment={setSelectedIndustrySegment}
            onAddDomainGroup={addDomainGroup}
            onAddCategory={addCategory}
            onAddSubCategory={addSubCategory}
            showMessage={showMessage}
          />
        </TabsContent>
        
        <TabsContent value="domain-group-hierarchy" className="space-y-4">
          <DomainGroupsManagement
            industrySegments={industrySegments}
            selectedIndustrySegment={selectedIndustrySegment}
            onSelectIndustrySegment={setSelectedIndustrySegment}
            domainGroups={domainGroups}
            selectedDomainGroup={selectedDomainGroup}
            onSelectDomainGroup={setSelectedDomainGroup}
            onAddDomainGroup={addDomainGroup}
            onUpdateDomainGroup={updateDomainGroup}
            onDeleteDomainGroup={deleteDomainGroup}
            showMessage={showMessage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DomainGroupsConfig;
