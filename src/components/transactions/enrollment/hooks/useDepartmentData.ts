
import { useState, useEffect } from 'react';

interface DepartmentData {
  categories: string[];
  subcategories: {
    [category: string]: string[];
  };
}

export const useDepartmentData = () => {
  const [departmentData, setDepartmentData] = useState<DepartmentData>({
    categories: [],
    subcategories: {}
  });

  useEffect(() => {
    const departmentConfigKey = 'department_master_data';
    const storedDepartmentData = localStorage.getItem(departmentConfigKey);
    
    if (storedDepartmentData) {
      try {
        const parsedData = JSON.parse(storedDepartmentData);
        console.log('Loaded structured department data from master data:', parsedData);
        setDepartmentData(parsedData);
      } catch (error) {
        console.error('Error parsing department master data:', error);
        setDefaultDepartmentData();
      }
    } else {
      console.log('No structured department data found, using defaults');
      setDefaultDepartmentData();
    }
  }, []);

  const setDefaultDepartmentData = () => {
    setDepartmentData({
      categories: [
        'Core Business Functions',
        'Corporate Support Functions',
        'Technology & Digital Functions',
        'Industry-Specific or Specialized Departments'
      ],
      subcategories: {
        'Core Business Functions': [
          'Strategy & Planning',
          'Sales & Business Development',
          'Marketing & Communications',
          'Product Management',
          'Operations / Service Delivery',
          'Customer Support / Success',
          'Research & Development (R&D)',
          'Supply Chain & Procurement',
          'Project / Program Management Office (PMO)'
        ],
        'Corporate Support Functions': [
          'Finance & Accounting',
          'Human Resources (HR)',
          'Legal & Compliance',
          'Administration & Facilities Management',
          'Internal Audit & Risk Management'
        ],
        'Technology & Digital Functions': [
          'Information Technology (IT)',
          'Enterprise Architecture',
          'Data & Analytics / Business Intelligence',
          'Cybersecurity & Information Security',
          'Digital Transformation Office / Innovation Lab',
          'DevOps / Infrastructure & Cloud Services'
        ],
        'Industry-Specific or Specialized Departments': [
          'Quality Assurance / Regulatory Affairs (e.g., Pharma, Manufacturing)',
          'Clinical Affairs (e.g., Healthcare, MedTech)',
          'Merchandising & Category Management (Retail)',
          'Content / Editorial / Creative (Media & EdTech)',
          'Corporate Social Responsibility (CSR) / ESG'
        ]
      }
    });
  };

  return departmentData;
};
