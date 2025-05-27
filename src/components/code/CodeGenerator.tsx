import React, { useState } from 'react';
import { useAI } from '../../hooks/useAI';
import { useColorStore } from '../../stores/colorStore';
import { Button } from '../common/Button';
import { useToast } from '../../hooks/useToast';

export const CodeGenerator: React.FC = () => {
  const [projectType, setProjectType] = useState<'webpage' | 'mobile' | 'branding'>('webpage');
  const [description, setDescription] = useState('');
  const { selectedGroup, colorGroups } = useColorStore();
  const { generateCode, loading } = useAI();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!selectedGroup) {
      toast({
        title: 'Error',
        description: 'Please select a color group first',
        variant: 'error',
      });
      return;
    }

    const selectedColors = colorGroups
      .find(group => group.id === selectedGroup)
      ?.colors.map(color => color.hex) || [];

    try {
      const generatedCode = await generateCode(projectType, selectedColors, description, []);
      toast({
        title: 'Success',
        description: 'Code generated successfully!',
        variant: 'success',
      });
      // Optionally save to state or database
      console.log(generatedCode);
    } catch (error: unknown) {
      let message = 'An error occurred while generating code.';
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        title: 'Error',
        description: message,
        variant: 'error',
      });
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Generate Code</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="projectType" className="block text-sm font-medium">Project Type</label>
          <select
            id="projectType"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value as typeof projectType)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="webpage">Webpage</option>
            <option value="mobile">Mobile</option>
            <option value="branding">Branding</option>
          </select>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Describe your project..."
          />
        </div>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Code'}
        </Button>
      </div>
    </div>
  );
};