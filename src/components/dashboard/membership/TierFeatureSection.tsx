
import React from 'react';
import { CheckCircle, BarChart, Users, Headphones, Settings } from 'lucide-react';

interface TierFeatureSectionProps {
  analyticsAccess?: string | null;
  supportType?: string | null;
  onboardingType?: string | null;
  workflowTemplate?: string | null;
  monthlyLimit: number | null;
  solutionsPerChallenge: number;
  allowsOverage: boolean;
}

const getFeatureIcon = (type: 'analytics' | 'support' | 'onboarding' | 'workflow') => {
  switch (type) {
    case 'analytics': return BarChart;
    case 'support': return Headphones;
    case 'onboarding': return Users;
    case 'workflow': return Settings;
    default: return CheckCircle;
  }
};

export const TierFeatureSection: React.FC<TierFeatureSectionProps> = ({
  analyticsAccess,
  supportType,
  onboardingType,
  workflowTemplate,
  monthlyLimit,
  solutionsPerChallenge,
  allowsOverage
}) => {
  const features = [];

  // Challenge limits
  if (monthlyLimit) {
    features.push({
      icon: CheckCircle,
      text: `Up to ${monthlyLimit} challenges per month`,
      category: 'limits'
    });
  } else {
    features.push({
      icon: CheckCircle,
      text: 'Unlimited challenges per month',
      category: 'limits'
    });
  }

  // Solutions per challenge
  features.push({
    icon: CheckCircle,
    text: `${solutionsPerChallenge} solution${solutionsPerChallenge > 1 ? 's' : ''} per challenge`,
    category: 'limits'
  });

  // Analytics Access
  if (analyticsAccess) {
    const AnalyticsIcon = getFeatureIcon('analytics');
    features.push({
      icon: AnalyticsIcon,
      text: analyticsAccess,
      category: 'analytics'
    });
  }

  // Support Type
  if (supportType) {
    const SupportIcon = getFeatureIcon('support');
    features.push({
      icon: SupportIcon,
      text: supportType,
      category: 'support'
    });
  }

  // Onboarding Type
  if (onboardingType) {
    const OnboardingIcon = getFeatureIcon('onboarding');
    features.push({
      icon: OnboardingIcon,
      text: onboardingType,
      category: 'onboarding'
    });
  }

  // Workflow Template
  if (workflowTemplate) {
    const WorkflowIcon = getFeatureIcon('workflow');
    features.push({
      icon: WorkflowIcon,
      text: workflowTemplate,
      category: 'workflow'
    });
  }

  // Overage
  if (allowsOverage) {
    features.push({
      icon: CheckCircle,
      text: 'Challenge overage allowed',
      category: 'features'
    });
  }

  return (
    <div className="space-y-2">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div key={index} className="flex items-start gap-2">
            <Icon className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-left text-sm">{feature.text}</span>
          </div>
        );
      })}
    </div>
  );
};
