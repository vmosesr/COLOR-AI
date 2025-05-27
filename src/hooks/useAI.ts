import { useState } from 'react';
import { OpenAIService } from '../services/ai/openai';
import type { Message } from '../types/chat';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (
    messages: Message[]
  ): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const formattedMessages = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      const response = await OpenAIService.generateChatResponse(formattedMessages);
      return response;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateCode = async (
    projectType: string,
    colors: string[],
    description: string,
    requirements: string[]
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      return await OpenAIService.generateCode(projectType, colors, description, requirements);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    generateCode,
    loading,
    error
  };
};