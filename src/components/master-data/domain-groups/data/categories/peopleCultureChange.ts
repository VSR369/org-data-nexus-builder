
import { DomainGroup } from '../../types';

export const peopleCultureChangeGroup: Omit<DomainGroup, 'industrySegmentId'> = {
  id: 'ls-people-culture-change',
  name: 'People, Culture & Change',
  description: 'People management, culture development, and change management for life sciences organizations',
  isActive: true,
  createdAt: new Date().toISOString(),
  categories: [
    {
      id: 'ls-talent-management-culture',
      name: 'Talent Management & Organizational Culture',
      description: 'Comprehensive talent management and organizational culture development',
      domainGroupId: 'ls-people-culture-change',
      isActive: true,
      createdAt: new Date().toISOString(),
      subCategories: [
        {
          id: 'ls-scientific-stakeholder-engagement',
          name: 'Scientific Stakeholder Engagement',
          description: 'Involving lab teams, clinical staff, and patient advocates in organizational growth.',
          categoryId: 'ls-talent-management-culture',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-change-communications-regulated',
          name: 'Change Communications in Regulated Environments',
          description: 'Designing communications for change initiatives involving regulators, HCPs, and sponsors.',
          categoryId: 'ls-talent-management-culture',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-culture-integrity-innovation',
          name: 'Culture of Integrity & Science-Driven Innovation',
          description: 'Promoting transparency, ethics, and innovation mindset in high-stakes clinical environments.',
          categoryId: 'ls-talent-management-culture',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-trial-team-enablement-gxp',
          name: 'Trial Team Enablement & GxP Training',
          description: 'Training employees and vendors for compliance with clinical, quality, and regulatory standards.',
          categoryId: 'ls-talent-management-culture',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ]
    },
    {
      id: 'ls-operating-model-structure',
      name: 'Operating Model & Organizational Structure',
      description: 'Designing operating models and organizational structures for life sciences',
      domainGroupId: 'ls-people-culture-change',
      isActive: true,
      createdAt: new Date().toISOString(),
      subCategories: [
        {
          id: 'ls-role-clarity-rd-medical-regulatory',
          name: 'Role Clarity Across R&D, Medical, Regulatory',
          description: 'Mapping governance and accountability across functions in a matrixed pharma model.',
          categoryId: 'ls-operating-model-structure',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-decision-rights-study-ip-safety',
          name: 'Decision Rights for Study, IP, Safety Escalation',
          description: 'Clarifying who holds final say across critical decision paths in life sciences workflows.',
          categoryId: 'ls-operating-model-structure',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-centralized-lab-ops-distributed',
          name: 'Centralized Lab Ops vs. Distributed Sites',
          description: 'Balancing centralized research capabilities with distributed trial models.',
          categoryId: 'ls-operating-model-structure',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-shared-service-design-medical-qa',
          name: 'Shared Service Design (e.g., Medical Writing, QA)',
          description: 'Designing shared support hubs for scale and quality in regulated operations.',
          categoryId: 'ls-operating-model-structure',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ]
    },
    {
      id: 'ls-digital-workplace-workforce',
      name: 'Digital Workplace & Workforce Enablement',
      description: 'Digital workplace solutions and workforce enablement for life sciences',
      domainGroupId: 'ls-people-culture-change',
      isActive: true,
      createdAt: new Date().toISOString(),
      subCategories: [
        {
          id: 'ls-clinical-collaboration-tools',
          name: 'Clinical Collaboration Tools & Digital Platforms',
          description: 'Enabling remote trial teams and lab scientists with digital documentation and workflows.',
          categoryId: 'ls-digital-workplace-workforce',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-remote-clinical-work-monitoring',
          name: 'Remote Clinical Work & Monitoring Enablement',
          description: 'Supporting decentralized trials, remote visits, and digital data capture.',
          categoryId: 'ls-digital-workplace-workforce',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-productivity-analytics-lab-field',
          name: 'Productivity Analytics in Lab & Field Settings',
          description: 'Measuring productivity across R&D, medical affairs, and field operations.',
          categoryId: 'ls-digital-workplace-workforce',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ls-employee-wellness-pharma',
          name: 'Employee Wellness in Pharma Workplaces',
          description: 'Boosting resilience, compliance pressure management, and mental health.',
          categoryId: 'ls-digital-workplace-workforce',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ]
    }
  ]
};
