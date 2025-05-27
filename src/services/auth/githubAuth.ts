import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, githubProvider } from './firebase';
import type { User } from '../../types/auth';

export const signInWithGitHub = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    
    return {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || user.email!.split('@')[0],
      photoURL: user.photoURL ?? undefined,
      provider: 'github',
      createdAt: new Date().toISOString(),
    };
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const err = error as { code: string; message?: string };
      if (err.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, githubProvider);
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          return {
            uid: user.uid,
            email: user.email!,
            displayName: user.displayName || user.email!.split('@')[0],
            photoURL: user.photoURL ?? undefined,
            provider: 'github',
            createdAt: new Date().toISOString(),
          };
        }
      }
      throw new Error(`GitHub sign-in failed: ${err.message ?? 'Unknown error'}`);
    }
    throw new Error('GitHub sign-in failed: Unknown error');
  }
};