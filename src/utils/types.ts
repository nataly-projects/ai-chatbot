export type ChatSessionType = {
  id: string;
  name: string;
  messages: { role: string; content: string }[];
  aiService: string;
  model: string;
};

export type MessageProps = {
  role: 'user' | 'ai';
  content: string;
};

export type ServiceToggleProps = {
  selectedService: string;
  setAiService: (service: string) => void;
  selectedModel: string;
  setModel: (model: string) => void;
};

export type ChatUIProps = {
  session: ChatSessionType | null;
  onMessagesUpdate: (messages: { role: string; content: string }[]) => void;
};

export const modelOptions: Record<string, string[]> = {
  OpenAI: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  Anthropic: ['claude-3-5-sonnet-20240620', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
};

