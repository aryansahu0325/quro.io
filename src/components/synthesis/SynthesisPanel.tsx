import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/appStore';
import { 
  Sparkles, BookOpen, AlertTriangle, Loader2, Activity, FileText, 
  CheckCircle2, GitMerge, PenTool, Download, Compass, RefreshCw, FileDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_BACKEND_API ?? 'http://localhost:8000/').replace(/\/$/, '');

interface SynthesisData {
  has_relationship: boolean;
  relationship_summary: string;
  shared_methodologies: string[];
  important_crust: string[];
  common_themes: string[];
  academic_domains: string[];
}

export const SynthesisPanel: React.FC = () => {
  const { sessionId, token } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Validation and Synthesis State
  const [isValidDomain, setIsValidDomain] = useState<boolean>(true);
  const [invalidPapers, setInvalidPapers] = useState<Array<{ filename: string; reason: string }>>([]);
  const [synthesis, setSynthesis] = useState<SynthesisData | null>(null);
  const [papersList, setPapersList] = useState<string[]>([]);
  
  // Co-Writer State
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState('');
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when generating
  useEffect(() => {
    if (bottomRef.current && isGenerating) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [generatedPaper, isGenerating]);

  // Loading animation stages
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingStage((prev) => (prev < 2 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  const loadSynthesis = async () => {
    if (!sessionId) return;
    setLoading(true);
    setLoadingStage(0);
    setError(null);
    setIsValidDomain(true);
    setInvalidPapers([]);
    setSynthesis(null);

    const formData = new FormData();
    formData.append('session_id', sessionId);

    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await axios.post(`${BASE_URL}/api/synthesis/analyze`, formData, { headers });
      
      const data = res.data;
      if (data.success) {
        setSynthesis(data.synthesis);
        setPapersList(data.papers || []);
      } else if (data.status === 'invalid_domain') {
        setIsValidDomain(false);
        setInvalidPapers(data.invalid_papers || []);
      } else {
        setError(data.message || 'Analysis failed');
      }
    } catch (err: any) {
      console.error('Synthesis analysis failed:', err);
      setError(err.response?.data?.detail || 'Failed to complete research synthesis. Please verify server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSynthesis();
  }, [sessionId]);

  const handleCoWrite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !sessionId || isGenerating) return;

    setIsGenerating(true);
    setGeneratedPaper('');

    try {
      const formData = new FormData();
      formData.append('session_id', sessionId);
      formData.append('topic', topic);

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/api/synthesis/co-write`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to start co-writer stream');
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
              break;
            }
            setGeneratedPaper((prev) => prev + content);
          }
        }
      }
    } catch (err: any) {
      console.error('Co-writing streaming failed:', err);
      setGeneratedPaper((prev) => prev + '\n\n⚠️ *Generation interrupted. Check your network or LLM server.*');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPaper = () => {
    if (!generatedPaper) return;
    const blob = new Blob([generatedPaper], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Quro_CoWritten_Paper_${topic.trim().replace(/\s+/g, '_').substring(0, 30)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadingStagesText = [
    'Vectorizing paper segments & scanning contents...',
    'Analyzing academic credentials & structural syntax...',
    'Performing cross-paper semantic mapping & thematic synthesis...'
  ];

  return (
    <div className="h-full flex flex-col bg-[#050508] overflow-hidden text-slate-300 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.03),transparent_50%)] pointer-events-none" />
      
      {/* 1. Loading Phase */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 z-20"
          >
            {/* Premium Orbital Loader */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/20 animate-[spin_30s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-indigo-500/10 animate-[spin_20s_linear_infinite_reverse]" />
              <div className="absolute inset-4 rounded-full border-t-2 border-r-2 border-emerald-500/80 animate-spin" />
              <div className="absolute w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center backdrop-blur-md border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Compass className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-2 max-w-md">
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase flex items-center justify-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                Synthesizing Workspace
              </h3>
              <p className="text-xs text-slate-500 font-mono italic animate-pulse h-8">
                {loadingStagesText[loadingStage]}
              </p>
            </div>
          </motion.div>
        )}

        {/* 2. Error State */}
        {!loading && error && (
          <motion.div 
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className="text-sm font-semibold text-white">Workspace Analysis Blocked</h3>
              <p className="text-xs text-slate-500">{error}</p>
            </div>
            <button 
              onClick={loadSynthesis}
              className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </motion.div>
        )}

        {/* 3. Domain Mismatch Warning */}
        {!loading && !isValidDomain && (
          <motion.div 
            key="domain-warning"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex items-center justify-center p-4 sm:p-8"
          >
            <div className="max-w-xl w-full glass-card border border-red-500/20 !bg-[#0f0a0d]/90 p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.05),transparent_40%)]" />
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black tracking-widest text-red-400 uppercase">Domain Mismatch Alert</span>
                  <h2 className="text-base font-bold text-white">Files Not Connected With Research Domain</h2>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    The Research Synthesis & Co-Writer Studio requires valid academic, scientific, or research documents (PDF/TXT) to proceed. Some uploaded materials do not match this profile.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-[10px] font-black tracking-wider text-slate-500 uppercase">Non-Compliant Items Detected:</h4>
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {invalidPapers.map((paper, i) => (
                    <div key={i} className="glass p-3 border-white/5 bg-white/[0.01] rounded-lg space-y-1 font-medium">
                      <div className="flex items-center gap-2 text-xs text-white">
                        <FileText className="w-3.5 h-3.5 text-red-400" />
                        <span className="truncate">{paper.filename}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed pl-5 font-mono">
                        Reason: {paper.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-500">
                <span>Please upload valid research papers in the main workspace.</span>
                <button
                  onClick={() => useAppStore.getState().reset()}
                  className="w-full sm:w-auto px-4 py-1.5 text-xs font-semibold bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors"
                >
                  Upload New Files
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. Valid Workspace - Synthesis & Co-Writer Dashboard */}
        {!loading && isValidDomain && synthesis && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-4 p-4 overflow-hidden h-full"
          >
            {/* LEFT COLUMN: Synthesis Dashboard */}
            <div className="flex flex-col space-y-4 overflow-y-auto pr-1 h-full">
              
              {/* Relationship summary & overlapping domains */}
              <div className="glass-card p-5 space-y-4 relative">
                <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <GitMerge className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">Semantic Connection</h3>
                    <p className="text-[9px] text-slate-500 font-mono">WORKSPACE SYNTHESIS REPORT</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium bg-white/[0.01] p-3 rounded-lg border border-white/[0.04]">
                  {synthesis.relationship_summary}
                </p>

                {/* Academic domains & Shared methodologies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <span className="text-[9px] font-black tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                      <Compass className="w-3 h-3 text-indigo-400" /> Academic Domains
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {synthesis.academic_domains.map((domain, i) => (
                        <span key={i} className="px-2 py-0.5 text-[9px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
                          {domain}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-black tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-emerald-400" /> Key Methodologies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {synthesis.shared_methodologies.map((method, i) => (
                        <span key={i} className="px-2 py-0.5 text-[9px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* IMPORTANT CRUST: Consolidated takeaways */}
              <div className="glass-card p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">Important Crust</h3>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded">
                    {synthesis.important_crust.length} CORE NODES
                  </span>
                </div>

                <div className="space-y-3">
                  {synthesis.important_crust.map((crustNode, i) => (
                    <div key={i} className="flex gap-3 group items-start">
                      <div className="w-5 h-5 rounded-md bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:border-emerald-500/30 transition-colors">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium pt-0.5">
                        {crustNode}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Co-Writer Studio */}
            <div className="glass-card p-4 sm:p-5 flex flex-col h-full overflow-hidden border border-emerald-500/10 relative">
              <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent top-0 pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <PenTool className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">Co-Writer Studio</h3>
                    <p className="text-[9px] text-slate-500">DRAFT CITATION-BACKED PAPERS</p>
                  </div>
                </div>

                {generatedPaper && (
                  <button 
                    onClick={downloadPaper}
                    className="p-1.5 text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-md transition-colors flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    Download (.MD)
                  </button>
                )}
              </div>

              {/* Form & Generation Block */}
              <div className="flex-1 flex flex-col overflow-hidden space-y-4 pt-4">
                
                {/* Prompt Topic form */}
                <form onSubmit={handleCoWrite} className="flex gap-2 flex-shrink-0 items-end">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      disabled={isGenerating}
                      placeholder="Mention the topic for your short research paper..."
                      className="w-full bg-black/40 border border-white/[0.08] hover:border-white/[0.14] focus:border-emerald-500/40 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-all pr-8"
                    />
                    <Sparkles className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-600" />
                  </div>
                  <button 
                    type="submit"
                    disabled={!topic.trim() || isGenerating}
                    className="px-4 py-2 bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 font-bold uppercase tracking-widest text-[9px] rounded-lg transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.1)] flex-shrink-0"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-black" />
                        Writing...
                      </>
                    ) : (
                      <>
                        <PenTool className="w-3.5 h-3.5 text-black" />
                        Co-Write
                      </>
                    )}
                  </button>
                </form>

                {/* Stream / Document Editor Output */}
                <div className="flex-1 bg-black/30 rounded-lg border border-white/[0.05] p-4 overflow-y-auto scroll-none relative">
                  {!generatedPaper && !isGenerating ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                      <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-slate-600">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400 font-semibold">Enter a topic to generate</p>
                        <p className="text-[10px] text-slate-600 max-w-xs mx-auto">
                          Quro will query vector chunks from the {papersList.length} uploaded papers, match contexts, and write a formatted short research paper with inline citations.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-300 space-y-4 font-medium leading-relaxed font-sans select-text whitespace-pre-wrap selection:bg-emerald-500/20 selection:text-white">
                      
                      {/* Paper content formatting helper */}
                      <div className="prose prose-invert prose-xs max-w-none">
                        {/* Custom visual parsing of standard sections */}
                        {generatedPaper.split('\n').map((line, idx) => {
                          const trimmed = line.trim();
                          
                          // Check for headings
                          if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                            const cleanText = trimmed.replace(/\*\*/g, '');
                            return (
                              <h3 key={idx} className="text-sm font-bold text-white pt-3 border-b border-white/[0.04] pb-1 uppercase tracking-wider font-mono flex items-center gap-2">
                                <span className="w-1.5 h-3 bg-emerald-500 rounded-sm" />
                                {cleanText}
                              </h3>
                            );
                          }
                          
                          if (trimmed.startsWith('# ')) {
                            return <h1 key={idx} className="text-lg font-black text-white pt-2 pb-1 font-mono tracking-tight">{trimmed.substring(2)}</h1>;
                          }
                          if (trimmed.startsWith('## ')) {
                            return <h2 key={idx} className="text-base font-bold text-white pt-3 pb-1 border-b border-white/[0.04] flex items-center gap-2"><span className="w-1 h-3 bg-emerald-400 rounded-sm" />{trimmed.substring(3)}</h2>;
                          }
                          if (trimmed.startsWith('### ')) {
                            return <h3 key={idx} className="text-sm font-bold text-white pt-2 pb-0.5">{trimmed.substring(4)}</h3>;
                          }
                          
                          // Check for list items
                          if (trimmed.startsWith('- ')) {
                            return (
                              <div key={idx} className="flex gap-2 pl-3">
                                <span className="text-emerald-500 font-bold font-mono text-[9px] pt-1">●</span>
                                <p className="flex-1 text-slate-300">{trimmed.substring(2)}</p>
                              </div>
                            );
                          }
                          
                          // Format citations [1] inside paragraphs
                          let formattedLine: React.ReactNode = line;
                          if (line.includes('[') && line.includes(']')) {
                            // Simple highlighting of inline citation badges
                            const parts = line.split(/(\[\d+\])/g);
                            formattedLine = parts.map((part, pIdx) => {
                              if (part.match(/^\[\d+\]$/)) {
                                return (
                                  <span key={pIdx} className="mx-0.5 px-1 py-0.5 text-[8px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono cursor-pointer" title="Workspace Citation">
                                    {part}
                                  </span>
                                );
                              }
                              return part;
                            });
                          }

                          return (
                            <p key={idx} className="text-slate-300 font-medium leading-relaxed">
                              {formattedLine}
                            </p>
                          );
                        })}
                      </div>

                      {isGenerating && (
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/80 font-mono italic animate-pulse pt-4">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Quro is processing references & writing stream...</span>
                        </div>
                      )}
                      <div ref={bottomRef} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
