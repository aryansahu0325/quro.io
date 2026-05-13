import { create } from 'zustand';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isStreaming?: boolean;
}

interface Summary {
  title: string;
  english_summary: string;
  hindi_summary: string;
  mathematical_insights: string[];
  pictorial_concepts: string[];
  crust: string[];
}

interface AppState {
  sessionId: string | null;
  uploadedFile: File | null;
  isProcessing: boolean;
  summary: Summary | null;
  messages: Message[];
  activeTab: 'summary' | 'challenge';
  isModalOpen: boolean;
  
  // Actions
  setSessionId: (id: string) => void;
  setUploadedFile: (file: File | null) => void;
  setIsProcessing: (status: boolean) => void;
  setSummary: (summary: Summary | null) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (text: string, isStreaming?: boolean) => void;
  setActiveTab: (tab: 'summary' | 'challenge') => void;
  setIsModalOpen: (status: boolean) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  sessionId: null,
  uploadedFile: null,
  isProcessing: false,
  summary: null,
  messages: [],
  activeTab: 'summary',
  isModalOpen: false,
 
  setSessionId: (id) => set({ sessionId: id }),
  setUploadedFile: (file) => set({ uploadedFile: file }),
  setIsProcessing: (status) => set({ isProcessing: status }),
  setSummary: (summary) => set({ summary }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (text, isStreaming) => set((state) => {
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage && lastMessage.sender === 'ai') {
      const updatedMessages = [...state.messages];
      updatedMessages[updatedMessages.length - 1] = {
        ...lastMessage,
        text: lastMessage.isStreaming ? lastMessage.text + text : text,
        isStreaming: isStreaming ?? lastMessage.isStreaming
      };
      return { messages: updatedMessages };
    }
    return state;
  }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setIsModalOpen: (status) => set({ isModalOpen: status }),
  reset: () => set({
    uploadedFile: null,
    isProcessing: false,
    summary: null,
    messages: [],
    activeTab: 'summary'
  }),
}));
