import React from 'react';
import { AuthButton } from '../auth/AuthButton';

export const Header: React.FC = () => {
  return (
    <header className="border-b p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Color AI</h1>
      <AuthButton />
    </header>
  );
};