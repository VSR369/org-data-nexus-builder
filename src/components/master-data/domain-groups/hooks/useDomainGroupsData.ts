
import { useState, useEffect } from 'react';
import { DomainGroup, IndustrySegment, Category, SubCategory } from '../types';
import { initializeDomainGroupsData } from '../utils/dataInitializer';
import { useDomainGroupOperations } from './useDomainGroupOperations';

export const useDomainGroupsData = () => {
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [allDomainGroups, setAllDomainGroups] = useState<DomainGroup[]>([]);
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndustrySegment, setActiveIndustrySegment] = useState<string>('');
  const [activeDomainGroup, setActiveDomainGroup] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('');

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
  } = useDomainGroupOperations(allDomainGroups, setAllDomainGroups);

  // Load initial data
  useEffect(() => {
    const loadData = () => {
      try {
        console.log('Loading complete domain groups data...');
        
        // Get industry segments from localStorage or use defaults
        let segments: IndustrySegment[] = [];
        const savedMasterSegments = localStorage.getItem('industrySegments');
        
        if (savedMasterSegments) {
          try {
            const parsedSegments = JSON.parse(savedMasterSegments);
            console.log('Found industry segments in master data:', parsedSegments);
            
            if (Array.isArray(parsedSegments)) {
              if (typeof parsedSegments[0] === 'string') {
                segments = parsedSegments.map((segment, index) => ({
                  id: (index + 1).toString(),
                  name: segment,
                  code: segment.split(' ')[0].substring(0, 4).toUpperCase(),
                  description: `Industry segment: ${segment}`
                }));
              } else {
                segments = parsedSegments;
              }
            }
          } catch (error) {
            console.error('Error parsing industry segments:', error);
          }
        }
        
        // Use defaults if no segments found
        if (segments.length === 0) {
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

        // Force initialize with fresh Life Sciences data
        console.log('Force initializing fresh domain groups data...');
        const initializedData = initializeDomainGroupsData(segments);
        console.log('Fresh initialized domain groups data:', initializedData);
        
        setAllDomainGroups(initializedData);

        // Set default active segment to Life Sciences
        const lifeSciencesSegment = segments.find(segment => 
          segment.name.toLowerCase().includes('healthcare') || 
          segment.name.toLowerCase().includes('life sciences')
        );
        
        if (lifeSciencesSegment && !activeIndustrySegment) {
          setActiveIndustrySegment(lifeSciencesSegment.id);
          console.log('Set active segment to Life Sciences:', lifeSciencesSegment.id);
        } else if (segments.length > 0 && !activeIndustrySegment) {
          setActiveIndustrySegment(segments[0].id);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading domain groups data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Update filtered domain groups when active industry segment changes
  useEffect(() => {
    if (activeIndustrySegment) {
      const filtered = allDomainGroups.filter(group => 
        group.industrySegmentId === activeIndustrySegment
      );
      setDomainGroups(filtered);
      console.log(`Filtered ${filtered.length} domain groups for segment ${activeIndustrySegment}:`, filtered);
      
      // Reset selections when industry segment changes
      setActiveDomainGroup('');
      setActiveCategory('');
    }
  }, [activeIndustrySegment, allDomainGroups]);

  // Save data when it changes (but not on initial load to avoid overwriting fresh data)
  useEffect(() => {
    if (allDomainGroups.length > 0 && !isLoading) {
      localStorage.setItem('domainGroupsData', JSON.stringify(allDomainGroups));
      console.log('Saved updated domain groups to localStorage');
    }
  }, [allDomainGroups, isLoading]);

  // Get filtered data based on selections
  const categories = activeDomainGroup 
    ? domainGroups.find(group => group.id === activeDomainGroup)?.categories || []
    : [];

  const subCategories = activeCategory
    ? categories.find(cat => cat.id === activeCategory)?.subCategories || []
    : [];

  return {
    domainGroups,
    industrySegments,
    isLoading,
    activeIndustrySegment,
    setActiveIndustrySegment,
    activeDomainGroup,
    setActiveDomainGroup,
    activeCategory,
    setActiveCategory,
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
