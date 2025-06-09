
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Archive, Download, Calendar, Users, Tag } from 'lucide-react';
import { Template } from './TemplateManagement';

interface TemplateListProps {
  templates: Template[];
  onEdit: (template: Template) => void;
  onView: (template: Template) => void;
  onArchive: (templateId: string) => void;
}

export const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  onEdit,
  onView,
  onArchive,
}) => {
  const getCategoryColor = (category: Template['category']) => {
    const colors = {
      Legal: 'bg-red-100 text-red-800',
      Operational: 'bg-blue-100 text-blue-800',
      Communication: 'bg-green-100 text-green-800',
      Agreements: 'bg-purple-100 text-purple-800',
    };
    return colors[category];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">No templates found</div>
        <p className="text-sm text-muted-foreground">Create your first template to get started</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {templates.map((template) => (
        <Card key={template.id} className={template.isArchived ? 'opacity-60' : ''}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{template.title}</h3>
                  <Badge className={getCategoryColor(template.category)}>
                    {template.category}
                  </Badge>
                  {template.isArchived && (
                    <Badge variant="secondary">Archived</Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{template.parties.length} parties</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Updated {formatDate(template.updatedAt)}</span>
                  </div>
                  <span>v{template.version}</span>
                </div>

                {template.parties.length > 0 && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Parties: </span>
                    {template.parties.join(', ')}
                  </div>
                )}

                {template.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(template)}
                  className="gap-1"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(template)}
                  className="gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onArchive(template.id)}
                  className="gap-1"
                >
                  <Archive className="w-4 h-4" />
                  {template.isArchived ? 'Restore' : 'Archive'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
