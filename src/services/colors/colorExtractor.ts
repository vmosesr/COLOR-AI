import type { ColorRGB } from '../../types/colors';
import { v4 as uuidv4 } from 'uuid';

export type ColorGroup = {
  id: string;
  name: string;
  colors: ColorRGB[];
  format: string;
  dominance: number;
  harmony: string; 
};

export class ColorExtractorService {
  static createColorGroups(colors: ColorRGB[]): ColorGroup[] {
    return colors.map((color, idx) => ({
      id: uuidv4(),
      name: `Group ${idx + 1}`,
      colors: [color],
      format: 'rgbArray',
      dominance: Math.random(),
      harmony: 'analogous',    
    }));
  }

  static async extractColorsFromImage(): Promise<ColorGroup[]> {
    try {
      const mockColors: ColorRGB[] = [
        { r: 255, g: 0, b: 0, hex: '#ff0000' },
        { r: 0, g: 255, b: 0, hex: '#00ff00' },
        { r: 0, g: 0, b: 255, hex: '#0000ff' },
        { r: 255, g: 255, b: 0, hex: '#ffff00' },
      ];
      return this.createColorGroups(mockColors);
    } catch (error) {
      throw new Error(`Failed to extract colors: ${error}`);
    }
  }
}
