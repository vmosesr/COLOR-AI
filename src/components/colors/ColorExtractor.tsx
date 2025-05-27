import React from 'react';
import { useDropzone } from 'react-dropzone';
import useColorThief from 'color-thief-react';
import { useColorExtraction } from '../../hooks/useColorExtraction';
import { useToast } from '../../hooks/useToast';
import { ColorExtractorService } from '../../services/colors/colorExtractor';
import { ColorPalette } from './ColorPalette';
import type { ColorRGB } from '../../types/colors';

export const ColorExtractor: React.FC = () => {
  const { colorGroups, setColorGroups, isLoading, extractColors, imageUrl } = useColorExtraction();
  const { toast } = useToast();


const { data: colors, loading: isColorLoading } = useColorThief({
  src: imageUrl || '',
  format: 'rgbArray',
  children: null
});
  React.useEffect(() => {
    if (colors && !isColorLoading) {
      const rgbColors = colors.map(([r, g, b]: [number, number, number]) => ({
        r,
        g,
        b,
        hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
      })) as ColorRGB[];

      const groups = ColorExtractorService.createColorGroups(rgbColors);
      setColorGroups(groups);
      toast({
        title: 'Success',
        description: 'Colors extracted successfully!',
        variant: 'success',
      });
    }
  }, [colors, isColorLoading, setColorGroups, toast]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    try {
      await extractColors(acceptedFiles[0]);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to extract colors from image',
        variant: 'error',
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="p-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-8 rounded-lg text-center ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <p>Drag & drop an image here, or click to select one</p>
      </div>
      {(isLoading || isColorLoading) && <div>Loading...</div>}
      {colorGroups.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Extracted Color Groups</h2>
          {colorGroups.map((group) => (
            <ColorPalette
              key={group.id}
              group={{
                ...group,
                harmony: group.harmony as "monochromatic" | "analogous" | "complementary" | "triadic"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};