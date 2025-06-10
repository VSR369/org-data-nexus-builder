
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IndustrySegmentTab } from './domain-groups/IndustrySegmentTab';
import { DomainGroupTab } from './domain-groups/DomainGroupTab';
import { CategoryTab } from './domain-groups/CategoryTab';
import { SubCategoryTab } from './domain-groups/SubCategoryTab';
import { useDomainGroupsData } from './domain-groups/hooks/useDomainGroupsData';

const DomainGroupsConfig = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('industry-segments');
  
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

      <Card>
        <CardHeader className="text-left">
          <CardTitle className="text-2xl">Domain Groups Structure</CardTitle>
          <CardDescription>
            Manage domain groups hierarchy by industry segment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="industry-segments">Industry Segments</TabsTrigger>
              <TabsTrigger value="domain-groups">Domain Groups</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="sub-categories">Sub-Categories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="industry-segments" className="space-y-4">
              <IndustrySegmentTab 
                industrySegments={industrySegments}
                selectedIndustrySegment={selectedIndustrySegment}
                onSelectIndustrySegment={setSelectedIndustrySegment}
                showMessage={showMessage}
              />
            </TabsContent>
            
            <TabsContent value="domain-groups" className="space-y-4">
              <DomainGroupTab
                selectedIndustrySegment={selectedIndustrySegment}
                domainGroups={domainGroups}
                selectedDomainGroup={selectedDomainGroup}
                onSelectDomainGroup={setSelectedDomainGroup}
                onAddDomainGroup={addDomainGroup}
                onUpdateDomainGroup={updateDomainGroup}
                onDeleteDomainGroup={deleteDomainGroup}
                showMessage={showMessage}
              />
            </TabsContent>
            
            <TabsContent value="categories" className="space-y-4">
              <CategoryTab
                selectedDomainGroup={selectedDomainGroup}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onAddCategory={addCategory}
                onUpdateCategory={updateCategory}
                onDeleteCategory={deleteCategory}
                showMessage={showMessage}
              />
            </TabsContent>
            
            <TabsContent value="sub-categories" className="space-y-4">
              <SubCategoryTab
                selectedCategory={selectedCategory}
                subCategories={subCategories}
                onAddSubCategory={addSubCategory}
                onUpdateSubCategory={updateSubCategory}
                onDeleteSubCategory={deleteSubCategory}
                showMessage={showMessage}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainGroupsConfig;
