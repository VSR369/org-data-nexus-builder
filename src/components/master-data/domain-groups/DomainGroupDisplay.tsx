
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DomainGroupsData } from '@/types/domainGroups';
import { domainGroupsDataManager } from './domainGroupsDataManager';

interface DomainGroupDisplayProps {
  data: DomainGroupsData;
  onDataUpdate: (newData: DomainGroupsData) => void;
}

const DomainGroupDisplay: React.FC<DomainGroupDisplayProps> = ({ data, onDataUpdate }) => {
  const { toast } = useToast();

  // Handle delete
  const handleDelete = (domainGroupId: string) => {
    const updatedData = {
      domainGroups: data.domainGroups.filter(dg => dg.id !== domainGroupId),
      categories: data.categories.filter(cat => cat.domainGroupId !== domainGroupId),
      subCategories: data.subCategories.filter(sub => {
        const category = data.categories.find(cat => cat.id === sub.categoryId);
        return category?.domainGroupId !== domainGroupId;
      })
    };
    
    onDataUpdate(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    
    toast({
      title: "Deleted",
      description: "Domain group hierarchy deleted successfully",
    });
  };

  // Get hierarchical data for display
  const hierarchicalData = data.domainGroups.map(domainGroup => {
    const categories = data.categories.filter(cat => cat.domainGroupId === domainGroup.id);
    return {
      ...domainGroup,
      categories: categories.map(category => ({
        ...category,
        subCategories: data.subCategories.filter(sub => sub.categoryId === category.id)
      }))
    };
  });

  if (hierarchicalData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Created Domain Group Hierarchies</CardTitle>
        <CardDescription>
          View all created domain group hierarchies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Industry Segment</TableHead>
              <TableHead>Domain Group</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Sub Categories</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hierarchicalData.map((domainGroup) => (
              <TableRow key={domainGroup.id}>
                <TableCell>
                  <div className="font-medium">{domainGroup.industrySegmentName || 'Not Specified'}</div>
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    <div>{domainGroup.name}</div>
                    {domainGroup.description && (
                      <div className="text-xs text-muted-foreground">{domainGroup.description}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {domainGroup.categories.map((category) => (
                      <div key={category.id} className="text-sm">
                        <div className="font-medium">{category.name}</div>
                        {category.description && (
                          <div className="text-xs text-muted-foreground">{category.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {domainGroup.categories.map((category) => 
                      category.subCategories.map((subCategory) => (
                        <div key={subCategory.id} className="text-sm">
                          <div className="font-medium">{subCategory.name}</div>
                          {subCategory.description && (
                            <div className="text-xs text-muted-foreground">{subCategory.description}</div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={domainGroup.isActive ? "default" : "secondary"}>
                    {domainGroup.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(domainGroup.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DomainGroupDisplay;
