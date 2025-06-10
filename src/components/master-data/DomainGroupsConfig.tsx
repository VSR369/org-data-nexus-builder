
import React, { useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DomainGroupsManagement } from './domain-groups/DomainGroupsManagement';
import { CategoryTab } from './domain-groups/CategoryTab';
import { SubCategoryTab } from './domain-groups/SubCategoryTab';
import { QuickAddForm } from './domain-groups/QuickAddForm';
import { useDomainGroupsData } from './domain-groups/hooks/useDomainGroupsData';

const DomainGroupsConfig = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('quick-add');
  
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

  // Get selected objects for hierarchical display
  const selectedIndustrySegmentInfo = industrySegments.find(s => s.id === selectedIndustrySegment);
  const selectedDomainGroupInfo = domainGroups.find(d => d.id === selectedDomainGroup);
  const selectedCategoryInfo = categories.find(c => c.id === selectedCategory);

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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quick-add">Quick Add</TabsTrigger>
          <TabsTrigger value="domain-groups">Domain Groups</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="sub-categories">Sub-Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quick-add" className="space-y-4">
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
        
        <TabsContent value="domain-groups" className="space-y-4">
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
            selectedIndustrySegment={selectedIndustrySegmentInfo}
            selectedDomainGroupInfo={selectedDomainGroupInfo}
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
            selectedIndustrySegment={selectedIndustrySegmentInfo}
            selectedDomainGroupInfo={selectedDomainGroupInfo}
            selectedCategoryInfo={selectedCategoryInfo}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DomainGroupsConfig;
