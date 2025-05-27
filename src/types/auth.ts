import type { Message } from "./chat";
import type { ColorGroup } from "./colors";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: 'google' | 'github';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Project {
  id: string;
  name: string;
  type: 'webpage' | 'mobile' | 'branding';
  originalImage: string;
  colorGroups: ColorGroup[];
  selectedGroup: number;
  generatedCode: {
    css: string;
    html: string;
    js?: string;
  };
  chatHistory: Message[];
  createdAt: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  preferences: {
    defaultHarmony: 'monochromatic' | 'analogous' | 'complementary' | 'triadic';
    codeFormat: 'css' | 'scss' | 'less';
    notifications: boolean;
  };
}