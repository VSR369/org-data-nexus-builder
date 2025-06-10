
import { IndustrySegment } from '../types';

export const mockIndustrySegments: IndustrySegment[] = [
  { 
    id: '1', 
    name: 'Life Sciences', 
    code: 'LS', 
    description: 'Pharmaceutical, biotechnology, medical devices, and healthcare research', 
    isActive: true, 
    createdAt: new Date().toISOString() 
  },
  { 
    id: '2', 
    name: 'Manufacturing (Smart, Discrete, Process)', 
    code: 'MFG', 
    description: 'Smart manufacturing, discrete manufacturing, and process manufacturing operations', 
    isActive: true, 
    createdAt: new Date().toISOString() 
  },
  { 
    id: '3', 
    name: 'Life Sciences & Supply Chain', 
    code: 'LSSC', 
    description: 'Life sciences supply chain management, logistics, and distribution', 
    isActive: true, 
    createdAt: new Date().toISOString() 
  }
];
