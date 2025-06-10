
import { CompetencyCapability, ColorOption } from './types';

export const DEFAULT_CAPABILITIES: CompetencyCapability[] = [
  {
    id: '1',
    name: 'Software Development',
    description: 'Ability to design, develop, and maintain software applications',
    category: 'technical',
    ratingRange: '1-5',
    isActive: true,
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: '2',
    name: 'Project Management',
    description: 'Planning, executing, and closing projects effectively',
    category: 'business',
    ratingRange: '1-5',
    isActive: true,
    color: 'bg-green-100 text-green-800'
  },
  {
    id: '3',
    name: 'Leadership',
    description: 'Ability to lead and inspire teams',
    category: 'behavioral',
    ratingRange: '1-5',
    isActive: true,
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: '4',
    name: 'Data Analysis',
    description: 'Analyzing and interpreting complex data sets',
    category: 'technical',
    ratingRange: '1-5',
    isActive: true,
    color: 'bg-cyan-100 text-cyan-800'
  },
  {
    id: '5',
    name: 'Communication',
    description: 'Effective verbal and written communication skills',
    category: 'behavioral',
    ratingRange: '1-5',
    isActive: true,
    color: 'bg-orange-100 text-orange-800'
  }
];

export const COLOR_OPTIONS: ColorOption[] = [
  { value: 'bg-blue-100 text-blue-800', label: 'Blue' },
  { value: 'bg-green-100 text-green-800', label: 'Green' },
  { value: 'bg-purple-100 text-purple-800', label: 'Purple' },
  { value: 'bg-red-100 text-red-800', label: 'Red' },
  { value: 'bg-yellow-100 text-yellow-800', label: 'Yellow' },
  { value: 'bg-pink-100 text-pink-800', label: 'Pink' },
  { value: 'bg-indigo-100 text-indigo-800', label: 'Indigo' },
  { value: 'bg-gray-100 text-gray-800', label: 'Gray' },
  { value: 'bg-cyan-100 text-cyan-800', label: 'Cyan' },
  { value: 'bg-orange-100 text-orange-800', label: 'Orange' }
];
