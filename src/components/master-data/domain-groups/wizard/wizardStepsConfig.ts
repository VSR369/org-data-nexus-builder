
import { WizardStep } from '@/types/wizardTypes';

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'data-source',
    title: 'Data Source',
    description: 'Select manual entry method',
    isValid: false,
    isCompleted: false
  },
  {
    id: 'domain-setup',
    title: 'Domain Setup',
    description: 'Configure industry segment and domain group',
    isValid: false,
    isCompleted: false
  },
  {
    id: 'data-entry',
    title: 'Data Entry',
    description: 'Add categories and sub-categories',
    isValid: false,
    isCompleted: false
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Review and save your hierarchy',
    isValid: false,
    isCompleted: false
  }
];
