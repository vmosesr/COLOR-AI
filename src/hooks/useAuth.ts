import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { signInWithGoogle } from '../services/auth/googleAuth';
import { signInWithGitHub } from '../services/auth/githubAuth';
import type { User } from '../types/auth';

export const useAuth = () => {
  const { authState, setUser, initializeAuth, signOut } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const handleSignInWithGoogle = async (): Promise<User> => {
    const user = await signInWithGoogle();
    setUser(user);
    return user;
  };

  const handleSignInWithGitHub = async (): Promise<User> => {
    const user = await signInWithGitHub();
    setUser(user);
    return user;
  };

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    signInWithGoogle: handleSignInWithGoogle,
    signInWithGitHub: handleSignInWithGitHub,
    signOut,
  };
};