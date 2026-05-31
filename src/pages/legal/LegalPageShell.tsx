import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { navigateToPath } from '../../utils/navigation';

interface LegalPageShellProps {
  badge: string;
  title: string;
  subtitle: string;
  updatedLabel: string;
  summary: string;
  stats: Array<{ label: string; value: string }>;
  sections: Array<{ id: string; label: string }>;
  children: React.ReactNode;
}

export const LegalPageShell: React.FC<LegalPageShellProps> = ({
  badge,
  title,
  subtitle,
  updatedLabel,
  summary,
  stats,
  sections,
  children,
}) => {
  return (
    <div className="min-h-screen bg-[#08080c] text-white relative overflow-hidden pt-10 pb-20">
      <div className="glow-mesh opacity-80" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.06),transparent_26%),radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.05),transparent_22%)]" />

      <div className="max-w-6xl mx-auto px-5 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigateToPath('/')}
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to platform
            </button>

            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold uppercase tracking-[0.24em]">
              <ShieldCheck className="w-3.5 h-3.5" />
              {badge}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
            <aside className="lg:sticky lg:top-24 space-y-4">
              <div className="glass-card p-5 border-white/10 bg-[#0e0f15]/90">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Policy overview
                </div>
                <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
                  {title}
                </h1>
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  {subtitle}
                </p>
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Updated</p>
                  <p className="mt-1 text-sm text-slate-200 font-medium">{updatedLabel}</p>
                  <p className="mt-3 text-xs leading-6 text-slate-400">{summary}</p>
                </div>
              </div>

              <div className="panel p-5 space-y-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Quick facts</p>
                  <div className="mt-3 grid grid-cols-1 gap-3">
                    {stats.map((stat) => (
                      <div key={stat.label} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                        <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{stat.label}</div>
                        <div className="mt-1 text-sm text-white font-medium">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">On this page</p>
                  <div className="mt-3 space-y-2">
                    {sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="block rounded-xl border border-white/[0.05] px-3 py-2 text-sm text-slate-400 hover:text-white hover:border-emerald-500/20 hover:bg-white/[0.03] transition-colors"
                      >
                        {section.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <main className="space-y-6">
              {children}
            </main>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
