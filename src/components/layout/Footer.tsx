import React from 'react';
import { Cpu, Github, Twitter, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.05] bg-[#08080c] relative overflow-hidden">
      {/* MASSIVE BACKGROUND TEXT */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <motion.h2 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 0.03, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-[22vw] font-black text-white tracking-tighter select-none leading-none translate-y-20 italic"
        >
          quro.io
        </motion.h2>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Cpu className="w-4 h-4 text-black" />
              </div>
              <span className="text-base font-bold text-white tracking-tighter">quro<span className="text-emerald-500">.</span>io</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Industrial-grade neural architecture for mission-critical research intelligence and semantic synthesis.
            </p>
            <div className="flex items-center gap-3">
              {[Github, Twitter, Mail].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center
                             text-slate-600 hover:text-emerald-500 hover:border-emerald-500/30 transition-all duration-300">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Protocol', links: ['Semantic Search', 'Vector Mapping', 'Neural Link', 'RAG Pipeline'] },
            { title: 'Infrastructure', links: ['Documentation', 'Grid Status', 'Latency API', 'Security'] },
            { title: 'Organization', links: ['About', 'Intelligence', 'Careers', 'Contact'] },
          ].map(({ title, links }) => (
            <div key={title} className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">{title}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-[11px] text-slate-500 hover:text-white transition-all duration-200 font-medium">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4
                        text-[9px] text-slate-700 font-black tracking-widest uppercase">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 animate-pulse" />
            <span>Grid Operational · US-EAST-01</span>
          </div>
          <span className="opacity-40">© 2026 Quro Neural Systems</span>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Legal'].map(l => (
              <a key={l} href="#" className="hover:text-slate-400 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
