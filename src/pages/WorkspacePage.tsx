import React from 'react';
import { useAppStore } from '../store/appStore';
import { SummaryPanel } from '../components/summary/SummaryPanel';
import { ChatPanel } from '../components/chat/ChatPanel';
import { PDFPreview } from '../components/workspace/PDFPreview';
import { SynthesisPanel } from '../components/synthesis/SynthesisPanel';
import { FileText, Brain, LayoutDashboard, Settings, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WorkspacePage: React.FC = () => {
  const { activeTab, setActiveTab, uploadedFiles, documents, reset, sessionDbId, user } = useAppStore();
  const [mobileView, setMobileView] = React.useState<'preview' | 'summary' | 'chat'>('summary');
  const totalSize = uploadedFiles.reduce((acc, f) => acc + f.size, 0);
  const fileSizeKb = (totalSize / 1024).toFixed(1);

  return (
    <div className="h-[calc(100vh-48px)] md:h-[calc(100vh-56px)] flex flex-col bg-[#08080c] overflow-hidden relative">
      <div className="ambient opacity-20" />

      {/* Top command bar - Responsive */}
      <div className="flex-shrink-0 h-auto min-h-[44px] md:h-11 border-b border-white/[0.08] px-3 md:px-5 py-2 md:py-0 flex flex-wrap items-center justify-between gap-3 bg-white/[0.01] backdrop-blur-xl relative z-20">
        {/* File info */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-white/[0.03] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] md:text-[11px] font-medium text-white/90 truncate max-w-[120px] sm:max-w-[240px] tracking-tight">
              {uploadedFiles.length === 1 ? uploadedFiles[0]?.name : `${uploadedFiles.length} Research Papers`}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[8px] text-slate-600 font-medium tracking-widest uppercase">{fileSizeKb} KB</span>
              <div className="w-0.5 h-0.5 rounded-full bg-white/10" />
              <span className="text-emerald-500/80 text-[8px] font-bold tracking-widest uppercase">
                {uploadedFiles.length > 1 ? `${uploadedFiles.length} NODES ACTIVE` : 'NODE ACTIVE'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs - Main Navigation */}
        <div className="flex items-center bg-black/40 border border-white/[0.05] rounded-lg p-0.5 backdrop-blur-md order-3 sm:order-none w-full sm:w-auto">
          <TabBtn
            active={activeTab === 'summary'}
            onClick={() => setActiveTab('summary')}
            icon={<LayoutDashboard className="w-3 h-3" />}
            label="Workspace"
            className="flex-1 sm:flex-none"
          />
          <TabBtn
            active={activeTab === 'synthesis'}
            onClick={() => setActiveTab('synthesis')}
            icon={<Sparkles className="w-3 h-3 text-emerald-400" />}
            label="Synthesis"
            className="flex-1 sm:flex-none"
          />
          <TabBtn
            active={activeTab === 'chat'}
            onClick={() => setActiveTab('chat')}
            icon={<Brain className="w-3 h-3" />}
            label="Chat"
            className="flex-1 sm:flex-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
            onClick={reset} 
            className="px-2.5 py-1 text-[9px] md:text-[10px] font-medium text-slate-500 border border-white/[0.08] rounded-md hover:text-white hover:bg-white/[0.02] transition-all"
          >
            New Session
          </motion.button>
          <button className="p-1.5 text-slate-600 hover:text-slate-400 transition-colors">
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Guest Session Warn Strip */}
      {!user && (
        <div className="flex-shrink-0 bg-amber-500/5 border-b border-amber-500/10 px-5 py-1.5 flex items-center justify-between text-[9px] text-amber-200/60 font-medium relative z-20">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>You are using a Guest Session. Your chat history and document analysis will not be saved.</span>
          </div>
          <button
            onClick={() => useAppStore.getState().setIsModalOpen(true)}
            className="text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider text-[8px] transition-colors"
          >
            Sign in to persist session &rarr;
          </button>
        </div>
      )}

      {/* Sub-tabs for mobile Workspace view */}
      {activeTab === 'summary' && (
        <div className="lg:hidden flex-shrink-0 h-9 border-b border-white/[0.04] bg-black/20 flex items-center px-4 gap-4 overflow-x-auto scroll-none">
          {[
            { id: 'preview', label: 'Preview' },
            { id: 'summary', label: 'Analysis' },
            { id: 'chat', label: 'Interrogate' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMobileView(tab.id as any)}
              className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap
                ${mobileView === tab.id ? 'text-emerald-500' : 'text-slate-600'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

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
              className="h-full"
            >
              {/* Desktop Grid Layout */}
              <div className="hidden lg:grid h-full grid-cols-[1fr_1.3fr_0.9fr] gap-2">
                <PDFPreview />
                <SummaryPanel />
                <ChatPanel />
              </div>

              {/* Mobile/Tablet Tabbed Layout */}
              <div className="lg:hidden h-full">
                {mobileView === 'preview' && <PDFPreview />}
                {mobileView === 'summary' && <SummaryPanel />}
                {mobileView === 'chat' && <ChatPanel />}
              </div>
            </motion.div>
          ) : activeTab === 'synthesis' ? (
            <motion.div
              key="synthesis-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <SynthesisPanel />
            </motion.div>
          ) : (
            <motion.div
              key="chat-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full p-2"
            >
              <div className="h-full hidden lg:grid grid-cols-[1fr_1fr] gap-2">
                <PDFPreview />
                <ChatPanel />
              </div>
              <div className="lg:hidden h-full">
                 <ChatPanel />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status bar - Very minimal */}
      <div className="flex-shrink-0 h-6 border-t border-white/[0.05] px-5 flex items-center justify-between
                      text-[8px] font-medium uppercase tracking-[0.4em] text-slate-700 bg-black/40 relative z-20">
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">GROQ-Llama-3.1</span>
          <span className="opacity-40 tracking-widest">LATENCY: 124MS</span>
          <div className="w-px h-2.5 bg-white/5" />
          {sessionDbId ? (
            <span className="text-emerald-500 font-bold tracking-widest">● SESSION SAVED</span>
          ) : (
            <span className="text-amber-500/80 font-bold tracking-widest">● EPHEMERAL SESSION</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 bg-emerald-500/40 rounded-full animate-pulse" />
            <span className="opacity-60 font-bold hidden sm:inline">SECURE LINK</span>
          </div>
          <span className="opacity-20 italic">v1.0.4</span>
        </div>
      </div>

    </div>
  );
};

const TabBtn = ({
  active, onClick, icon, label, className = ''
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; className?: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-1.5 px-3 md:px-4 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all duration-200 ${className}
      ${active
        ? 'bg-white/[0.05] text-white border border-white/[0.08]'
        : 'text-slate-600 hover:text-slate-400'
      }`}
  >
    {icon}
    <span className="hidden xs:inline">{label}</span>
  </button>
);
