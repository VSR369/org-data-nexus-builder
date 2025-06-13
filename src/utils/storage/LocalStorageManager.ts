
interface StorageConfig {
  key: string;
  version?: number;
  validateData?: (data: any) => boolean;
  defaultData?: any;
  enableBackup?: boolean;
}

interface StorageResult<T> {
  success: boolean;
  data: T | null;
  error?: string;
}

export class LocalStorageManager<T> {
  private config: StorageConfig;
  private backupKey: string;
  private versionKey: string;
  private integrityKey: string;

  constructor(config: StorageConfig) {
    this.config = {
      version: 1,
      enableBackup: true,
      ...config
    };
    this.backupKey = `${config.key}_backup`;
    this.versionKey = `${config.key}_version`;
    this.integrityKey = `${config.key}_integrity`;
  }

  private generateChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private validateIntegrity(data: string, expectedChecksum: string): boolean {
    return this.generateChecksum(data) === expectedChecksum;
  }

  private setWithIntegrity(key: string, data: string): boolean {
    try {
      const checksum = this.generateChecksum(data);
      localStorage.setItem(key, data);
      localStorage.setItem(`${key}_integrity`, checksum);
      
      // Immediate verification
      const retrieved = localStorage.getItem(key);
      return retrieved === data;
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
      return false;
    }
  }

  private getWithIntegrity(key: string): string | null {
    try {
      const data = localStorage.getItem(key);
      const checksum = localStorage.getItem(`${key}_integrity`);
      
      if (!data) return null;
      if (!checksum) {
        console.warn(`No integrity checksum found for ${key}`);
        return data; // Return data but it's potentially corrupted
      }
      
      if (this.validateIntegrity(data, checksum)) {
        return data;
      } else {
        console.error(`Data integrity check failed for ${key}`);
        return null;
      }
    } catch (error) {
      console.error(`Failed to retrieve ${key}:`, error);
      return null;
    }
  }

  save(data: T): StorageResult<T> {
    console.log(`💾 Saving data to ${this.config.key}:`, data);
    
    try {
      // Validate data if validator provided
      if (this.config.validateData && !this.config.validateData(data)) {
        return {
          success: false,
          data: null,
          error: 'Data validation failed'
        };
      }

      const jsonData = JSON.stringify(data);
      
      // Save main data with integrity check
      const mainSaved = this.setWithIntegrity(this.config.key, jsonData);
      if (!mainSaved) {
        return {
          success: false,
          data: null,
          error: 'Failed to save main data'
        };
      }

      // Save backup if enabled
      if (this.config.enableBackup) {
        this.setWithIntegrity(this.backupKey, jsonData);
      }

      // Save version
      if (this.config.version) {
        localStorage.setItem(this.versionKey, this.config.version.toString());
      }

      console.log(`✅ Successfully saved ${this.config.key}`);
      return {
        success: true,
        data: data
      };

    } catch (error) {
      console.error(`❌ Error saving ${this.config.key}:`, error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  load(): StorageResult<T> {
    console.log(`📤 Loading data from ${this.config.key}`);
    
    try {
      // Try to load main data
      let jsonData = this.getWithIntegrity(this.config.key);
      
      // If main data fails, try backup
      if (!jsonData && this.config.enableBackup) {
        console.warn(`Main data for ${this.config.key} failed, trying backup`);
        jsonData = this.getWithIntegrity(this.backupKey);
        
        if (jsonData) {
          console.log(`✅ Recovered ${this.config.key} from backup`);
          // Restore main data from backup
          this.setWithIntegrity(this.config.key, jsonData);
        }
      }

      if (!jsonData) {
        if (this.config.defaultData !== undefined) {
          console.log(`📦 Using default data for ${this.config.key}`);
          return {
            success: true,
            data: this.config.defaultData
          };
        }
        return {
          success: false,
          data: null,
          error: 'No data found'
        };
      }

      const parsedData = JSON.parse(jsonData);
      
      // Validate loaded data
      if (this.config.validateData && !this.config.validateData(parsedData)) {
        console.error(`Loaded data validation failed for ${this.config.key}`);
        return {
          success: false,
          data: null,
          error: 'Loaded data validation failed'
        };
      }

      console.log(`✅ Successfully loaded ${this.config.key}:`, parsedData);
      return {
        success: true,
        data: parsedData
      };

    } catch (error) {
      console.error(`❌ Error loading ${this.config.key}:`, error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  remove(): boolean {
    try {
      localStorage.removeItem(this.config.key);
      localStorage.removeItem(this.backupKey);
      localStorage.removeItem(this.versionKey);
      localStorage.removeItem(this.integrityKey);
      localStorage.removeItem(`${this.backupKey}_integrity`);
      console.log(`🗑️ Successfully removed ${this.config.key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error removing ${this.config.key}:`, error);
      return false;
    }
  }

  exists(): boolean {
    return localStorage.getItem(this.config.key) !== null;
  }

  getHealth(): {
    mainExists: boolean;
    backupExists: boolean;
    integrityValid: boolean;
    versionMatch: boolean;
  } {
    const mainData = localStorage.getItem(this.config.key);
    const backupData = localStorage.getItem(this.backupKey);
    const version = localStorage.getItem(this.versionKey);
    const mainChecksum = localStorage.getItem(this.integrityKey);
    
    return {
      mainExists: !!mainData,
      backupExists: !!backupData,
      integrityValid: mainData && mainChecksum ? this.validateIntegrity(mainData, mainChecksum) : false,
      versionMatch: version === this.config.version?.toString()
    };
  }
}
