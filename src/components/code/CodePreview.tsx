import React from 'react';

interface CodePreviewProps {
  html: string;
  css: string;
  js?: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ html, css, js }) => {
  const srcDoc = `
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        ${js ? `<script>${js}</script>` : ''}
      </body>
    </html>
  `;

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Code Preview</h3>
      <iframe
        srcDoc={srcDoc}
        className="w-full h-96 border rounded-lg"
        title="Code Preview"
        sandbox="allow-scripts"
      />
    </div>
  );
};