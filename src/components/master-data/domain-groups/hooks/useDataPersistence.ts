
import { useState, useEffect } from 'react';
import { IndustrySegment, DomainGroup, Category, SubCategory } from '../types';
import { initializeIndustryData } from '../data/industryDataRegistry';

export const useDataPersistence = () => {
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    // Load industry segments from master data (localStorage)
    const savedIndustrySegments = localStorage.getItem('industrySegmentsData');
    let loadedIndustrySegments: IndustrySegment[] = [];
    
    if (savedIndustrySegments) {
      try {
        loadedIndustrySegments = JSON.parse(savedIndustrySegments);
        console.log('Loaded industry segments from master data:', loadedIndustrySegments);
      } catch (error) {
        console.error('Error parsing industry segments:', error);
        loadedIndustrySegments = [];
      }
    }
    
    // Only show active industry segments
    const activeSegments = loadedIndustrySegments.filter(segment => segment.isActive);
    setIndustrySegments(activeSegments);

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

  return {
    industrySegments,
    domainGroups,
    categories,
    subCategories,
    saveIndustrySegments,
    saveDomainGroups,
    saveCategories,
    saveSubCategories,
    loadAllData
  };
};
