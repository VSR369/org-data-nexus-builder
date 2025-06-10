
import React, { useState, useEffect } from 'react';
import { IndustrySegment, DomainGroup } from './types';
import { IndustrySegmentSelection } from './components/IndustrySegmentSelection';
import { DomainGroupCreation } from './components/DomainGroupCreation';
import { CategoryCreation } from './components/CategoryCreation';

interface QuickAddFormProps {
  industrySegments: IndustrySegment[];
  domainGroups: DomainGroup[];
  selectedIndustrySegment: string;
  selectedDomainGroup: string;
  selectedCategory: string;
  onSelectIndustrySegment: (segmentId: string) => void;
  onAddDomainGroup: (group: Omit<DomainGroup, 'id' | 'createdAt' | 'categories'>) => void;
  onAddCategory: (category: { name: string; description?: string; domainGroupId: string; isActive: boolean }) => void;
  onAddSubCategory: (subCategory: { name: string; description?: string; categoryId: string; isActive: boolean }) => void;
  showMessage: (message: string) => void;
}

export const QuickAddForm: React.FC<QuickAddFormProps> = ({
  industrySegments: propsIndustrySegments,
  domainGroups,
  selectedIndustrySegment,
  selectedDomainGroup,
  selectedCategory,
  onSelectIndustrySegment,
  onAddDomainGroup,
  onAddCategory,
  onAddSubCategory,
  showMessage
}) => {
  const [subCategoryName, setSubCategoryName] = useState('');
  const [subCategoryDescription, setSubCategoryDescription] = useState('');
  const [masterDataSegments, setMasterDataSegments] = useState<IndustrySegment[]>([]);

  // Load industry segments from master data
  useEffect(() => {
    const loadMasterDataSegments = () => {
      const savedIndustrySegments = localStorage.getItem('master_data_industry_segments');
      if (savedIndustrySegments) {
        try {
          const industrySegmentsData: IndustrySegment[] = JSON.parse(savedIndustrySegments);
          console.log('QuickAddForm - Loading industry segments from master data:', industrySegmentsData);
          const activeSegments = industrySegmentsData.filter(segment => segment.isActive);
          console.log('QuickAddForm - Active segments:', activeSegments);
          setMasterDataSegments(activeSegments);
        } catch (error) {
          console.error('QuickAddForm - Error parsing industry segments from master data:', error);
          setMasterDataSegments([]);
        }
      } else {
        console.log('QuickAddForm - No industry segments found in master data');
        setMasterDataSegments([]);
      }
    };

    loadMasterDataSegments();
    
    // Listen for storage changes to update segments when master data changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'master_data_industry_segments') {
        loadMasterDataSegments();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Use master data segments, fallback to props if needed
  const availableSegments = masterDataSegments.length > 0 ? masterDataSegments : propsIndustrySegments;
  console.log('QuickAddForm - Available segments for selection:', availableSegments);

  const selectedSegmentInfo = availableSegments.find(s => s.id === selectedIndustrySegment);

  const handleAddSubCategory = () => {
    if (!selectedCategory) {
      showMessage('Please select a category first');
      return;
    }
    if (!subCategoryName.trim()) {
      showMessage('Please enter a sub-category name');
      return;
    }

    onAddSubCategory({
      name: subCategoryName.trim(),
      description: subCategoryDescription.trim() || undefined,
      categoryId: selectedCategory,
      isActive: true
    });

    setSubCategoryName('');
    setSubCategoryDescription('');
    showMessage(`Sub-category "${subCategoryName}" added successfully`);
  };

  return (
    <div className="space-y-6">
      <IndustrySegmentSelection
        industrySegments={availableSegments}
        selectedIndustrySegment={selectedIndustrySegment}
        onSelectIndustrySegment={onSelectIndustrySegment}
      />

      <DomainGroupCreation
        selectedIndustrySegment={selectedIndustrySegment}
        selectedSegmentInfo={selectedSegmentInfo}
        onAddDomainGroup={onAddDomainGroup}
        showMessage={showMessage}
      />

      <CategoryCreation
        selectedIndustrySegment={selectedIndustrySegment}
        domainGroups={domainGroups}
        selectedDomainGroup={selectedDomainGroup}
        onAddCategory={onAddCategory}
        showMessage={showMessage}
      />
    </div>
  );
};
