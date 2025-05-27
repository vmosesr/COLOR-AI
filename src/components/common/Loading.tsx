import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-2">Loading...</span>
    </div>
  );
};