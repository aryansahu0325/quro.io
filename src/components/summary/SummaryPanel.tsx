import React from 'react';
import { useAppStore } from '../../store/appStore';
import { Target, Zap, Binary, Image as ImageIcon, BookOpen, Share2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

export const SummaryPanel: React.FC = () => {
  const { summary, isProcessing } = useAppStore();

  // Mock data with proper Hindi and LaTeX for demonstration if summary is empty
  const demoSummary = summary || {
    crust: [
      "Quantum state vector optimization",
      "Neural weight distribution analysis",
      "Semantic resonance mapping"
    ],
    english_summary: "The research outlines a new framework for high-dimensional vector optimization using neural resonance protocols.",
    hindi_summary: "यह शोध न्यूरल रेजोनेंस प्रोटोकॉल का उपयोग करके उच्च-आयामी वेक्टर अनुकूलन के लिए एक नया ढांचा प्रस्तुत करता है।",
    mathematical_insights: [
      "E = mc^2",
      "\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}",
      "\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0}"
    ],
    pictorial_concepts: ["Neural Schematic v4"]
  };

  if (isProcessing) {
    return (
      <div className="glass h-full flex flex-col items-center justify-center gap-4 text-center p-8">
        <div className="relative">
          <Loader2 className="w-5 h-5 text-emerald-500/40 animate-spin" />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-white tracking-widest uppercase">Analyzing Node</p>
          <div className="flex gap-1 justify-center">
            {[1, 2, 3].map(i => (
              <motion.div 
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-1 h-1 rounded-full bg-emerald-500" 
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scroll space-y-2 pr-1">

      {/* Semantic Mapping */}
      <Section
        icon={<Share2 className="w-3.5 h-3.5 text-emerald-500/60" />}
        title="Semantic Mapping"
        badge="Live"
      >
        <div className="relative h-20 flex items-center justify-center bg-black/20 border border-white/[0.03] rounded-lg">
          <div className="flex gap-8 relative z-10">
            {[
              { label: 'Context', color: 'emerald' },
              { label: 'Method', color: 'indigo' },
              { label: 'Result', color: 'amber' },
            ].map(({ label, color }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full bg-${color}-500/40`} />
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Executive Gist */}
      <Section icon={<Zap className="w-3.5 h-3.5 text-emerald-500/60" />} title="Executive Gist">
        <ul className="space-y-1.5">
          {demoSummary.crust?.map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-2.5 text-[10px] text-slate-400 leading-normal font-medium">
              <div className="w-1 h-1 rounded-full bg-emerald-500/40 flex-shrink-0 mt-1.5" />
              {item}
            </li>
          ))}
        </ul>
      </Section>

      {/* Dual summaries */}
      <div className="grid grid-cols-2 gap-2">
        <Section icon={<BookOpen className="w-3.5 h-3.5 text-emerald-500/60" />} title="Thesis">
          <p className="text-[10px] text-slate-500 leading-normal font-medium">{demoSummary.english_summary}</p>
        </Section>
        <Section icon={<Target className="w-3.5 h-3.5 text-indigo-500/60" />} title="सारांश">
          <p className="text-[10px] text-emerald-500/60 leading-normal font-medium font-hindi tracking-wide">
            {demoSummary.hindi_summary}
          </p>
        </Section>
      </div>

      {/* Math & pictorial */}
      <div className="grid grid-cols-2 gap-2 pb-4">
        <Section icon={<Binary className="w-3.5 h-3.5 text-amber-500/60" />} title="Axioms">
          <div className="space-y-2">
            {demoSummary.mathematical_insights?.map((item: string, i: number) => (
              <div key={i} className="bg-black/20 p-2 rounded border border-white/[0.03] overflow-x-auto overflow-y-hidden scroll">
                <div className="text-amber-500/70 text-[10px]">
                  <InlineMath math={item} />
                </div>
              </div>
            ))}
          </div>
        </Section>
        <Section icon={<ImageIcon className="w-3.5 h-3.5 text-emerald-500/60" />} title="Schematics">
          <div className="space-y-2">
            <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group cursor-zoom-in">
              <img 
                src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000&auto=format&fit=crop" 
                alt="Neural Schematic"
                className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">v4.0_BLU_PRNT</span>
              </div>
            </div>
            <p className="text-[9px] text-slate-600 font-medium italic">Abstract resonance mapping v4.0</p>
          </div>
        </Section>
      </div>
    </div>
  );
};

const Section = ({
  icon, title, badge, children,
}: {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  children: React.ReactNode;
}) => (
  <div className="glass p-3 space-y-2.5">
    <div className="flex items-center justify-between border-b border-white/[0.03] pb-1.5">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">{title}</span>
      </div>
      {badge && (
        <span className="text-[8px] font-bold text-emerald-500/40 uppercase tracking-widest">{badge}</span>
      )}
    </div>
    {children}
  </div>
);
