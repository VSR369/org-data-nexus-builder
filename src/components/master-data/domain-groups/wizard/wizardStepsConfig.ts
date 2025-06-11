
import { WizardStep } from '@/types/wizardTypes';

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'source',
    title: 'Data Source',
    description: 'Choose how to add your domain groups',
    isValid: false,
    isCompleted: false
  },
  {
    id: 'setup',
    title: 'Domain Group Setup',
    description: 'Configure industry segment and domain group',
    isValid: false,
    isCompleted: false
  },
  {
    id: 'entry',
    title: 'Data Entry',
    description: 'Add categories and sub-categories',
    isValid: false,
    isCompleted: false
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Review and submit your hierarchy',
    isValid: false,
    isCompleted: false
  }
];
