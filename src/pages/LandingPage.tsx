import React, { useState, useEffect, useRef } from 'react';
import { Binary, Database, Shield, ArrowRight, Zap, Sparkles, MessageSquare, Search, Layers, Activity } from 'lucide-react';
import { DropZone } from '../components/upload/DropZone';
import { Footer } from '../components/layout/Footer';
import { DataStreamPipeline } from '../components/ui/DataStreamPipeline';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
});

const TerminalCard = ({ className, delay = 0, title = "Compiler.sys" }: { className?: string; delay?: number; title?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, rotate: 1 }}
    animate={{ 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      y: [0, -15, 0] 
    }}
    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16, 185, 129, 0.15)" }}
    transition={{ 
      delay, 
      duration: 1,
      y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
    }}
    className={`glass !bg-[#0e0e14]/90 border-white/10 p-0 overflow-hidden w-60 shadow-2xl backdrop-blur-3xl pointer-events-auto ${className}`}
  >
    <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/5 border-b border-white/[0.08]">
      <div className="w-1 h-1 rounded-full bg-red-500/30" />
      <div className="w-1 h-1 rounded-full bg-emerald-500/30" />
      <span className="ml-2 text-[7px] font-black text-slate-500 uppercase tracking-[0.3em]">{title}</span>
    </div>
    <div className="p-4 space-y-3 mono relative">
      <div className="absolute inset-x-0 h-px bg-emerald-500/10 top-0 pointer-events-none" style={{ animation: 'slide-right 4s linear infinite' }} />
      <div className="flex gap-2">
        <span className="text-emerald-500/40 text-[9px]">»</span>
        <span className="text-slate-500 text-[9px] truncate">processing_stream_chunk_04</span>
      </div>
      <div className="space-y-1.5">
        <div className="h-0.5 w-full bg-white/[0.02] rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "70%" }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            className="h-full bg-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]" 
          />
        </div>
        <div className="flex justify-between text-[7px] text-slate-600 font-bold tracking-widest uppercase">
          <span>Vectorizing</span>
          <span>99.2%</span>
        </div>
      </div>
      <div className="text-[7px] text-emerald-500/30 leading-none">
        0x4F2A // SYNC_SUCCESS
      </div>
    </div>
  </motion.div>
);

