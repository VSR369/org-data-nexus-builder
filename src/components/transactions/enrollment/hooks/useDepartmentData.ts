
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    const loadDepartmentDataFromSupabase = async () => {
      try {
        console.log('✅ CRUD TEST - Department Data: Loading departments from Supabase');
        
        // Load departments from Supabase
        const { data: departments, error: depError } = await supabase
          .from('master_departments')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (depError) {
          console.error('❌ Error loading departments from Supabase:', depError);
          setDefaultDepartmentData();
          return;
        }

        // Load sub-departments from Supabase
        const { data: subDepartments, error: subDepError } = await supabase
          .from('master_sub_departments')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (subDepError) {
          console.error('❌ Error loading sub-departments from Supabase:', subDepError);
          setDefaultDepartmentData();
          return;
        }

        console.log('✅ CRUD TEST - Department Data loaded:', { 
          departments: departments?.length || 0, 
          subDepartments: subDepartments?.length || 0 
        });

        // Transform Supabase data into the expected format
        const categories = departments?.map(dept => dept.name) || [];
        const subcategories: { [category: string]: string[] } = {};

        departments?.forEach(dept => {
          const relatedSubDeps = subDepartments?.filter(subDep => subDep.department_id === dept.id);
          subcategories[dept.name] = relatedSubDeps?.map(subDep => subDep.name) || [];
        });

        const transformedData = {
          categories,
          subcategories
        };

        console.log('✅ CRUD TEST - Department Data transformed:', transformedData);
        setDepartmentData(transformedData);

      } catch (error) {
        console.error('❌ Error loading department data from Supabase:', error);
        setDefaultDepartmentData();
      }
    };

    loadDepartmentDataFromSupabase();
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
