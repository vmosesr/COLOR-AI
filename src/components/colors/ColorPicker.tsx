import React, { useState } from 'react';
import { useColorStore } from '../../stores/colorStore';
import { ColorRGB } from '../../services/colors/colorExtractor';

export const ColorPicker: React.FC = () => {
  const [color, setColor] = useState('#ffffff');
  const { colorGroups, setColorGroups } = useColorStore();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const addColorToGroup = () => {
    const newColor: ColorRGB = {
      r: parseInt(color.slice(1, 3), 16),
      g: parseInt(color.slice(3, 5), 16),
      b: parseInt(color.slice(5, 7), 16),
      hex: color,
    };

    const updatedGroups = colorGroups.map(group => ({
      ...group,
      colors: group.id === colorGroups[0]?.id ? [...group.colors, newColor] : group.colors,
    }));

    setColorGroups(updatedGroups);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Manual Color Picker</h2>
      <div className="flex space-x-4">
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="w-16 h-16"
        />
        <input
          type="text"
          value={color}
          onChange={handleColorChange}
          className="p-2 border rounded-lg"
          placeholder="#ffffff"
        />
        <button
          onClick={addColorToGroup}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Add to Palette
        </button>
      </div>
    </div>
  );
};