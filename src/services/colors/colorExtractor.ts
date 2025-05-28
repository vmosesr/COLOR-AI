
export interface ColorRGB {
  r: number;
  g: number;
  b: number;
  hex: string;
}

export type ColorGroup = {
  id: string;
  name: string;
  colors: ColorRGB[];
  format: string;
  dominance: number;
  harmony: string; 
};

const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const extractColorsFromImageElement = (imageElement: HTMLImageElement, numColors: number = 8): ColorRGB[] => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return [];
  
  const maxSize = 200;
  const scale = Math.min(maxSize / imageElement.width, maxSize / imageElement.height);
  canvas.width = imageElement.width * scale;
  canvas.height = imageElement.height * scale;
  
  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const colorMap = new Map<string, { count: number; r: number; g: number; b: number }>();
  
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const alpha = data[i + 3];
    
    if (alpha < 128) continue;
    
    const qR = Math.round(r / 32) * 32;
    const qG = Math.round(g / 32) * 32;
    const qB = Math.round(b / 32) * 32;
    
    const key = `${qR},${qG},${qB}`;
    
    if (colorMap.has(key)) {
      colorMap.get(key)!.count++;
    } else {
      colorMap.set(key, { count: 1, r: qR, g: qG, b: qB });
    }
  }
  
  return Array.from(colorMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, numColors)
    .map(color => ({
      r: color.r,
      g: color.g,
      b: color.b,
      hex: `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`
    }));
};

export class ColorExtractorService {
  static createColorGroups(colors: ColorRGB[]): ColorGroup[] {
    const harmonies = ['monochromatic', 'analogous', 'complementary', 'triadic'];
    
    return colors.map((color, idx) => ({
      id: generateId(),
      name: `Group ${idx + 1}`,
      colors: [color],
      format: 'rgbArray',
      dominance: Math.random(),
      harmony: harmonies[idx % harmonies.length],    
    }));
  }

  static async extractColorsFromImage(file: File): Promise<ColorGroup[]> {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.onload = () => {
          try {
            const colors = extractColorsFromImageElement(img, 8);
            const groups = this.createColorGroups(colors);
            resolve(groups);
          } catch (error) {
            reject(new Error(`Failed to extract colors: ${error}`));
          }
        };
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        img.src = URL.createObjectURL(file);
      } catch (error) {
        reject(new Error(`Failed to extract colors: ${error}`));
      }
    });
  }

  static async extractColorsFromImageMock(): Promise<ColorGroup[]> {
    try {
      const mockColors: ColorRGB[] = [
        { r: 255, g: 0, b: 0, hex: '#ff0000' },
        { r: 0, g: 255, b: 0, hex: '#00ff00' },
        { r: 0, g: 0, b: 255, hex: '#0000ff' },
        { r: 255, g: 255, b: 0, hex: '#ffff00' },
        { r: 255, g: 0, b: 255, hex: '#ff00ff' },
        { r: 0, g: 255, b: 255, hex: '#00ffff' },
        { r: 128, g: 128, b: 128, hex: '#808080' },
        { r: 0, g: 0, b: 0, hex: '#000000' },
      ];
      return this.createColorGroups(mockColors);
    } catch (error) {
      throw new Error(`Failed to extract colors: ${error}`);
    }
  }
}