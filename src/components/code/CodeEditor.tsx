import React, { useState } from 'react';
import { Button } from '../common/Button';

interface CodeEditorProps {
  code: string;
  language: 'css' | 'html' | 'javascript';
  onSave: (code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, language, onSave }) => {
  const [value, setValue] = useState(code);

  const handleSave = () => {
    onSave(value);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{language.toUpperCase()} Editor</h3>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full h-64 p-2 border rounded-lg font-mono text-sm"
        spellCheck={false}
      />
      <Button onClick={handleSave} className="mt-2">Save Changes</Button>
    </div>
  );
};