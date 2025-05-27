import React from 'react';
import { ColorGroup } from '../../services/colors/colorExtractor';
import { useColorStore } from '../../stores/colorStore';

interface ColorGroupProps {
  group: ColorGroup;
}

export const ColorGroup: React.FC<ColorGroupProps> = ({ group }) => {
  const { selectedGroup, setSelectedGroup } = useColorStore();
  const isSelected = selectedGroup === group.id;

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      onClick={() => setSelectedGroup(group.id)}
    >
      <h3 className="text-lg font-semibold">{group.harmony} Group</h3>
      <div className="flex space-x-2 mt-2">
        {group.colors.map((color, index) => (
          <div
            key={index}
            className="w-16 h-16 rounded-lg"
            style={{ backgroundColor: color.hex }}
            title={color.hex}
          />
        ))}
      </div>
    </div>
  );
};