
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Save, X, Upload, Tag, Download, FileText } from 'lucide-react';
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
  const [autoSaveStatus, setAutoSaveStatus] = useState('');

  useEffect(() => {
    if (template) {
      setTitle(template.title);
      setCategory(template.category);
      setParties(template.parties.length > 0 ? template.parties : ['', '']);
      setContent(template.content);
      setTags(template.tags);
    }
  }, [template]);

  // Auto-save functionality
  const autoSave = useCallback(() => {
    if (title || content) {
      setAutoSaveStatus('Auto-saving...');
      // Simulate auto-save delay
      setTimeout(() => {
        setAutoSaveStatus('Auto-saved');
        setTimeout(() => setAutoSaveStatus(''), 2000);
      }, 500);
    }
  }, [title, content]);

  useEffect(() => {
    const autoSaveTimer = setTimeout(autoSave, 3000);
    return () => clearTimeout(autoSaveTimer);
  }, [title, content, autoSave]);

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
      createdBy: 'Current User',
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

  const exportAsPDF = () => {
    // This would integrate with a PDF library in a real app
    console.log('Exporting as PDF...');
  };

  const exportAsDocx = () => {
    // This would integrate with a DOCX library in a real app
    console.log('Exporting as DOCX...');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{template ? 'Edit Template' : 'Create New Template'}</CardTitle>
            <div className="flex items-center gap-2">
              {autoSaveStatus && (
                <span className="text-sm text-muted-foreground">{autoSaveStatus}</span>
              )}
              <Button onClick={exportAsPDF} variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                PDF
              </Button>
              <Button onClick={exportAsDocx} variant="outline" size="sm" className="gap-2">
                <FileText className="w-4 h-4" />
                DOCX
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Template Title*</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Privacy & Data Protection Agreement"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category*</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Template['category'])}
                className="w-full px-3 py-2 border rounded-md bg-background"
                required
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
                <div className="flex-1">
                  <Input
                    value={party}
                    onChange={(e) => updateParty(index, e.target.value)}
                    placeholder={`${index === 0 ? 'First' : index === 1 ? 'Second' : `${index + 1}th`} Party (e.g., Company Name, Individual)`}
                  />
                </div>
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
                placeholder="Add tag... (e.g., gdpr, employment, confidential)"
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
              <span className="text-sm text-muted-foreground">
                Supports .txt, .docx, .pdf files
              </span>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-2">
            <Label>Template Content*</Label>
            <p className="text-sm text-muted-foreground">
              Use the rich text editor below to create your template. You can format text, add tables, insert images, and more.
            </p>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2" disabled={!title || !content}>
              <Save className="w-4 h-4" />
              Save Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
