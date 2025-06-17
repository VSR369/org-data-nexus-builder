
export const COMPETENCY_STORAGE_KEY = 'solution-provider-competency-draft';

export const RATING_THRESHOLDS = {
  NO_COMPETENCY_MAX: 0,
  BASIC_MIN: 1,
  BASIC_MAX: 4,
  ADVANCED_MIN: 5,
  ADVANCED_MAX: 8,
  GURU_MIN: 9,
  GURU_MAX: 10
} as const;

export const COMPETENCY_LEVELS = {
  NO_COMPETENCY: { min: 0, max: 0, label: 'No Competency', color: 'bg-gray-100 text-gray-800' },
  BASIC: { min: 1, max: 4, label: 'Basic', color: 'bg-blue-100 text-blue-800' },
  ADVANCED: { min: 5, max: 8, label: 'Advanced', color: 'bg-green-100 text-green-800' },
  GURU: { min: 9, max: 10, label: 'Guru', color: 'bg-purple-100 text-purple-800' }
} as const;
