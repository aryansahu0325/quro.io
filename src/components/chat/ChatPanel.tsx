import React, { useState, useRef, useEffect } from 'react';
import { Send, Command, Sparkles, UserCircle } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useSSE } from '../../hooks/useSSE';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatPanel: React.FC = () => {
  const { messages } = useAppStore();
  const { sendMessage } = useSSE();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const q = input;
    setInput('');
    await sendMessage(q);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="glass h-full flex flex-col overflow-hidden">
      {/* Header - Very small */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.01]">
        <div className="flex items-center gap-2">
          <Command className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500">Neural Link</span>
        </div>
        <span className="text-[8px] font-bold text-emerald-500/40 tracking-widest uppercase">Streaming</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll p-4 space-y-4 bg-black/10">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
              <Command className="w-6 h-6 text-slate-600 mb-2" />
              <p className="text-[9px] font-bold uppercase tracking-[0.4em]">Query Node</p>
            </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-2 max-w-[92%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border border-white/[0.05] bg-white/[0.02]`}>
                  {msg.sender === 'user'
                    ? <UserCircle className="w-3 h-3 text-slate-500" />
                    : <Sparkles className="w-3 h-3 text-emerald-500/40" />
                  }
                </div>

                <div className={`px-3 py-2 rounded-lg text-[10px] leading-relaxed font-medium
                  ${msg.sender === 'user'
                    ? 'bg-emerald-500/5 border border-emerald-500/10 text-emerald-100/80'
                    : 'bg-white/[0.02] border border-white/[0.05] text-slate-400'
                  }`}>
                  {msg.text}
                  {msg.isStreaming && (
                    <motion.span 
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="inline-block w-1 h-3 ml-1 bg-emerald-500/40 align-middle" 
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-3 border-t border-white/[0.05] bg-white/[0.01]">
        <div className="flex items-center gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Interrogate..."
            className="field flex-1 !py-2 !pl-3 !pr-10 !text-[10px] !bg-black/20 !border-white/[0.05] placeholder:text-slate-700"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-1.5 p-1.5 text-emerald-500/60 hover:text-emerald-400 disabled:opacity-10 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
