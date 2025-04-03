import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          // Customize the rendering of specific markdown elements
          p: ({ ...props }) => <p className="mb-4 last:mb-0" {...props} />,
          h1: ({ ...props }) => <h1 className="text-2xl font-bold mb-4" {...props} />,
          h2: ({ ...props }) => <h2 className="text-xl font-bold mb-3" {...props} />,
          h3: ({ ...props }) => <h3 className="text-lg font-bold mb-2" {...props} />,
          h4: ({ ...props }) => <h4 className="text-base font-bold mb-2" {...props} />,
          ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
          ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />,
          li: ({ ...props }) => <li className="mb-1" {...props} />,
          a: ({ ...props }) => <a className="text-blue-500 hover:underline" {...props} />,
          blockquote: ({ ...props }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
          ),
          code: ({ inline, ...props }) => 
            inline ? (
              <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props} />
            ) : (
              <code className="block bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm overflow-x-auto my-4" {...props} />
            ),
          pre: ({ ...props }) => <pre className="my-4" {...props} />,
          strong: ({ ...props }) => <strong className="font-bold" {...props} />,
          em: ({ ...props }) => <em className="italic" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}