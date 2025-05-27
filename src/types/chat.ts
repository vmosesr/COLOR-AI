export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}