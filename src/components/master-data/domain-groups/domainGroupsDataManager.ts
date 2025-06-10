
import { DataManager } from '@/utils/dataManager';
import { DomainGroupsData } from '@/types/domainGroups';

// Default data
const defaultDomainGroupsData: DomainGroupsData = {
  domainGroups: [],
  categories: [],
  subCategories: []
};

// Data manager
export const domainGroupsDataManager = new DataManager({
  key: 'master_data_domain_groups',
  defaultData: defaultDomainGroupsData,
  version: 1
});
