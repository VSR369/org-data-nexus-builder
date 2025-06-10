
import React from 'react';

interface EnrollmentTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

const EnrollmentTabs: React.FC<EnrollmentTabsProps> = ({
  activeTab,
  onTabChange,
  children
}) => {
  return (
    <div className="w-full">
      {children}
    </div>
  );
};

export default EnrollmentTabs;
