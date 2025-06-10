
import { DataManager } from './dataManager';

// Data managers for master data (industry segments removed)
export const countriesDataManager = new DataManager({
  key: 'master_data_countries',
  defaultData: [
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia', 'India', 'Brazil', 'Mexico'
  ],
  version: 1
});

export const organizationTypesDataManager = new DataManager({
  key: 'master_data_organization_types',
  defaultData: [
    'Startup', 'Small Business', 'Medium Enterprise', 'Large Corporation', 'Non-Profit', 'Government Agency', 'Educational Institution', 'Healthcare Organization'
  ],
  version: 1
});
