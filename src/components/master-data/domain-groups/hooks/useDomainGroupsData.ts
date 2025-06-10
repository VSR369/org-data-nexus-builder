
import { useState, useEffect } from 'react';
import { DomainGroup, IndustrySegment } from '../types';
import { initializeDomainGroupsData } from '../utils/dataInitializer';

export const useDomainGroupsData = () => {
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndustrySegment, setActiveIndustrySegment] = useState<string>('');
  const [activeDomainGroup, setActiveDomainGroup] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'industry' | 'domain' | 'category' | 'subcategory'>('industry');

  // Load initial data
  useEffect(() => {
    const loadData = () => {
      try {
        console.log('Loading domain groups data...');
        
        // Load industry segments from master data
        const savedIndustrySegments = localStorage.getItem('industrySegments');
        let segments: IndustrySegment[] = [];
        
        if (savedIndustrySegments) {
          segments = JSON.parse(savedIndustrySegments);
        } else {
          // Default segments if none exist
          segments = [
            { id: '1', name: 'Information Technology', code: 'IT', description: 'Technology and software services' },
            { id: '2', name: 'Healthcare', code: 'HC', description: 'Medical and healthcare services' },
            { id: '3', name: 'Banking & Financial Services', code: 'BFSI', description: 'Banking and financial institutions' },
            { id: '4', name: 'Retail & E-commerce', code: 'RET', description: 'Retail and online commerce' }
          ];
        }
        
        setIndustrySegments(segments);
        console.log('Loaded industry segments:', segments);

        // Initialize domain groups data
        const initializedData = initializeDomainGroupsData(segments);
        setDomainGroups(initializedData);
        console.log('Loaded domain groups:', initializedData);

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
  }, []); // Remove activeIndustrySegment dependency to avoid conditional hook calls

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
    activeSubCategory,
    setActiveSubCategory,
    activeTab,
    setActiveTab,
    updateDomainGroups,
  };
};
