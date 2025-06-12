
import React, { useEffect } from 'react';
import { clearAllMembershipData } from '@/utils/clearMembershipStorage';

const StorageCleaner = () => {
  useEffect(() => {
    clearAllMembershipData();
  }, []);

  return null;
};

export default StorageCleaner;
