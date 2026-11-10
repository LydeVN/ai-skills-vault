import React, { useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, className = '' }) => {
  const html = useMemo(() => {
    try {
      // Configure marked for GitHub Flavored Markdown and breaks
      return marked.parse(content || '', {
        gfm: true,
        breaks: true,
      }) as string;
    } catch (e) {
      console.error('Failed to parse markdown', e);
      return `<pre>${content}</pre>`;
    }
  }, [content]);

  return (
    <div 
      className={`markdown-rendered prose prose-invert max-w-none text-slate-200 text-xs sm:text-sm leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
