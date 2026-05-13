import { useAppStore } from '../store/appStore';

export const useSSE = () => {
  const { sessionId, addMessage, updateLastMessage } = useAppStore();

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
    const aiMessageId = (Date.now() + 1).toString();
    addMessage({
      id: aiMessageId,
      text: '',
      sender: 'ai',
      timestamp: new Date(),
      isStreaming: true,
    });

    try {
      const formData = new FormData();
      formData.append('question', question);
      formData.append('session_id', sessionId);

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API.replace(/\/$/, '')}/api/assistant/ask`, formData, {
        responseType: 'stream',
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const content = line.replace('data: ', '');
            if (content === '[DONE]') {
              updateLastMessage("", false); // Mark as done
              break;
            }
            accumulatedText += content;
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
