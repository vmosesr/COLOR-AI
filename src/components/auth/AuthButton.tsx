import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';

export const AuthButton: React.FC = () => {
  const { user, signInWithGoogle, signInWithGitHub, signOut } = useAuth();

  return (
    <div className="flex space-x-4">
      {user ? (
        <Button onClick={signOut} variant="secondary">
          Sign Out
        </Button>
      ) : (
        <>
          <Button onClick={signInWithGoogle}>
            Sign in with Google
          </Button>
          <Button onClick={signInWithGitHub} variant="outline">
            Sign in with GitHub
          </Button>
        </>
      )}
    </div>
  );
};