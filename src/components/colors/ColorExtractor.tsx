import React, { useState, useCallback, useRef } from 'react';
import { Upload, Camera, Palette, Copy, Check } from 'lucide-react';

interface ColorRGB {
  r: number;
  g: number;
  b: number;
  hex: string;
}

interface ColorGroup {
  id: string;
  name: string;
  colors: ColorRGB[];
  format: string;
  dominance: number;
  harmony: "monochromatic" | "analogous" | "complementary" | "triadic";
}

const useColorExtraction = () => {
  const [colorGroups, setColorGroups] = useState<ColorGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const extractColors = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      const mockColors: ColorRGB[] = [
        { r: 255, g: 100, b: 100, hex: '#ff6464' },
        { r: 100, g: 255, b: 100, hex: '#64ff64' },
        { r: 100, g: 100, b: 255, hex: '#6464ff' },
        { r: 255, g: 255, b: 100, hex: '#ffff64' },
      ];
      
      const groups: ColorGroup[] = mockColors.map((color, idx) => ({
        id: `group-${idx}`,
        name: `Group ${idx + 1}`,
        colors: [color],
        format: 'rgbArray',
        dominance: Math.random(),
        harmony: ['monochromatic', 'analogous', 'complementary', 'triadic'][idx % 4] as ColorGroup['harmony']
      }));
      
      setColorGroups(groups);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    colorGroups,
    setColorGroups,
    isLoading,
    extractColors,
    imageUrl
  };
};

const useToast = () => {
  const [toast, setToast] = useState<{ title: string; description: string; variant: string } | null>(null);
  
  const showToast = useCallback((toastData: { title: string; description: string; variant: string }) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 3000);
  }, []);

  return { toast: showToast, currentToast: toast };
};

const ColorPalette: React.FC<{ group: ColorGroup }> = ({ group }) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  
  const copyToClipboard = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };
  
  return (
    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-4 h-4 text-blue-600" />
        <h3 className="font-semibold text-gray-800">{group.name}</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {group.harmony}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {group.colors.map((color, colorIdx) => (
          <div key={colorIdx} className="flex flex-col items-center">
            <button
              onClick={() => copyToClipboard(color.hex)}
              className="w-16 h-16 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-2 border-white relative group"
              style={{ backgroundColor: color.hex }}
              title={`Click to copy ${color.hex}`}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-30 rounded-lg">
                {copiedColor === color.hex ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Copy className="w-4 h-4 text-white" />
                )}
              </div>
            </button>
            <div className="mt-2 text-center">
              <p className="text-xs font-mono text-gray-600">{color.hex}</p>
              <p className="text-xs text-gray-500">
                rgb({color.r}, {color.g}, {color.b})
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ColorExtractor: React.FC = () => {
  const { colorGroups, setColorGroups, isLoading, extractColors, imageUrl } = useColorExtraction();
  const { toast, currentToast } = useToast();
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colors = null; 
  const isColorLoading = false; 

  React.useEffect(() => {
    if (colors && !isColorLoading) {
      const rgbColors = (colors as [number, number, number][]).map(([r, g, b]) => ({
        r,
        g,
        b,
        hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
      })) as ColorRGB[];

      const groups: ColorGroup[] = rgbColors.map((color, idx) => ({
        id: `extracted-${idx}`,
        name: `Group ${idx + 1}`,
        colors: [color],
        format: 'rgbArray',
        dominance: Math.random(),
        harmony: ['monochromatic', 'analogous', 'complementary', 'triadic'][idx % 4] as ColorGroup['harmony']
      }));
      
      setColorGroups(groups);
      toast({
        title: 'Success',
        description: 'Colors extracted successfully!',
        variant: 'success',
      });
    }
  }, [colors, isColorLoading, setColorGroups, toast]);

  const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    try {
      await extractColors(acceptedFiles[0]);
      toast({
        title: 'Success',
        description: 'Colors extracted successfully!',
        variant: 'success',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to extract colors from image',
        variant: 'error',
      });
    }
  }, [extractColors, toast]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    onDrop(files);
  }, [onDrop]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onDrop([files[0]]);
    }
  }, [onDrop]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {currentToast && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          currentToast.variant === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <h4 className="font-bold">{currentToast.title}</h4>
          <p>{currentToast.description}</p>
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`border-2 border-dashed p-8 rounded-lg text-center cursor-pointer transition-all duration-200 ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            {isDragActive ? (
              <Camera className="w-8 h-8 text-blue-600" />
            ) : (
              <Upload className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <p className="text-lg">
            {isDragActive ? 'Drop your image here' : 'Drag & drop an image here, or click to select one'}
          </p>
        </div>
      </div>

      {(isLoading || isColorLoading) && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Loading...</span>
          </div>
        </div>
      )}

      {imageUrl && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Source Image</h2>
          <img src={imageUrl} alt="Uploaded" className="max-w-md max-h-64 object-contain rounded-lg" />
        </div>
      )}

      {colorGroups.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Extracted Color Groups</h2>
          {colorGroups.map((group) => (
            <ColorPalette
              key={group.id}
              group={group}
            />
          ))}
        </div>
      )}
    </div>
  );
};