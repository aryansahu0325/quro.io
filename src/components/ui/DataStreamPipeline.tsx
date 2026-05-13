import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Activity, Share2, Database, Brain } from 'lucide-react';

export const DataStreamPipeline: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-black/40">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[400px] bg-emerald-500/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-32 space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-emerald-500/30" />
            <span className="text-emerald-500 font-black text-[9px] uppercase tracking-[0.6em]">Infrastructure Layer</span>
            <div className="w-8 h-px bg-emerald-500/30" />
          </div>
          <h2 className="text-4xl font-medium text-white tracking-tighter">Neural Ingress Pipeline</h2>
          <p className="text-[10px] text-slate-600 max-w-sm mx-auto uppercase tracking-[0.2em] font-bold">Autonomous data-flow orchestration</p>
        </div>

        <div className="relative py-20">
          {/* THE PIPE STRUCTURE */}
          <div className="absolute top-1/2 left-0 w-full h-12 -translate-y-1/2 rounded-full overflow-hidden">
            {/* Glass Pipe Body */}
            <motion.div 
              animate={{ opacity: [0.02, 0.05, 0.02] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-white/[0.02] border-y border-white/[0.08] backdrop-blur-sm" 
            />
            
            {/* Pipe Highlights (Cylindrical effect) */}
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/[0.03] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/[0.03] to-transparent" />
            
            {/* Traveling Data Packets */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: '-20%' }}
                animate={{ x: '120%' }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  delay: i * 0.7,
                  ease: "linear"
                }}
                className="absolute inset-y-0 w-40 flex items-center justify-center pointer-events-none"
              >
                {/* The glowing packet */}
                <div className="w-full h-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent shadow-[0_0_20px_rgba(16,185,129,0.2)]" />
                <div className="absolute inset-y-2 w-px bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
              </motion.div>
            ))}
          </div>

          {/* HUB NODES (Processing Units) */}
          <div className="relative flex justify-between items-center h-40 px-12">
            {[
              { icon: Share2, label: 'INGRESS', color: 'emerald', detail: '1.2GB/s' },
              { icon: Database, label: 'VECTOR', color: 'teal', detail: '1536-D' },
              { icon: Cpu, label: 'INFER', color: 'indigo', detail: 'Llama-3.1' },
              { icon: Brain, label: 'SYNTH', color: 'emerald', detail: 'Grounded' },
            ].map((node) => (
              <div key={node.label} className="relative flex flex-col items-center">
                {/* Node Housing */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-24 h-24 glass !bg-[#0a0a0f] border-white/10 rounded-full flex items-center justify-center relative z-20 shadow-2xl group cursor-default"
                >
                  <div className="absolute inset-2 border border-dashed border-white/5 rounded-full animate-spin-slow" />
                  <node.icon className={`w-8 h-8 text-${node.color}-500/40 group-hover:text-${node.color}-400 transition-colors duration-500`} />
                  
                  {/* Internal Glow */}
                  <div className={`absolute inset-0 bg-${node.color}-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                </motion.div>

                {/* Node Metadata */}
                <div className="absolute -bottom-16 text-center space-y-1.5 whitespace-nowrap">
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">{node.label}</div>
                  <div className="glass px-3 py-1 border-white/5 bg-white/[0.01]">
                    <span className="text-[8px] font-bold text-white/40 mono">{node.detail}</span>
                  </div>
                </div>

                {/* Connection Ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/[0.03] rounded-full pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Live Grid Metrics */}
        <div className="mt-48 grid grid-cols-2 md:grid-cols-4 gap-4 px-12">
          {[
            { label: 'Network Uptime', val: '99.998%', icon: Activity },
            { label: 'Processing Load', val: '14.2%', icon: Zap },
            { label: 'Stream Nodes', val: '12,042', icon: Share2 },
            { label: 'Data Efficiency', val: '98.4%', icon: Database },
          ].map((stat) => (
            <motion.div 
              key={Math.random()}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="flex items-center gap-4 py-4"
            >
              <div className="w-px h-8 bg-emerald-500/20" />
              <div className="space-y-1">
                <div className="text-[8px] text-slate-600 font-black uppercase tracking-widest leading-none">{stat.label}</div>
                <div className="text-sm font-medium text-white/90 mono leading-none tracking-tighter">{stat.val}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
