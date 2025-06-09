
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Save, X, Upload, Tag } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { Template } from './TemplateManagement';

interface TemplateEditorProps {
  template: Template | null;
  onSave: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
  onCancel: () => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Template['category']>('Legal');
  const [parties, setParties] = useState<string[]>(['', '']);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (template) {
      setTitle(template.title);
      setCategory(template.category);
      setParties(template.parties.length > 0 ? template.parties : ['', '']);
      setContent(template.content);
      setTags(template.tags);
    }
  }, [template]);

  const addParty = () => {
    setParties([...parties, '']);
  };

  const removeParty = (index: number) => {
    if (parties.length > 2) {
      setParties(parties.filter((_, i) => i !== index));
    }
  };

  const updateParty = (index: number, value: string) => {
    const newParties = [...parties];
    newParties[index] = value;
    setParties(newParties);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    onSave({
      title,
      category,
      parties: parties.filter(party => party.trim() !== ''),
      content,
      tags,
      isArchived: false,
      createdBy: 'Current User', // In real app, get from auth context
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(content + '\n\n' + text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{template ? 'Edit Template' : 'Create New Template'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Template Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Privacy & Data Protection"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Template['category'])}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Legal">Legal</option>
                <option value="Operational">Operational</option>
                <option value="Communication">Communication</option>
                <option value="Agreements">Agreements</option>
              </select>
            </div>
          </div>

          {/* Parties */}
          <div className="space-y-4">
            <Label>Parties Involved</Label>
            {parties.map((party, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={party}
                  onChange={(e) => updateParty(index, e.target.value)}
                  placeholder={`${index === 0 ? 'First' : index === 1 ? 'Second' : `${index + 1}th`} Party`}
                />
                {parties.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeParty(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addParty} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Party
            </Button>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  #{tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTag(tag)}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag..."
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button type="button" onClick={addTag} variant="outline" size="icon">
                <Tag className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Import Content from File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                accept=".txt,.docx,.pdf"
                onChange={handleFileUpload}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-2">
            <Label>Template Content</Label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
