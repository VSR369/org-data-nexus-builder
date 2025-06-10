
import { DomainGroup } from '../types';
import { strategyInnovationGrowthGroup } from './categories/strategyInnovationGrowth';
import { operationsDeliveryRiskGroup } from './categories/operationsDeliveryRisk';
import { peopleCultureChangeGroup } from './categories/peopleCultureChange';
import { technologyDigitalTransformationGroup } from './categories/technologyDigitalTransformation';

export const lifeSciencesDomainGroups: Omit<DomainGroup, 'industrySegmentId'>[] = [
  strategyInnovationGrowthGroup,
  operationsDeliveryRiskGroup,
  peopleCultureChangeGroup,
  technologyDigitalTransformationGroup
];
