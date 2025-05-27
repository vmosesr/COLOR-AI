import React, { useState } from 'react';
import { useAI } from '../../hooks/useAI';
import type { Message } from '../../types/chat';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { sendMessage, loading, error } = useAI();

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      const response = await sendMessage([...messages, newMessage]);
      const assistantMessage: Message = {
        id: `msg-${Date.now()}`,
        type: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
      {error && <div className="text-red-500 p-4">{error}</div>}
      <ChatInput onSend={handleSendMessage} disabled={loading} />
    </div>
  );
};