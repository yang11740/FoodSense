export type ChatSender = 'assistant' | 'user';

export interface ChatMessage {
  id: string;
  from: ChatSender;
  text: string;
  createdAt: string;
}
