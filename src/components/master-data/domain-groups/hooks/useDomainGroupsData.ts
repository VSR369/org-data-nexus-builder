
import { useState, useEffect } from 'react';
import { DomainGroup, IndustrySegment, Category, SubCategory } from '../types';
import { initializeDomainGroupsData } from '../utils/dataInitializer';
import { useDomainGroupOperations } from './useDomainGroupOperations';

export const useDomainGroupsData = () => {
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndustrySegment, setActiveIndustrySegment] = useState<string>('');
  const [activeDomainGroup, setActiveDomainGroup] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'industry' | 'domain' | 'category' | 'subcategory'>('industry');

  // Get domain group operations
  const {
    addDomainGroup,
    updateDomainGroup,
    deleteDomainGroup,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory
  } = useDomainGroupOperations(domainGroups, setDomainGroups);

  // Load initial data
  useEffect(() => {
    const loadData = () => {
      try {
        console.log('Loading domain groups data...');
        
        // Clear any existing domain groups data to force refresh
        localStorage.removeItem('domainGroupsData');
        
        // Try multiple possible keys for industry segments master data
        let segments: IndustrySegment[] = [];
        
        // First try the standard master data key
        const savedMasterSegments = localStorage.getItem('industrySegments');
        if (savedMasterSegments) {
          try {
            const parsedSegments = JSON.parse(savedMasterSegments);
            console.log('Found industry segments in master data:', parsedSegments);
            
            // Handle different possible formats
            if (Array.isArray(parsedSegments)) {
              // If it's an array of strings, convert to IndustrySegment objects
              if (typeof parsedSegments[0] === 'string') {
                segments = parsedSegments.map((segment, index) => ({
                  id: (index + 1).toString(),
                  name: segment,
                  code: segment.split(' ')[0].substring(0, 4).toUpperCase(),
                  description: `Industry segment: ${segment}`
                }));
              } else {
                // If it's already an array of objects, use as is
                segments = parsedSegments;
              }
            }
          } catch (error) {
            console.error('Error parsing industry segments:', error);
          }
        }
        
        // If no segments found, use defaults
        if (segments.length === 0) {
          console.log('No industry segments found in master data, using defaults');
          const defaultSegments = [
            'Banking, Financial Services & Insurance (BFSI)',
            'Retail & E-Commerce',
            'Healthcare & Life Sciences',
            'Information Technology & Software Services',
            'Telecommunications',
            'Education & EdTech',
            'Manufacturing (Smart / Discrete / Process)',
            'Logistics & Supply Chain',
            'Media, Entertainment & OTT',
            'Energy & Utilities (Power, Oil & Gas, Renewables)',
            'Automotive & Mobility',
            'Real Estate & Smart Infrastructure',
            'Travel, Tourism & Hospitality',
            'Agriculture & AgriTech',
            'Public Sector & e-Governance'
          ];
          
          segments = defaultSegments.map((segment, index) => ({
            id: (index + 1).toString(),
            name: segment,
            code: segment.split(' ')[0].substring(0, 4).toUpperCase(),
            description: `Industry segment: ${segment}`
          }));
        }
        
        setIndustrySegments(segments);
        console.log('Loaded industry segments:', segments);

        // Initialize domain groups data with force refresh
        console.log('Initializing domain groups data...');
        const initializedData = initializeDomainGroupsData(segments);
        console.log('Initialized domain groups data:', initializedData);
        
        // Log specific Life Sciences data for debugging
        const lifeSciencesSegment = segments.find(s => 
          s.name === 'Healthcare & Life Sciences' || 
          s.name.toLowerCase().includes('healthcare') ||
          s.name.toLowerCase().includes('life sciences')
        );
        if (lifeSciencesSegment) {
          console.log('Found Life Sciences segment:', lifeSciencesSegment);
          const lifeSciencesGroups = initializedData.filter(g => g.industrySegmentId === lifeSciencesSegment.id);
          console.log('Life Sciences domain groups:', lifeSciencesGroups);
          console.log('Life Sciences groups count:', lifeSciencesGroups.length);
          lifeSciencesGroups.forEach(group => {
            console.log(`Group: ${group.name}, Categories: ${group.categories.length}`);
            group.categories.forEach(cat => {
              console.log(`  Category: ${cat.name}, SubCategories: ${cat.subCategories.length}`);
            });
          });
        }
        
        setDomainGroups(initializedData);

        // Set default active segment if segments exist
        if (segments.length > 0 && !activeIndustrySegment) {
          setActiveIndustrySegment(segments[0].id);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading domain groups data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // Remove activeIndustrySegment dependency to avoid infinite loops

  // Save data when it changes
  useEffect(() => {
    if (domainGroups.length > 0) {
      localStorage.setItem('domainGroupsData', JSON.stringify(domainGroups));
      console.log('Saved domain groups to localStorage');
    }
  }, [domainGroups]);

  const updateDomainGroups = (newDomainGroups: DomainGroup[]) => {
    setDomainGroups(newDomainGroups);
  };

  // Get filtered data based on selections
  const filteredDomainGroups = domainGroups.filter(group => 
    group.industrySegmentId === activeIndustrySegment
  );

  const categories = activeDomainGroup 
    ? domainGroups.find(group => group.id === activeDomainGroup)?.categories || []
    : [];

  const subCategories = activeCategory
    ? categories.find(cat => cat.id === activeCategory)?.subCategories || []
    : [];

  return {
    domainGroups: filteredDomainGroups,
    industrySegments,
    isLoading,
    activeIndustrySegment,
    setActiveIndustrySegment,
    activeDomainGroup,
    setActiveDomainGroup,
    activeCategory,
    setActiveCategory,
    activeSubCategory,
    setActiveSubCategory,
    activeTab,
    setActiveTab,
    updateDomainGroups,
    // Additional properties needed by DomainGroupsConfig
    categories,
    subCategories,
    selectedIndustrySegment: activeIndustrySegment,
    selectedDomainGroup: activeDomainGroup,
    selectedCategory: activeCategory,
    setSelectedIndustrySegment: setActiveIndustrySegment,
    setSelectedDomainGroup: setActiveDomainGroup,
    setSelectedCategory: setActiveCategory,
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
