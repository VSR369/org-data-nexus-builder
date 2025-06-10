
import { useState, useEffect } from 'react';
import { IndustrySegment, DomainGroup, Category, SubCategory } from '../types';

// Mock industry segments data - in real app, this would come from API
const mockIndustrySegments: IndustrySegment[] = [
  { id: '1', name: 'Banking, Financial Services & Insurance (BFSI)', code: 'bfsi' },
  { id: '2', name: 'Retail & E-Commerce', code: 'retail' },
  { id: '3', name: 'Healthcare & Life Sciences', code: 'healthcare' },
  { id: '4', name: 'Information Technology & Software Services', code: 'it' },
  { id: '5', name: 'Telecommunications', code: 'telecom' },
  { id: '6', name: 'Education & EdTech', code: 'education' },
  { id: '7', name: 'Manufacturing', code: 'manufacturing' },
  { id: '8', name: 'Logistics & Supply Chain', code: 'logistics' }
];

export const useDomainGroupsData = () => {
  const [industrySegments] = useState<IndustrySegment[]>(mockIndustrySegments);
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  
  const [selectedIndustrySegment, setSelectedIndustrySegment] = useState<string>('');
  const [selectedDomainGroup, setSelectedDomainGroup] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Filter data based on selections
  const filteredDomainGroups = domainGroups.filter(
    group => !selectedIndustrySegment || group.industrySegmentId === selectedIndustrySegment
  );

  const filteredCategories = categories.filter(
    category => !selectedDomainGroup || category.domainGroupId === selectedDomainGroup
  );

  const filteredSubCategories = subCategories.filter(
    subCategory => !selectedCategory || subCategory.categoryId === selectedCategory
  );

  // Domain Group operations
  const addDomainGroup = (group: Omit<DomainGroup, 'id' | 'createdAt'>) => {
    const newGroup: DomainGroup = {
      ...group,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setDomainGroups(prev => [...prev, newGroup]);
  };

  const updateDomainGroup = (id: string, updates: Partial<DomainGroup>) => {
    setDomainGroups(prev => prev.map(group => 
      group.id === id ? { ...group, ...updates } : group
    ));
  };

  const deleteDomainGroup = (id: string) => {
    setDomainGroups(prev => prev.filter(group => group.id !== id));
    // Also delete related categories and sub-categories
    const relatedCategories = categories.filter(cat => cat.domainGroupId === id);
    relatedCategories.forEach(cat => {
      setSubCategories(prev => prev.filter(sub => sub.categoryId !== cat.id));
    });
    setCategories(prev => prev.filter(cat => cat.domainGroupId !== id));
  };

  // Category operations
  const addCategory = (category: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(category => 
      category.id === id ? { ...category, ...updates } : category
    ));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
    // Also delete related sub-categories
    setSubCategories(prev => prev.filter(sub => sub.categoryId !== id));
  };

  // Sub-Category operations
  const addSubCategory = (subCategory: Omit<SubCategory, 'id' | 'createdAt'>) => {
    const newSubCategory: SubCategory = {
      ...subCategory,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setSubCategories(prev => [...prev, newSubCategory]);
  };

  const updateSubCategory = (id: string, updates: Partial<SubCategory>) => {
    setSubCategories(prev => prev.map(subCategory => 
      subCategory.id === id ? { ...subCategory, ...updates } : subCategory
    ));
  };

  const deleteSubCategory = (id: string) => {
    setSubCategories(prev => prev.filter(subCategory => subCategory.id !== id));
  };

  return {
    industrySegments,
    domainGroups: filteredDomainGroups,
    categories: filteredCategories,
    subCategories: filteredSubCategories,
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
  };
};
