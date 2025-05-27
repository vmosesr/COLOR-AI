import React from 'react';
import { NavLink } from 'react-router-dom';
import { Palette, Code, MessageSquare } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r p-4">
      <h2 className="text-xl font-bold mb-4">ColorPicker AI</h2>
      <nav className="space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`
          }
        >
          <Palette className="w-5 h-5" />
          <span>Color Extractor</span>
        </NavLink>
        <NavLink
          to="/code"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`
          }
        >
          <Code className="w-5 h-5" />
          <span>Code Generator</span>
        </NavLink>
        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`
          }
        >
          <MessageSquare className="w-5 h-5" />
          <span>AI Chat</span>
        </NavLink>
      </nav>
    </aside>
  );
};