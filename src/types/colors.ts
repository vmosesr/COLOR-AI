export interface ColorRGB {
  r: number;
  g: number;
  b: number;
  hex: string;
}

export interface ColorGroup {
  id: string;
  colors: ColorRGB[];
  dominance: number;
  harmony: 'monochromatic' | 'analogous' | 'complementary' | 'triadic';
}