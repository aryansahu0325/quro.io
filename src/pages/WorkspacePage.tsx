import React from 'react';
import { useAppStore } from '../store/appStore';
import { SummaryPanel } from '../components/summary/SummaryPanel';
import { ChatPanel } from '../components/chat/ChatPanel';
import { ChallengePanel } from '../components/challenge/ChallengePanel';
import { PDFPreview } from '../components/workspace/PDFPreview';
import { FileText, Brain, LayoutDashboard, Settings, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WorkspacePage: React.FC = () => {
  const { activeTab, setActiveTab, uploadedFile, reset } = useAppStore();
  const fileSizeKb = uploadedFile ? (uploadedFile.size / 1024).toFixed(1) : '0';

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col bg-[#08080c] overflow-hidden relative">
      <div className="ambient opacity-20" />

      {/* Top command bar - Very compact */}
      <div className="flex-shrink-0 h-11 border-b border-white/[0.08] px-5 flex items-center justify-between bg-white/[0.01] backdrop-blur-xl relative z-20">
        {/* File info */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-white/90 truncate max-w-[240px] tracking-tight">{uploadedFile?.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-slate-600 font-medium tracking-widest uppercase">{fileSizeKb} KB</span>
              <div className="w-0.5 h-0.5 rounded-full bg-white/10" />
              <span className="text-emerald-500/80 text-[8px] font-bold tracking-widest uppercase">NODE ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Tabs - Smaller */}
        <div className="flex items-center bg-black/40 border border-white/[0.05] rounded-lg p-0.5 backdrop-blur-md">
          <TabBtn
            active={activeTab === 'summary'}
            onClick={() => setActiveTab('summary')}
            icon={<LayoutDashboard className="w-3 h-3" />}
            label="Workspace"
          />
          <TabBtn
            active={activeTab === 'challenge'}
            onClick={() => setActiveTab('challenge')}
            icon={<Brain className="w-3 h-3" />}
            label="Lab"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
            onClick={reset} 
            className="px-3 py-1 text-[10px] font-medium text-slate-500 border border-white/[0.08] rounded-md hover:text-white hover:bg-white/[0.02] transition-all"
          >
            New Session
          </motion.button>
          <button className="p-1.5 text-slate-600 hover:text-slate-400 transition-colors">
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden p-2 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'summary' ? (
            <motion.div
              key="workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full grid grid-cols-[1fr_1.3fr_0.9fr] gap-2"
            >
              <PDFPreview />
              <SummaryPanel />
              <ChatPanel />
            </motion.div>
          ) : (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full overflow-y-auto scroll p-6"
            >
              <div className="max-w-3xl mx-auto">
                <ChallengePanel />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status bar - Very minimal */}
      <div className="flex-shrink-0 h-6 border-t border-white/[0.05] px-5 flex items-center justify-between
                      text-[8px] font-medium uppercase tracking-[0.4em] text-slate-700 bg-black/40 relative z-20">
        <div className="flex items-center gap-4">
          <span>GROQ-Llama-3.1</span>
          <span className="opacity-40 tracking-widest">LATENCY: 124MS</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 bg-emerald-500/40 rounded-full animate-pulse" />
            <span className="opacity-60 font-bold">SECURE LINK</span>
          </div>
          <span className="opacity-20 italic">v1.0.4</span>
        </div>
      </div>

    </div>
  );
};

const TabBtn = ({
  active, onClick, icon, label
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-4 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all duration-200
      ${active
        ? 'bg-white/[0.05] text-white border border-white/[0.08]'
        : 'text-slate-600 hover:text-slate-400'
      }`}
  >
    {icon}
    {label}
  </button>
);
