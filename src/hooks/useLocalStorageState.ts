import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseLocalStorageStateOptions<T> {
  key: string;
  defaultValue: T;
  validator?: (value: any) => value is T;
  serializer?: {
    serialize: (value: T) => string;
    deserialize: (value: string) => T;
  };
  onError?: (error: Error, operation: 'read' | 'write') => void;
}

export function useLocalStorageState<T>(options: UseLocalStorageStateOptions<T>) {
  const {
    key,
    defaultValue,
    validator,
    serializer = {
      serialize: JSON.stringify,
      deserialize: JSON.parse
    },
    onError
  } = options;

  const [state, setState] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const initialized = useRef(false);

  // Helper function to safely read from localStorage
  const readFromStorage = useCallback((): T => {
    console.log(`📤 useLocalStorageState: Reading from localStorage key: ${key}`);
    
    try {
      const item = localStorage.getItem(key);
      
      if (item === null) {
        console.log(`📭 useLocalStorageState: No data found for key: ${key}, using default value`);
        return defaultValue;
      }

      const parsed = serializer.deserialize(item);
      
      // Validate the data if validator is provided
      if (validator && !validator(parsed)) {
        console.warn(`⚠️ useLocalStorageState: Invalid data for key: ${key}, using default value`);
        return defaultValue;
      }

      console.log(`✅ useLocalStorageState: Successfully read data for key: ${key}`, parsed);
      return parsed;
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown localStorage read error');
      console.error(`❌ useLocalStorageState: Error reading from localStorage key: ${key}`, error);
      
      if (onError) {
        onError(error, 'read');
      }
      
      setError(error);
      return defaultValue;
    }
  }, [key, defaultValue, validator, serializer, onError]);

  // Helper function to safely write to localStorage
  const writeToStorage = useCallback((value: T): boolean => {
    console.log(`💾 useLocalStorageState: Writing to localStorage key: ${key}`, value);
    
    try {
      const serialized = serializer.serialize(value);
      localStorage.setItem(key, serialized);
      
      // Verify the write was successful
      const verification = localStorage.getItem(key);
      if (verification !== serialized) {
        throw new Error('Write verification failed - data not properly saved');
      }
      
      console.log(`✅ useLocalStorageState: Successfully wrote data for key: ${key}`);
      setError(null); // Clear any previous errors
      return true;
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown localStorage write error');
      console.error(`❌ useLocalStorageState: Error writing to localStorage key: ${key}`, error);
      
      if (onError) {
        onError(error, 'write');
      }
      
      setError(error);
      return false;
    }
  }, [key, serializer, onError]);

  // Initialize state from localStorage on mount
  useEffect(() => {
    if (initialized.current) return;
    
    console.log(`🔄 useLocalStorageState: Initializing state for key: ${key}`);
    setLoading(true);
    
    try {
      const storedValue = readFromStorage();
      setState(storedValue);
      console.log(`✅ useLocalStorageState: State initialized for key: ${key}`, storedValue);
    } catch (err) {
      console.error(`❌ useLocalStorageState: Failed to initialize state for key: ${key}`, err);
    } finally {
      setLoading(false);
      initialized.current = true;
    }
  }, [key, readFromStorage]);

  // Listen for localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        console.log(`🔄 useLocalStorageState: External change detected for key: ${key}`);
        try {
          const newValue = serializer.deserialize(e.newValue);
          if (!validator || validator(newValue)) {
            setState(newValue);
            console.log(`✅ useLocalStorageState: State updated from external change for key: ${key}`, newValue);
          }
        } catch (err) {
          console.error(`❌ useLocalStorageState: Error processing external change for key: ${key}`, err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, validator, serializer]);

  // Function to update both state and localStorage
  const setValue = useCallback((value: T | ((prev: T) => T)): boolean => {
    console.log(`🔄 useLocalStorageState: Setting value for key: ${key}`);
    
    try {
      const newValue = typeof value === 'function' ? (value as (prev: T) => T)(state) : value;
      
      // Validate the new value if validator is provided
      if (validator && !validator(newValue)) {
        console.error(`❌ useLocalStorageState: Invalid value for key: ${key}`, newValue);
        return false;
      }
      
      // Update localStorage first
      const writeSuccess = writeToStorage(newValue);
      
      if (writeSuccess) {
        // Only update state if localStorage write was successful
        setState(newValue);
        console.log(`✅ useLocalStorageState: Value successfully set for key: ${key}`, newValue);
        return true;
      } else {
        console.error(`❌ useLocalStorageState: Failed to write to localStorage for key: ${key}`);
        return false;
      }
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown setValue error');
      console.error(`❌ useLocalStorageState: Exception in setValue for key: ${key}`, error);
      setError(error);
      return false;
    }
  }, [key, state, validator, writeToStorage]);

  // Function to refresh state from localStorage
  const refresh = useCallback(() => {
    console.log(`🔄 useLocalStorageState: Refreshing state for key: ${key}`);
    const storedValue = readFromStorage();
    setState(storedValue);
    return storedValue;
  }, [readFromStorage]);

  // Function to remove from localStorage and reset to default
  const remove = useCallback((): boolean => {
    console.log(`🗑️ useLocalStorageState: Removing key: ${key}`);
    
    try {
      localStorage.removeItem(key);
      setState(defaultValue);
      setError(null);
      console.log(`✅ useLocalStorageState: Successfully removed key: ${key}`);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown remove error');
      console.error(`❌ useLocalStorageState: Error removing key: ${key}`, error);
      setError(error);
      return false;
    }
  }, [key, defaultValue]);

  // Function to check if localStorage is available
  const isStorageAvailable = useCallback((): boolean => {
    try {
      const testKey = `__localStorage_test_${Date.now()}`;
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    value: state,
    setValue,
    loading,
    error,
    refresh,
    remove,
    isStorageAvailable: isStorageAvailable()
  };
}