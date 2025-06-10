
import { CompetencyCapability } from './types';

export const DEFAULT_CAPABILITIES: CompetencyCapability[] = [
  {
    id: '1',
    name: 'Software Development',
    description: 'Ability to design, develop, and maintain software applications',
    category: 'technical',
    ratingRange: '1-5',
    isActive: true
  },
  {
    id: '2',
    name: 'Project Management',
    description: 'Planning, executing, and closing projects effectively',
    category: 'business',
    ratingRange: '1-5',
    isActive: true
  },
  {
    id: '3',
    name: 'Leadership',
    description: 'Ability to lead and inspire teams',
    category: 'behavioral',
    ratingRange: '1-5',
    isActive: true
  },
  {
    id: '4',
    name: 'Data Analysis',
    description: 'Analyzing and interpreting complex data sets',
    category: 'technical',
    ratingRange: '1-5',
    isActive: true
  },
  {
    id: '5',
    name: 'Communication',
    description: 'Effective verbal and written communication skills',
    category: 'behavioral',
    ratingRange: '1-5',
    isActive: true
  }
];
