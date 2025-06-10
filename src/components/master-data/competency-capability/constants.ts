
import { ColorOption, CompetencyCapability } from './types';

export const COLOR_OPTIONS: ColorOption[] = [
  { value: 'bg-red-100 text-red-800 border-red-300', label: 'Red' },
  { value: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Yellow' },
  { value: 'bg-blue-100 text-blue-800 border-blue-300', label: 'Blue' },
  { value: 'bg-purple-100 text-purple-800 border-purple-300', label: 'Purple' },
  { value: 'bg-green-100 text-green-800 border-green-300', label: 'Green' },
  { value: 'bg-gray-100 text-gray-800 border-gray-300', label: 'Gray' },
];

export const DEFAULT_CAPABILITIES: CompetencyCapability[] = [
  {
    id: '1',
    name: 'No Competency',
    description: 'No knowledge or experience in this area',
    color: 'bg-red-100 text-red-800 border-red-300',
    order: 1,
    isActive: true,
    ratingRange: '0 - 2.49999',
  },
  {
    id: '2',
    name: 'Basic',
    description: 'Fundamental knowledge and basic competency',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    order: 2,
    isActive: true,
    ratingRange: '2.5 - 4.9999',
  },
  {
    id: '3',
    name: 'Advanced',
    description: 'High proficiency with comprehensive understanding',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    order: 3,
    isActive: true,
    ratingRange: '5 - 7.49999',
  },
  {
    id: '4',
    name: 'Guru',
    description: 'Expert level with deep knowledge and ability to guide others',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    order: 4,
    isActive: true,
    ratingRange: '7.5 - 10',
  },
];
