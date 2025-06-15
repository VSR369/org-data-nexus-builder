
import { StorageConfig } from './interfaces';

export const currencyConfig: StorageConfig = {
  key: 'master_data_currencies',
  version: 2,
  preserveUserData: true
};

export const entityTypeConfig: StorageConfig = {
  key: 'master_data_entity_types', 
  version: 2,
  preserveUserData: true
};
