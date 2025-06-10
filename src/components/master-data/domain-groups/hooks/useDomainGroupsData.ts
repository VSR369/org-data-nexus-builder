
import { useState, useEffect } from 'react';
import { DomainGroup, IndustrySegment, Category, SubCategory } from '../types';
import { initializeIndustryData } from '../data/industryDataRegistry';
import { mockIndustrySegments } from '../data/mockData';

export const useDomainGroupsData = () => {
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  
  // Selection state
  const [selectedIndustrySegment, setSelectedIndustrySegment] = useState<string>('');
  const [selectedDomainGroup, setSelectedDomainGroup] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    // Use the updated mock data instead of localStorage for now
    setIndustrySegments(mockIndustrySegments);

    // Load domain groups
    const savedDomainGroups = localStorage.getItem('domainGroupsData');
    let loadedDomainGroups: DomainGroup[] = [];
    
    if (savedDomainGroups) {
      try {
        loadedDomainGroups = JSON.parse(savedDomainGroups);
      } catch (error) {
        console.error('Error parsing domain groups:', error);
        loadedDomainGroups = [];
      }
    }
    
    setDomainGroups(loadedDomainGroups);

    // Load categories
    const savedCategories = localStorage.getItem('categoriesData');
    let loadedCategories: Category[] = [];
    
    if (savedCategories) {
      try {
        loadedCategories = JSON.parse(savedCategories);
      } catch (error) {
        console.error('Error parsing categories:', error);
        loadedCategories = [];
      }
    }
    
    setCategories(loadedCategories);

    // Load subcategories
    const savedSubCategories = localStorage.getItem('subCategoriesData');
    let loadedSubCategories: SubCategory[] = [];
    
    if (savedSubCategories) {
      try {
        loadedSubCategories = JSON.parse(savedSubCategories);
      } catch (error) {
        console.error('Error parsing subcategories:', error);
        loadedSubCategories = [];
      }
    }
    
    setSubCategories(loadedSubCategories);

    // Initialize industry-specific data if needed
    initializeIndustryData();
  };

  const saveIndustrySegments = (segments: IndustrySegment[]) => {
    setIndustrySegments(segments);
    localStorage.setItem('industrySegmentsData', JSON.stringify(segments));
  };

  const saveDomainGroups = (groups: DomainGroup[]) => {
    setDomainGroups(groups);
    localStorage.setItem('domainGroupsData', JSON.stringify(groups));
  };

  const saveCategories = (cats: Category[]) => {
    setCategories(cats);
    localStorage.setItem('categoriesData', JSON.stringify(cats));
  };

  const saveSubCategories = (subCats: SubCategory[]) => {
    setSubCategories(subCats);
    localStorage.setItem('subCategoriesData', JSON.stringify(subCats));
  };

  // Domain Group CRUD operations
  const addDomainGroup = (group: Omit<DomainGroup, 'id' | 'createdAt' | 'categories'>) => {
    const newGroup: DomainGroup = {
      ...group,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      categories: []
    };
    const updatedGroups = [...domainGroups, newGroup];
    saveDomainGroups(updatedGroups);
  };

  const updateDomainGroup = (id: string, updates: Partial<DomainGroup>) => {
    const updatedGroups = domainGroups.map(group =>
      group.id === id ? { ...group, ...updates } : group
    );
    saveDomainGroups(updatedGroups);
  };

  const deleteDomainGroup = (id: string) => {
    const updatedGroups = domainGroups.filter(group => group.id !== id);
    saveDomainGroups(updatedGroups);
    
    // Also remove related categories and subcategories
    const updatedCategories = categories.filter(cat => cat.domainGroupId !== id);
    saveCategories(updatedCategories);
    
    const categoryIds = categories.filter(cat => cat.domainGroupId === id).map(cat => cat.id);
    const updatedSubCategories = subCategories.filter(subCat => !categoryIds.includes(subCat.categoryId));
    saveSubCategories(updatedSubCategories);
  };

  // Category CRUD operations
  const addCategory = (category: Omit<Category, 'id' | 'createdAt' | 'subCategories'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      subCategories: []
    };
    const updatedCategories = [...categories, newCategory];
    saveCategories(updatedCategories);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const updatedCategories = categories.map(category =>
      category.id === id ? { ...category, ...updates } : category
    );
    saveCategories(updatedCategories);
  };

  const deleteCategory = (id: string) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    saveCategories(updatedCategories);
    
    // Also remove related subcategories
    const updatedSubCategories = subCategories.filter(subCat => subCat.categoryId !== id);
    saveSubCategories(updatedSubCategories);
  };

  // SubCategory CRUD operations
  const addSubCategory = (subCategory: Omit<SubCategory, 'id' | 'createdAt'>) => {
    const newSubCategory: SubCategory = {
      ...subCategory,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedSubCategories = [...subCategories, newSubCategory];
    saveSubCategories(updatedSubCategories);
  };

  const updateSubCategory = (id: string, updates: Partial<SubCategory>) => {
    const updatedSubCategories = subCategories.map(subCategory =>
      subCategory.id === id ? { ...subCategory, ...updates } : subCategory
    );
    saveSubCategories(updatedSubCategories);
  };

  const deleteSubCategory = (id: string) => {
    const updatedSubCategories = subCategories.filter(subCategory => subCategory.id !== id);
    saveSubCategories(updatedSubCategories);
  };

  return {
    // Data
    industrySegments,
    domainGroups,
    categories,
    subCategories,
    
    // Selection state
    selectedIndustrySegment,
    selectedDomainGroup,
    selectedCategory,
    setSelectedIndustrySegment,
    setSelectedDomainGroup,
    setSelectedCategory,
    
    // Save functions
    saveIndustrySegments,
    saveDomainGroups,
    saveCategories,
    saveSubCategories,
    loadAllData,
    
    // CRUD operations
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
