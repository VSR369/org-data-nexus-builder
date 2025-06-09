
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Download, Upload, Eye, EyeOff, Code, FileText } from 'lucide-react';
import { Template } from './TemplateManagement';

interface TemplateViewerProps {
  template: Template;
  onEdit: () => void;
  onBack: () => void;
}

export const TemplateViewer: React.FC<TemplateViewerProps> = ({
  template,
  onEdit,
  onBack,
}) => {
  const [viewMode, setViewMode] = React.useState<'rendered' | 'html' | 'plain'>('rendered');

  const handleDownloadPDF = () => {
    // In a real implementation, you would use jsPDF here
    console.log('Download as PDF');
  };

  const handleDownloadDOCX = () => {
    // In a real implementation, you would use a library like docx
    console.log('Download as DOCX');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File uploaded:', file.name);
      // Handle file upload logic here
    }
  };

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'html':
        return (
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
            <code>{template.content}</code>
          </pre>
        );
      case 'plain':
        return (
          <div className="bg-gray-50 p-4 rounded-md">
            <pre className="whitespace-pre-wrap text-sm">
              {template.content.replace(/<[^>]*>/g, '')}
            </pre>
          </div>
        );
      default:
        return (
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: template.content }}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Templates
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'rendered' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('rendered')}
              className="gap-1"
            >
              <Eye className="w-4 h-4" />
              Rendered
            </Button>
            <Button
              variant={viewMode === 'html' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('html')}
              className="gap-1"
            >
              <Code className="w-4 h-4" />
              HTML
            </Button>
            <Button
              variant={viewMode === 'plain' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('plain')}
              className="gap-1"
            >
              <FileText className="w-4 h-4" />
              Plain Text
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">{template.title}</CardTitle>
                <Badge className={getCategoryColor(template.category)}>
                  {template.category}
                </Badge>
                {template.isArchived && (
                  <Badge variant="secondary">Archived</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Created:</span> {formatDate(template.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Updated:</span> {formatDate(template.updatedAt)}
                </div>
                <div>
                  <span className="font-medium">Version:</span> {template.version}
                </div>
              </div>

              {template.parties.length > 0 && (
                <div>
                  <span className="font-medium text-sm">Parties Involved:</span>
                  <div className="mt-1">
                    {template.parties.map((party, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-1">
                        {party}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {template.tags.length > 0 && (
                <div>
                  <span className="font-medium text-sm">Tags:</span>
                  <div className="mt-1">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="mr-2 mb-1">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={onEdit} className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Template
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownloadPDF} className="gap-1">
                  <Download className="w-4 h-4" />
                  PDF
                </Button>
                <Button variant="outline" onClick={handleDownloadDOCX} className="gap-1">
                  <Download className="w-4 h-4" />
                  DOCX
                </Button>
              </div>
              <div>
                <input
                  type="file"
                  id="signed-upload"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('signed-upload')?.click()}
                  className="gap-2 w-full"
                >
                  <Upload className="w-4 h-4" />
                  Upload Signed
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {renderContent()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
