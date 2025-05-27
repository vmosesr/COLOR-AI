import React, { useState } from 'react';
import { Button } from '../common/Button';

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type your message..."
          disabled={disabled}
        />
        <Button type="submit" disabled={disabled}>
          Send
        </Button>
      </div>
    </form>
  );
};