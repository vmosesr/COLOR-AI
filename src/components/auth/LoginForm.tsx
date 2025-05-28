import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { useToast } from '../../hooks/useToast';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithGoogle, signInWithGitHub } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast({
        title: 'Info',
        description: 'Please use Google or GitHub to sign in.',
        variant: 'info',
      });
    } catch (error: unknown) {
      let message = 'An unexpected error occurred.';
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        title: 'Error',
        description: message,
        variant: 'error',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter your email"
            disabled
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter your password"
            disabled
          />
        </div>
        <Button type="submit" disabled className="w-full">
          Sign In
        </Button>
      </form>
      <div className="mt-4 flex space-x-4">
        <Button onClick={signInWithGoogle}>Sign in with Google</Button>
        <Button onClick={signInWithGitHub} variant="outline">Sign in with GitHub</Button>
      </div>
    </div>
  );
};