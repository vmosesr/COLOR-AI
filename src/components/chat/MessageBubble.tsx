import React from 'react';
import type { Message } from '../../types/chat';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <div
      className={`mb-4 p-3 rounded-lg max-w-[80%] ${
        message.type === 'user' ? 'ml-auto bg-blue-500 text-white' : 'mr-auto bg-gray-100'
      }`}
    >
      <p>{message.content}</p>
      <span className="text-xs opacity-70">
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
};