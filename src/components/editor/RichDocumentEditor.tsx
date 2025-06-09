
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Download, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

// Import quill-table for table functionality
import 'quill-table/dist/quill-table.css';

const RichDocumentEditor = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Untitled Document');
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const quillRef = useRef<ReactQuill>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Enhanced toolbar with all formatting options
  const modules = {
    toolbar: [
      [{ 'header': ['1', '2', '3', '4', '5', '6', false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['table'],
      ['clean']
    ],
    table: true,
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet', 'indent',
    'align', 'direction',
    'link', 'image', 'video',
    'blockquote', 'code-block',
    'table'
  ];

  // Auto-save functionality
  const autoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      setIsAutoSaving(true);
      // Simulate auto-save (in real app, this would save to backend)
      localStorage.setItem('rich_document_content', content);
      localStorage.setItem('rich_document_title', title);
      setLastSaved(new Date());
      setIsAutoSaving(false);
      toast.success('Document auto-saved');
    }, 2000);
  }, [content, title]);

  // Trigger auto-save when content changes
  useEffect(() => {
    if (content) {
      autoSave();
    }
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [content, autoSave]);

  // Load saved content on component mount
  useEffect(() => {
    const savedContent = localStorage.getItem('rich_document_content');
    const savedTitle = localStorage.getItem('rich_document_title');
    if (savedContent) {
      setContent(savedContent);
    }
    if (savedTitle) {
      setTitle(savedTitle);
    }
  }, []);

  const handleManualSave = () => {
    localStorage.setItem('rich_document_content', content);
    localStorage.setItem('rich_document_title', title);
    setLastSaved(new Date());
    toast.success('Document saved successfully');
  };

  const handleExportHTML = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .document-title { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="document-title">${title}</div>
          ${content}
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Document exported as HTML');
  };

  const handleExportPDF = () => {
    // This would require a PDF generation library in a real implementation
    toast.info('PDF export feature would be implemented with a PDF library');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text);
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
        toast.success('File uploaded successfully');
      };
      reader.readAsText(file);
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection();
            quill.insertEmbed(range?.index || 0, 'image', imageUrl);
          }
        };
        reader.readAsDataURL(file);
      }
    };
  };

  // Custom image handler
  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.getModule('toolbar').addHandler('image', handleImageUpload);
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold bg-transparent border-none outline-none w-full"
                placeholder="Document Title"
              />
              <div className="text-sm text-muted-foreground mt-1">
                {isAutoSaving ? (
                  <span>Auto-saving...</span>
                ) : lastSaved ? (
                  <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                ) : (
                  <span>Not saved</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".txt,.html,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </span>
                </Button>
              </label>
              <Button onClick={handleManualSave} variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleExportHTML} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export HTML
              </Button>
              <Button onClick={handleExportPDF} variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="min-h-[500px]">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="Start writing your document..."
              style={{ height: '400px' }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RichDocumentEditor;
