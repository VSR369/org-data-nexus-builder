
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Globe } from 'lucide-react';

interface IndustrySegmentHeaderProps {
  industrySegment: string;
  domainGroupsCount: number;
  categoriesCount: number;
  subCategoriesCount: number;
}

const IndustrySegmentHeader: React.FC<IndustrySegmentHeaderProps> = ({
  industrySegment,
  domainGroupsCount,
  categoriesCount,
  subCategoriesCount
}) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <Globe className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-blue-900">{industrySegment}</h2>
        <p className="text-sm text-blue-700">
          {domainGroupsCount} Domain Group{domainGroupsCount !== 1 ? 's' : ''} • {' '}
          {categoriesCount} Categories • {' '}
          {subCategoriesCount} Sub-Categories
        </p>
      </div>
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        Industry Segment
      </Badge>
    </div>
  );
};

export default IndustrySegmentHeader;
