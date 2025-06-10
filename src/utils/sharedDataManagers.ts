import { DataManager } from './dataManager';

// Only keep the data managers that are not related to industry segments
export const countriesDataManager = new DataManager(
  'master_data_countries',
  [
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia', 'India', 'Brazil', 'Mexico'
  ]
);

export const organizationTypesDataManager = new DataManager(
  'master_data_organization_types',
  [
    'Startup', 'Small Business', 'Medium Enterprise', 'Large Corporation', 'Non-Profit', 'Government Agency', 'Educational Institution', 'Healthcare Organization'
  ]
);
