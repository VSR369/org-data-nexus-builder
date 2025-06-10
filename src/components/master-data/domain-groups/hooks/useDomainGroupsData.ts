import { useState, useEffect } from 'react';
import { DomainGroup, IndustrySegment, Category, SubCategory } from '../types';
import { initializeIndustryData } from '../data/industryDataRegistry';

export const useDomainGroupsData = () => {
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    // Load industry segments from localStorage or use hardcoded defaults
    const savedIndustrySegments = localStorage.getItem('industrySegmentsData');
    let loadedIndustrySegments: IndustrySegment[] = [];
    
    if (savedIndustrySegments) {
      try {
        loadedIndustrySegments = JSON.parse(savedIndustrySegments);
      } catch (error) {
        console.error('Error parsing industry segments:', error);
        loadedIndustrySegments = getDefaultIndustrySegments();
      }
    } else {
      loadedIndustrySegments = getDefaultIndustrySegments();
      localStorage.setItem('industrySegmentsData', JSON.stringify(loadedIndustrySegments));
    }
    
    setIndustrySegments(loadedIndustrySegments);

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

  // Default industry segments
  const getDefaultIndustrySegments = (): IndustrySegment[] => [
    { id: 'banking-finance', name: 'Banking & Finance', code: 'BF', isActive: true, createdAt: new Date().toISOString() },
    { id: 'healthcare', name: 'Healthcare & Life Sciences', code: 'HL', isActive: true, createdAt: new Date().toISOString() },
    { id: 'technology', name: 'Technology & Software', code: 'TS', isActive: true, createdAt: new Date().toISOString() },
    { id: 'manufacturing', name: 'Manufacturing', code: 'MF', isActive: true, createdAt: new Date().toISOString() },
    { id: 'retail', name: 'Retail & Consumer Goods', code: 'RC', isActive: true, createdAt: new Date().toISOString() },
    { id: 'logistics', name: 'Logistics & Supply Chain', code: 'LS', isActive: true, createdAt: new Date().toISOString() },
    { id: 'energy', name: 'Energy & Utilities', code: 'EU', isActive: true, createdAt: new Date().toISOString() },
    { id: 'education', name: 'Education', code: 'ED', isActive: true, createdAt: new Date().toISOString() },
    { id: 'government', name: 'Government & Public Sector', code: 'GP', isActive: true, createdAt: new Date().toISOString() },
    { id: 'real-estate', name: 'Real Estate & Construction', code: 'RE', isActive: true, createdAt: new Date().toISOString() }
  ];

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
