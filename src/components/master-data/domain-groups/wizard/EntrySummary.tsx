
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Category } from './types';

interface EntrySummaryProps {
  categories: Category[];
}

const EntrySummary: React.FC<EntrySummaryProps> = ({ categories }) => {
  const categoriesCount = categories.filter(cat => cat.name.trim()).length;
  const subCategoriesCount = categories.reduce((total, cat) => 
    total + cat.subCategories.filter(sub => sub.name.trim()).length, 0
  );

  return (
    <Card className="bg-muted/30">
      <CardContent className="pt-6">
        <h3 className="font-medium mb-2">Entry Summary</h3>
        <div className="space-y-1 text-sm">
          <div>
            <span className="text-muted-foreground">Categories:</span>{' '}
            <span className="font-medium">{categoriesCount}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Sub-Categories:</span>{' '}
            <span className="font-medium">{subCategoriesCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EntrySummary;