const MonitorCard = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
    animate={{ 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      y: [0, 15, 0] 
    }}
    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99, 102, 241, 0.15)" }}
    transition={{ 
      delay, 
      duration: 1,
      y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    }}
    className={`glass !bg-[#0e0e14]/90 border-white/10 p-0 overflow-hidden w-56 shadow-2xl backdrop-blur-3xl pointer-events-auto ${className}`}
  >
    <div className="flex items-center gap-1.5 px-3 py-2 bg-indigo-500/5 border-b border-white/[0.08]">
      <Activity className="w-2.5 h-2.5 text-indigo-500/40" />
      <span className="ml-1 text-[7px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural.Monitor</span>
    </div>
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-6 flex items-end gap-0.5">
          {[...Array(12)].map((_, i) => (
            <motion.div 
              key={i}
              animate={{ height: [4, Math.random() * 16 + 4, 4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
              className="flex-1 bg-indigo-500/20 rounded-t-sm"
            />
          ))}
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white mono leading-none font-bold">124ms</div>
          <div className="text-[6px] text-slate-600 uppercase font-black">Latency</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 border-t border-white/[0.03] pt-3">
        <div className="space-y-0.5">
          <div className="text-[7px] text-slate-600 uppercase font-black">Node-ID</div>
          <div className="text-[8px] text-indigo-400 mono">QX-904</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[7px] text-slate-600 uppercase font-black">Uptime</div>
          <div className="text-[8px] text-emerald-400 mono">99.9%</div>
        </div>
      </div>
    </div>
  </motion.div>
);

const SaturnRing = ({ className, size = "w-96", duration = 30, color = "emerald" }: { className?: string; size?: string; duration?: number; color?: string }) => (
  <div className={`relative pointer-events-none ${size} flex items-center justify-center ${className}`}>
    {/* Central Sphere */}
    <motion.div
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.5, 0.3]
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute w-12 h-12 rounded-full bg-${color}-500/20 blur-md shadow-[0_0_30px_rgba(16,185,129,0.3)]`}
    />
    <div className={`absolute w-4 h-4 rounded-full bg-${color}-400/40 blur-[2px]`} />

    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      className={`absolute inset-0 border border-${color}-500/10 rounded-[40%]`}
      style={{ rotateX: "75deg", rotateY: "15deg" }}
    />
    <motion.div 
      animate={{ rotate: -360 }}
      transition={{ duration: duration * 1.5, repeat: Infinity, ease: "linear" }}
      className={`absolute inset-4 border border-${color === 'emerald' ? 'indigo' : 'emerald'}-500/5 rounded-[45%]`}
      style={{ rotateX: "65deg", rotateY: "-10deg" }}
    />
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: duration * 0.8, repeat: Infinity, ease: "linear" }}
      className="absolute inset-8 border border-white/[0.02] rounded-[50%]"
      style={{ rotateX: "80deg", rotateY: "5deg" }}
    />
  </div>
);

export const LandingPage: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="bg-[#08080c] relative overflow-hidden group/main selection:bg-emerald-500/20">
      <div className="ambient" />
      
      {/* Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px z-30 transition duration-500 opacity-0 group-hover/main:opacity-100"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.04), transparent 40%)`,
        }}
      />

      {/* Hero Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Left Side Elements - Only on extra large screens */}
        <div className="hidden xl:block absolute left-[4%] top-[5%] space-y-12">
          <TerminalCard delay={0.2} title="Compiler.sys" />
          <div className="ml-8">
            <MonitorCard delay={0.5} />
          </div>
        </div>

        {/* Right Side Elements - Only on extra large screens */}
        <div className="hidden xl:block absolute right-[4%] top-[12%] space-y-12">
          <TerminalCard delay={0.3} title="Vector.Link" className="!w-56" />
          <div className="mr-8">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="glass !bg-[#0e0e14]/90 p-4 w-48 border-white/10 space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[7px] font-black uppercase tracking-widest text-slate-500">Live Stream</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-emerald-500/20" />
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Central Saturn Rings - Scaled for mobile */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -translate-y-32">
          <SaturnRing className="opacity-40 scale-50 md:scale-75 lg:scale-100" size="w-[1000px]" duration={60} />
          <SaturnRing className="opacity-20 scale-50 md:scale-75 lg:scale-100" size="w-[1200px]" duration={90} color="indigo" />
        </div>

        {/* Neural Network background particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0.05, 0.15, 0.05],
              y: [0, -40, 0]
            }}
            transition={{ duration: 10 + i, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-1 h-1 rounded-full bg-emerald-500/20"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%` 
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col items-center pt-8 md:pt-12 px-6 pb-16 text-center z-10">
        <div className="max-w-3xl mx-auto space-y-8 md:space-y-12">
          {/* Status chip */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <span className="glass px-3 py-1 flex items-center gap-2 border-emerald-500/10">
              <Sparkles className="w-3 h-3 text-emerald-500/60" />
              <span className="tracking-[0.2em] font-bold text-[9px] uppercase text-slate-500">Infrastructure v4.0 Active</span>
            </span>
          </motion.div>

          {/* Headline */}
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight leading-[1.1]"
            >
              Knowledge <br />
              <span className="grad italic relative inline-block">
                vectorized.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[11px] md:text-[13px] text-slate-500 max-w-lg mx-auto leading-relaxed font-medium"
            >
              High-fidelity semantic research intelligence. Transform unstructured 
              datasets into structured knowledge nodes with industrial precision.
            </motion.p>
          </div>

          {/* Upload Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative max-w-xl mx-auto w-full"
          >
            <div className="glass-card p-1 shadow-2xl shadow-emerald-500/5">
              <div className="glass border-dashed border-white/5 bg-[#0a0a0f]/40 p-6 md:p-12">
                <DropZone />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-20 hidden md:block">
          <div className="w-px h-12 bg-gradient-to-b from-emerald-500 to-transparent" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-white/[0.05] bg-white/[0.01] relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { label: 'Neural Nodes', value: '12,408', icon: Layers },
            { label: 'Avg Latency', value: '0.08ms', icon: Zap },
            { label: 'Knowledge Base', value: '84M+', icon: Database },
            { label: 'Uptime SLA', value: '99.99%', icon: Shield },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              {...fadeUp(i * 0.05)}
              className="flex items-center gap-4 group cursor-default"
            >
              <div className="w-9 h-9 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-slate-600 group-hover:text-emerald-500 transition-all">
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xl font-medium text-white mono">{stat.value}</div>
                <div className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12 md:mb-20 space-y-4 text-center md:text-left">
            <span className="text-emerald-500 font-bold text-[9px] uppercase tracking-[0.5em]">Capabilities</span>
            <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">Intelligence Stack.</h2>
            <p className="text-slate-500 max-w-sm mx-auto md:mx-0 text-[11px] leading-relaxed font-medium">
              Proprietary RAG protocols for mission-critical research and data synthesis.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: Binary, title: 'Semantic Mapping', desc: 'Identify relationships across billion-scale research nodes.' },
              { icon: Search, title: 'Grounded RAG', desc: 'Zero-hallucination responses through multi-stage retrieval.' },
              { icon: MessageSquare, title: 'Neural Workspace', desc: 'A high-performance environment for real-time synthesis.' },
            ].map((cap, i) => (
              <motion.div
                key={cap.title}
                {...fadeUp(i * 0.1)}
                className="glass p-6 md:p-8 space-y-6 cursor-default hover:bg-white/[0.02] transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center group-hover:border-emerald-500/20 transition-all">
                  <cap.icon className="w-4 h-4 text-emerald-500/50 group-hover:text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-white tracking-tight">{cap.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium group-hover:text-slate-400 transition-colors">
                    {cap.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500/30 group-hover:text-emerald-500 uppercase tracking-widest pt-2 transition-all">
                  Module info <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <DataStreamPipeline />
      <Footer />
    </div>
  );
};
