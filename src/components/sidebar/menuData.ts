
import { Building2, Users, Gift, DollarSign, Globe, MessageSquare, Calendar, Target, Database, CheckCircle, Award, CreditCard, Brain, Vote, Settings, BarChart3, Trash2, Factory, FolderTree, Handshake } from 'lucide-react';

export const foundationMenuItems = [
  {
    id: 'countries',
    title: 'Countries',
    icon: Globe,
  },
  {
    id: 'currencies',
    title: 'Currencies',
    icon: DollarSign,
  },
  {
    id: 'industry-segments',
    title: 'Industry Segments',
    icon: Factory,
  },
];

export const organizationMenuItems = [
  {
    id: 'organization-types',
    title: 'Organization Types',
    icon: Building2,
  },
  {
    id: 'entity-types',
    title: 'Entity Types',
    icon: Building2,
  },
  {
    id: 'departments',
    title: 'Departments',
    icon: Users,
  },
];

export const challengeMenuItems = [
  {
    id: 'domain-groups',
    title: 'Domain Groups',
    icon: FolderTree,
  },
  {
    id: 'challenge-statuses',
    title: 'Challenge Status',
    icon: CheckCircle,
  },
  {
    id: 'solution-statuses',
    title: 'Solution Statuses',
    icon: Award,
  },
  {
    id: 'competency-capabilities',
    title: 'Capability Ratings',
    icon: Brain,
  },
];

export const systemMenuItems = [
  {
    id: 'communication-types',
    title: 'Communication & Content Types',
    icon: MessageSquare,
  },
  {
    id: 'reward-types',
    title: 'Non-Monetary Reward Types',
    icon: Gift,
  },
  {
    id: 'seeker-membership-fee',
    title: 'Seeker Membership Fee',
    icon: Users,
  },
  {
    id: 'engagement-models',
    title: 'Engagement Models',
    icon: Handshake,
  },
  {
    id: 'pricing',
    title: 'Pricing Configuration',
    icon: CreditCard,
  },
  {
    id: 'events-calendar',
    title: 'Events Calendar',
    icon: Calendar,
  },
];

export const administrationMenuItems = [
  {
    id: 'global-cache-manager',
    title: 'Global Cache Manager',
    icon: Trash2,
  },
];
