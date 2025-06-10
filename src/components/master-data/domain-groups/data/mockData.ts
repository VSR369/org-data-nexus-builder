
import { IndustrySegment } from '../types';

export const mockIndustrySegments: IndustrySegment[] = [
  { id: '1', name: 'Banking, Financial Services and Insurance (BFSI)', code: 'BFSI', description: 'Financial sector including banks, insurance, and investment services', isActive: true, createdAt: new Date().toISOString() },
  { id: '2', name: 'Information Technology (IT)', code: 'IT', description: 'Technology companies, software development, and IT services', isActive: true, createdAt: new Date().toISOString() },
  { id: '3', name: 'Healthcare', code: 'HC', description: 'Medical services, pharmaceuticals, and health technology', isActive: true, createdAt: new Date().toISOString() },
  { id: '4', name: 'Retail', code: 'RTL', description: 'Consumer goods, e-commerce, and retail services', isActive: true, createdAt: new Date().toISOString() },
  { id: '5', name: 'Manufacturing', code: 'MFG', description: 'Industrial production and manufacturing processes', isActive: true, createdAt: new Date().toISOString() },
  { id: '6', name: 'Education', code: 'EDU', description: 'Educational institutions and learning technology', isActive: true, createdAt: new Date().toISOString() },
  { id: '7', name: 'Government', code: 'GOV', description: 'Public sector and government services', isActive: true, createdAt: new Date().toISOString() },
  { id: '8', name: 'Energy & Utilities', code: 'ENU', description: 'Power generation, utilities, and energy services', isActive: true, createdAt: new Date().toISOString() },
];
