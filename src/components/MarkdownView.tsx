import React from 'react';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, className = '' }) => {
  // Simple clean parser for markdown elements like headings, bold, lists, code blocks
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeContent = '';

    return lines.map((line, idx) => {
      // Code block handling
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const currentCode = codeContent;
          codeContent = '';
          return (
            <pre key={idx} className="my-2 p-3 bg-gray-900 text-emerald-400 font-mono text-xs rounded-lg overflow-x-auto">
              <code>{currentCode}</code>
            </pre>
          );
        } else {
          inCodeBlock = true;
          return null;
        }
      }

      if (inCodeBlock) {
        codeContent += (codeContent ? '\n' : '') + line;
        return null;
      }

      // Headers
      if (line.startsWith('# ')) {
        return (
          <h1 key={idx} className="text-xl font-bold text-gray-900 dark:text-white my-3 border-b pb-1 border-gray-200 dark:border-gray-800">
            {formatInline(line.substring(2))}
          </h1>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-2">
            {formatInline(line.substring(3))}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base font-semibold text-gray-800 dark:text-gray-100 mt-3 mb-1">
            {formatInline(line.substring(4))}
          </h3>
        );
      }

      // Bullet items
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={idx} className="ml-5 list-disc my-1 text-gray-700 dark:text-gray-300">
            {formatInline(line.trim().substring(2))}
          </li>
        );
      }

      // Numbered items
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex gap-2 my-1 text-gray-700 dark:text-gray-300 ml-2">
            <span className="font-semibold text-blue-600 dark:text-blue-400">{numMatch[1]}.</span>
            <span>{formatInline(numMatch[2])}</span>
          </div>
        );
      }

      // Empty lines
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Standard paragraph
      return (
        <p key={idx} className="my-1.5 leading-relaxed text-gray-800 dark:text-gray-200">
          {formatInline(line)}
        </p>
      );
    });
  };

  const formatInline = (text: string): React.ReactNode[] => {
    // Split by **bold** or *italic* or `inline code`
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-gray-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded text-xs font-mono">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return <div className={`text-sm leading-relaxed space-y-1 ${className}`}>{renderFormattedText(content)}</div>;
};
