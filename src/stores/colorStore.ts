import { create } from 'zustand';
import type { ColorGroup } from '../services/colors/colorExtractor';

interface ColorState {
  colorGroups: ColorGroup[];
  selectedGroup: string | null;
  setColorGroups: (groups: ColorGroup[]) => void;
  setSelectedGroup: (groupId: string) => void;
}

export const useColorStore = create<ColorState>((set) => ({
  colorGroups: [],
  selectedGroup: null,
  setColorGroups: (groups) => set({ colorGroups: groups }),
  setSelectedGroup: (groupId) => set({ selectedGroup: groupId }),
}));