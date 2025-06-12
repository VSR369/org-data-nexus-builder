
import { EnhancedUniversalDataManager, EnhancedDataConfig } from '@/utils/core/EnhancedUniversalDataManager';

export class EnhancedDataManager<T> extends EnhancedUniversalDataManager<T> {
  constructor(config: EnhancedDataConfig<T>) {
    super(config);
  }
}
