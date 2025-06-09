
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter, Archive, Edit, Download, Upload, Eye } from 'lucide-react';
import { TemplateEditor } from './TemplateEditor';
import { TemplateList } from './TemplateList';
import { TemplateViewer } from './TemplateViewer';

export interface Template {
  id: string;
  title: string;
  category: 'Legal' | 'Operational' | 'Communication' | 'Agreements';
  parties: string[];
  content: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  tags: string[];
  isArchived: boolean;
  createdBy: string;
}

const TemplateManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setActiveTab('editor');
  };

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setActiveTab('editor');
  };

  const handleViewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setActiveTab('viewer');
  };

  const handleSaveTemplate = (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
    if (selectedTemplate) {
      // Update existing template
      const updatedTemplate: Template = {
        ...selectedTemplate,
        ...template,
        updatedAt: new Date(),
        version: selectedTemplate.version + 1,
      };
      setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? updatedTemplate : t));
    } else {
      // Create new template
      const newTemplate: Template = {
        ...template,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      };
      setTemplates(prev => [...prev, newTemplate]);
    }
    setActiveTab('list');
  };

  const handleArchiveTemplate = (templateId: string) => {
    setTemplates(prev => 
      prev.map(t => t.id === templateId ? { ...t, isArchived: !t.isArchived } : t)
    );
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.parties.some(party => party.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Legal & Operational Templates</h1>
          <p className="text-muted-foreground">Manage your organization's legal and operational document templates</p>
        </div>
        <Button onClick={handleCreateTemplate} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Template
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Template Library</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="viewer">Viewer</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Categories</option>
                  <option value="Legal">Legal</option>
                  <option value="Operational">Operational</option>
                  <option value="Communication">Communication</option>
                  <option value="Agreements">Agreements</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <TemplateList
                templates={filteredTemplates}
                onEdit={handleEditTemplate}
                onView={handleViewTemplate}
                onArchive={handleArchiveTemplate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor">
          <TemplateEditor
            template={selectedTemplate}
            onSave={handleSaveTemplate}
            onCancel={() => setActiveTab('list')}
          />
        </TabsContent>

        <TabsContent value="viewer">
          {selectedTemplate && (
            <TemplateViewer
              template={selectedTemplate}
              onEdit={() => setActiveTab('editor')}
              onBack={() => setActiveTab('list')}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplateManagement;
