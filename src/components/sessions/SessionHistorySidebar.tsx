import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, FileText, MessageCircle, Trash2, Clock, ChevronRight,
  History, Loader2, FolderOpen, Plus,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { fetchSession, deleteSession } from '../../services/api';
import type { PastSession } from '../../services/api';

function groupByDate(sessions: PastSession[]): Record<string, PastSession[]> {
  const now = new Date();
  const groups: Record<string, PastSession[]> = {};

  for (const s of sessions) {
    const d = new Date(s.created_at);
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    let label = 'Older';
    if (diffDays === 0) label = 'Today';
    else if (diffDays === 1) label = 'Yesterday';
    else if (diffDays < 7) label = 'This Week';
    else if (diffDays < 30) label = 'This Month';

    if (!groups[label]) groups[label] = [];
    groups[label].push(s);
  }
  return groups;
}

const DATE_ORDER = ['Today', 'Yesterday', 'This Week', 'This Month', 'Older'];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const SessionHistorySidebar: React.FC = () => {
  const {
    showSessionHistory, setShowSessionHistory,
    pastSessions, isLoadingSessions, removeSession,
    setSummary, setSessionId, setSessionDbId, addMessage,
    reset, setUploadedFile,
  } = useAppStore();

  const [loadingId, setLoadingId] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // ESC to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSessionHistory(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [setShowSessionHistory]);

  const handleRestore = async (session: PastSession) => {
    setLoadingId(session.id);
    try {
      const detail = await fetchSession(session.id);

      // Reset workspace then load the session data
      reset();

      // Restore session context
      setSessionId(detail.qdrant_session_id);
      setSessionDbId(detail.id);
      setSummary(detail.summary as any);

      // Create a dummy File reference (just for filename display)
      const dummyFile = new File([], detail.filename, { type: 'application/pdf' });
      setUploadedFile(dummyFile);

      // Restore chat messages
      for (const msg of detail.messages) {
        addMessage({
          id: msg.id,
          text: msg.content,
          sender: msg.role === 'user' ? 'user' : 'ai',
          timestamp: new Date(msg.created_at),
        });
      }

      setShowSessionHistory(false);
    } catch (e) {
      console.error('Failed to restore session:', e);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await deleteSession(id);
      removeSession(id);
    } catch (err) {
      console.error('Failed to delete session:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const grouped = groupByDate(pastSessions);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {showSessionHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSessionHistory(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {showSessionHistory && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-[#09090d] border-r border-white/[0.07] flex flex-col shadow-2xl"
          >
            {/* Top gradient accent */}
            <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-500/70" />
                <span className="text-sm font-semibold text-white">Session History</span>
              </div>
              <button
                onClick={() => setShowSessionHistory(false)}
                className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* New Upload CTA */}
            <div className="px-4 py-3 border-b border-white/[0.04]">
              <button
                onClick={() => { setShowSessionHistory(false); reset(); }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors text-[11px] font-medium text-emerald-400"
              >
                <Plus className="w-3.5 h-3.5" />
                New Analysis
              </button>
            </div>

            {/* Sessions list */}
            <div className="flex-1 overflow-y-auto">
              {isLoadingSessions ? (
                <div className="flex flex-col items-center justify-center h-40 gap-3">
                  <Loader2 className="w-5 h-5 text-emerald-500/50 animate-spin" />
                  <p className="text-[10px] text-slate-600">Loading sessions…</p>
                </div>
              ) : pastSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-56 gap-4 px-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-slate-700" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-500">No sessions yet</p>
                    <p className="text-[10px] text-slate-700 mt-1 leading-relaxed">
                      Upload a PDF to start your first analysis session
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 space-y-4">
                  {DATE_ORDER.filter((label) => grouped[label]?.length).map((label) => (
                    <div key={label}>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-700 px-2 mb-2">
                        {label}
                      </p>
                      <div className="space-y-1">
                        {grouped[label].map((session) => (
                          <motion.button
                            key={session.id}
                            onClick={() => handleRestore(session)}
                            disabled={!!loadingId}
                            whileHover={{ x: 2 }}
                            className="w-full text-left group flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-white/[0.08] hover:bg-white/[0.02] transition-all duration-150"
                          >
                            {/* File icon */}
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              {loadingId === session.id
                                ? <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                                : <FileText className="w-3.5 h-3.5 text-emerald-400/70" />
                              }
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-medium text-slate-300 truncate group-hover:text-white transition-colors">
                                {session.summary_title || session.filename}
                              </p>
                              <p className="text-[10px] text-slate-600 truncate mt-0.5">
                                {session.filename}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="flex items-center gap-1 text-[9px] text-slate-700">
                                  <Clock className="w-2.5 h-2.5" />
                                  {formatTime(session.created_at)}
                                </div>
                                <div className="w-0.5 h-0.5 rounded-full bg-slate-800" />
                                <div className="flex items-center gap-1 text-[9px] text-slate-700">
                                  <MessageCircle className="w-2.5 h-2.5" />
                                  {session.message_count} msgs
                                </div>
                                <div className="w-0.5 h-0.5 rounded-full bg-slate-800" />
                                <span className="text-[9px] text-slate-700">{formatBytes(session.file_size)}</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => handleDelete(e, session.id)}
                                disabled={deletingId === session.id}
                                className="p-1 rounded-md hover:bg-red-500/10 transition-colors"
                                title="Delete session"
                              >
                                {deletingId === session.id
                                  ? <Loader2 className="w-3 h-3 text-red-400 animate-spin" />
                                  : <Trash2 className="w-3 h-3 text-slate-600 hover:text-red-400 transition-colors" />
                                }
                              </button>
                              <ChevronRight className="w-3 h-3 text-slate-700" />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[9px] text-slate-700">{pastSessions.length} total sessions</span>
              <span className="text-[9px] text-emerald-500/40 font-semibold uppercase tracking-widest">Encrypted</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
