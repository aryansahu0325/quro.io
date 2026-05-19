import { useAppStore } from '../store/appStore';

const BASE_URL = (import.meta.env.VITE_BACKEND_API ?? 'http://localhost:8000/').replace(/\/$/, '');

export const useSSE = () => {
  const { sessionId, sessionDbId, token, addMessage, updateLastMessage } = useAppStore();

  const sendMessage = async (question: string) => {
    if (!sessionId) return;

    // Add user message
    addMessage({
      id: Date.now().toString(),
      text: question,
      sender: 'user',
      timestamp: new Date(),
    });

    // Add placeholder AI message for streaming
    addMessage({
      id: (Date.now() + 1).toString(),
      text: '',
      sender: 'ai',
      timestamp: new Date(),
      isStreaming: true,
    });

    try {
      const formData = new FormData();
      formData.append('question', question);
      formData.append('session_id', sessionId);
      if (sessionDbId) {
        formData.append('session_db_id', sessionDbId);
      }

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/api/assistant/ask`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to connect to assistant');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const content = line.replace('data: ', '');
            if (content === '[DONE]') {
              updateLastMessage('', false);
              break;
            }
            updateLastMessage(content, true);
          }
        }
      }
    } catch (error) {
      console.error('SSE Error:', error);
      updateLastMessage('⚠️ Connection lost. Please try again.', false);
    }
  };

  return { sendMessage };
};
