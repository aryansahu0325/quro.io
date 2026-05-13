import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Layers, Database, Brain } from 'lucide-react';

const steps = [
  { icon: FileText,  title: 'Extract',   desc: 'OCR & text parsing',       num: '01' },
  { icon: Layers,    title: 'Chunk',     desc: 'Semantic partitioning',     num: '02' },
  { icon: Database,  title: 'Vectorize', desc: '1536-dim embeddings',       num: '03' },
  { icon: Brain,     title: 'Reason',    desc: 'Llama 3.1 inference',       num: '04' },
];

export const AnimatedPipeline: React.FC = () => {
  return (
    <section className="py-20 border-y border-white/[0.05] bg-white/[0.01]">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12 space-y-2">
          <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-medium">Infrastructure</span>
          <h2 className="text-2xl font-semibold text-white tracking-tight">The data pipeline</h2>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="absolute top-[22px] left-12 right-12 h-px bg-white/[0.05] hidden md:block overflow-hidden">
            <motion.div
              className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"
              animate={{ x: ['-100%', '600%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {steps.map(({ icon: Icon, title, desc, num }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
                className="panel-hover border-beam relative p-4 text-center space-y-3 group"
              >
                {/* Step badge */}
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full
                                flex items-center justify-center text-[9px] font-semibold text-black">
                  {num}
                </div>

                {/* Icon */}
                <div className="w-11 h-11 mx-auto rounded-xl bg-emerald-500/[0.07] border border-emerald-500/15
                                flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors">
                  <Icon className="w-4 h-4 text-emerald-400" />
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-white">{title}</h3>
                  <p className="text-[10px] text-slate-600 mt-0.5">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
