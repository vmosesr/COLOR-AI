import { create } from 'zustand';
import type { User, AuthState } from '../types/auth';
import { auth } from '../services/auth/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { DatabaseService } from '../services/database/firebase';

interface AuthStore {
  authState: AuthState;
  setUser: (user: User | null) => void;
  initializeAuth: () => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authState: {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  },

  setUser: (user) =>
    set((state) => ({
      authState: {
        ...state.authState,
        user,
        isAuthenticated: !!user,
        isLoading: false,
      },
    })),

  initializeAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
          photoURL: firebaseUser.photoURL ?? undefined,
          provider: firebaseUser.providerData[0]?.providerId as 'google' | 'github',
          createdAt: new Date().toISOString(),
        };
        await DatabaseService.createUser(user);
        set({
          authState: {
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          },
        });
      } else {
        set({
          authState: {
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          },
        });
      }
    });
  },

  signOut: async () => {
    await auth.signOut();
    set({
      authState: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      },
    });
  },
}));