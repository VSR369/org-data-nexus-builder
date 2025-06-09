
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const quillRef = useRef<any>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && editorRef.current && !quillRef.current) {
      import('react-quill').then((ReactQuill) => {
        const Quill = ReactQuill.default;
        
        const toolbarOptions = [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'font': [] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          [{ 'align': [] }],
          ['link', 'image', 'video'],
          ['blockquote', 'code-block'],
          ['table'],
          ['clean']
        ];

        if (editorRef.current) {
          quillRef.current = new Quill(editorRef.current, {
            theme: 'snow',
            modules: {
              toolbar: toolbarOptions,
              table: true,
              clipboard: {
                matchVisual: false
              }
            },
            placeholder: 'Start typing your template content...',
          });

          quillRef.current.on('text-change', () => {
            const content = quillRef.current.root.innerHTML;
            onChange(content);
          });

          if (value) {
            quillRef.current.root.innerHTML = value;
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value || '';
    }
  }, [value]);

  useEffect(() => {
    // Inject Quill styles dynamically
    const styleId = 'quill-custom-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .ql-toolbar {
          border-top: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          padding: 8px;
          border-radius: 6px 6px 0 0;
          background: #fafafa;
        }
        .ql-container {
          border-bottom: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          border-radius: 0 0 6px 6px;
          min-height: 400px;
          font-family: inherit;
        }
        .ql-editor {
          min-height: 400px;
          padding: 12px;
          font-size: 14px;
          line-height: 1.5;
        }
        .ql-editor h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
        .ql-editor h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; }
        .ql-editor h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; }
        .ql-editor p { margin: 1em 0; }
        .ql-editor ul, .ql-editor ol { margin: 1em 0; padding-left: 2em; }
        .ql-editor table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        .ql-editor td, .ql-editor th { border: 1px solid #ddd; padding: 8px; }
        .ql-editor th { background-color: #f5f5f5; font-weight: bold; }
        .ql-editor blockquote { 
          border-left: 4px solid #ccc; 
          margin: 1.5em 10px; 
          padding: 0.5em 10px; 
          background-color: #f9f9f9; 
        }
        .ql-editor .ql-code-block-container {
          background-color: #f4f4f4;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          margin: 1em 0;
        }
        .ql-editor .ql-code-block {
          background-color: transparent;
          border: none;
          color: #333;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          padding: 12px;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div ref={editorRef} />
      </div>
    </Card>
  );
};
