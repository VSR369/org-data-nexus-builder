
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Globe } from 'lucide-react';
import { DomainGroup } from '@/types/domainGroups';
import DomainGroupCard from './DomainGroupCard';

interface IndustrySegmentCardProps {
  industrySegment: string;
  domainGroups: DomainGroup[];
}

const IndustrySegmentCard: React.FC<IndustrySegmentCardProps> = ({ 
  industrySegment, 
  domainGroups 
}) => {
  const totalCategories = domainGroups.reduce((sum, dg) => sum + (dg.categories?.length || 0), 0);
  const totalSubCategories = domainGroups.reduce((sum, dg) => 
    sum + (dg.categories?.reduce((catSum, cat) => catSum + (cat.subCategories?.length || 0), 0) || 0), 0
  );

  return (
    <div className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
      {/* Industry Segment Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Globe className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-blue-900">{industrySegment}</h2>
          <p className="text-sm text-blue-700">
            {domainGroups.length} Domain Group{domainGroups.length !== 1 ? 's' : ''} • {' '}
            {totalCategories} Categories • {' '}
            {totalSubCategories} Sub-Categories
          </p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Industry Segment
        </Badge>
      </div>

      {/* Domain Groups within this Industry Segment */}
      <div className="space-y-4">
        {domainGroups.map((domainGroup) => (
          <DomainGroupCard key={domainGroup.id} domainGroup={domainGroup as any} />
        ))}
      </div>
    </div>
  );
};

export default IndustrySegmentCard;
