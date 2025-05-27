import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import type { User } from '../../types/auth';

export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    return {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName!,
      photoURL: user.photoURL ?? undefined,
      provider: 'google',
      createdAt: new Date().toISOString(),
    };
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const err = error as { code: string; message?: string };
      if (err.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider);
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          return {
            uid: user.uid,
            email: user.email!,
            displayName: user.displayName || user.email!.split('@')[0],
            photoURL: user.photoURL ?? undefined,
            provider: 'google',
            createdAt: new Date().toISOString(),
          };
        } else {
          throw new Error('Google sign-in failed: No redirect result.');
        }
      }
    }
    throw new Error(`Google sign-in failed: ${(error as { message?: string }).message}`);
  }
};