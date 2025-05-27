import React from 'react';
import type { ColorGroup } from '../../types/colors';

interface ColorPaletteProps {
  group: ColorGroup;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ group }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">{group.harmony} Palette</h3>
      <div className="flex space-x-2 mt-2">
        {group.colors.map((color, index) => (
          <div
            key={index}
            className="w-24 h-24 rounded-lg flex flex-col items-center justify-center"
            style={{ backgroundColor: color.hex }}
          >
            <span className="text-xs text-white">{color.hex}</span>
            <span className="text-xs text-white">RGB({color.r}, {color.g}, {color.b})</span>
          </div>
        ))}
      </div>
    </div>
  );
};