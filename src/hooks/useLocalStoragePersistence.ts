import { useState, useEffect, useCallback, useRef } from 'react';

interface PersistentState {
  membership_status: 'inactive' | 'active' | 'member_paid';
  membership_type: 'not-a-member' | 'annual' | null;
  selected_engagement_model: string | null;
  selected_frequency: 'quarterly' | 'half-yearly' | 'annual' | null;
  payment_records: PaymentRecord[];
  last_updated: string;
}

interface PaymentRecord {
  id: string;
  type: 'membership' | 'engagement';
  amount: number;
  currency: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  // Enhanced fields for engagement model details
  engagementModel?: string;
  billingFrequency?: 'quarterly' | 'half-yearly' | 'annual';
  pricingStructure?: 'percentage' | 'currency';
  organizationId?: string;
  organizationName?: string;
}

const DEFAULT_STATE: PersistentState = {
  membership_status: 'inactive',
  membership_type: null,
  selected_engagement_model: null,
  selected_frequency: null,
  payment_records: [],
  last_updated: new Date().toISOString()
};

const STORAGE_KEY = 'membership_pricing_system_state';

// Get organization-specific storage key
const getStorageKey = (organizationId?: string) => {
  return organizationId ? `${STORAGE_KEY}_${organizationId}` : STORAGE_KEY;
};

export const useLocalStoragePersistence = (organizationId?: string) => {
  const [state, setState] = useState<PersistentState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Load state from localStorage
  const loadState = useCallback((): PersistentState => {
    try {
      const storageKey = getStorageKey(organizationId);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log(`📤 Loaded persistent state for ${organizationId || 'global'}:`, parsed);
        return { ...DEFAULT_STATE, ...parsed };
      }
    } catch (err) {
      console.error('❌ Error loading persistent state:', err);
      setError('Failed to load saved data');
    }
    return DEFAULT_STATE;
  }, [organizationId]);

  // Save state to localStorage with debouncing
  const saveState = useCallback((newState: PersistentState) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce save operations
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const stateToSave = {
          ...newState,
          last_updated: new Date().toISOString()
        };
        const storageKey = getStorageKey(organizationId);
        localStorage.setItem(storageKey, JSON.stringify(stateToSave));
        console.log(`💾 Saved persistent state for ${organizationId || 'global'}:`, stateToSave);
        setError(null);
      } catch (err) {
        console.error('❌ Error saving persistent state:', err);
        if (err instanceof Error && err.name === 'QuotaExceededError') {
          setError('Storage quota exceeded. Please clear some browser data.');
        } else {
          setError('Failed to save data');
        }
      }
    }, 300);
  }, [organizationId]);

  // Update state and persist
  const updateState = useCallback((updates: Partial<PersistentState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      saveState(newState);
      return newState;
    });
  }, [saveState]);

  // Specific update functions
  const updateMembershipStatus = useCallback((status: PersistentState['membership_status']) => {
    updateState({ membership_status: status });
  }, [updateState]);

  const updateMembershipType = useCallback((type: PersistentState['membership_type']) => {
    updateState({ membership_type: type });
  }, [updateState]);

  const updateEngagementModel = useCallback((model: string | null) => {
    updateState({ selected_engagement_model: model });
  }, [updateState]);

  const updateFrequency = useCallback((frequency: PersistentState['selected_frequency']) => {
    updateState({ selected_frequency: frequency });
  }, [updateState]);

  const addPaymentRecord = useCallback((record: Omit<PaymentRecord, 'id' | 'timestamp'>) => {
    const newRecord: PaymentRecord = {
      ...record,
      id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      organizationId: record.organizationId || organizationId || 'global'
    };
    
    setState(prev => {
      const newState = {
        ...prev,
        payment_records: [...prev.payment_records, newRecord]
      };
      saveState(newState);
      return newState;
    });
    
    return newRecord;
  }, [saveState, organizationId]);

  const updatePaymentRecord = useCallback((id: string, updates: Partial<PaymentRecord>) => {
    setState(prev => {
      const newState = {
        ...prev,
        payment_records: prev.payment_records.map(record => 
          record.id === id ? { ...record, ...updates } : record
        )
      };
      saveState(newState);
      return newState;
    });
  }, [saveState]);

  // Clear all data
  const clearState = useCallback(() => {
    const storageKey = getStorageKey(organizationId);
    localStorage.removeItem(storageKey);
    setState(DEFAULT_STATE);
    console.log(`🗑️ Cleared persistent state for ${organizationId || 'global'}`);
  }, [organizationId]);

  // Initialize on mount
  useEffect(() => {
    const initialState = loadState();
    setState(initialState);
    setLoading(false);
  }, [loadState]);

  // Listen for storage changes across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const storageKey = getStorageKey(organizationId);
      if (e.key === storageKey && e.newValue) {
        try {
          const newState = JSON.parse(e.newValue);
          setState(newState);
          console.log(`🔄 Updated state from another tab for ${organizationId || 'global'}:`, newState);
        } catch (err) {
          console.error('❌ Error processing storage change:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [organizationId]);

  // Save pending changes before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        // Force immediate save
        try {
          const storageKey = getStorageKey(organizationId);
          localStorage.setItem(storageKey, JSON.stringify({
            ...state,
            last_updated: new Date().toISOString()
          }));
        } catch (err) {
          console.error('❌ Error saving before unload:', err);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state, organizationId]);

  return {
    state,
    loading,
    error,
    updateMembershipStatus,
    updateMembershipType,
    updateEngagementModel,
    updateFrequency,
    addPaymentRecord,
    updatePaymentRecord,
    clearState,
    updateState
  };
};