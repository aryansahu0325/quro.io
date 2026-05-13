import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Shield, Globe, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export const AuthModal: React.FC = () => {
  const { isModalOpen, setIsModalOpen } = useAppStore();

  if (!isModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsModalOpen(false)}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-xs panel overflow-hidden shadow-2xl"
        >
          {/* Top accent line */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center">
                <Cpu className="w-3 h-3 text-black" />
              </div>
              <span className="text-xs font-semibold text-white">quro<span className="text-emerald-500">.</span>io</span>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-1 hover:bg-white/5 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-white">Sign in</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Connect to Quro to begin high-fidelity research analysis.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-600 uppercase tracking-widest pl-0.5">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="field"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-600 uppercase tracking-widest pl-0.5">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="field"
                />
              </div>
            </div>

            <button className="w-full btn-solid justify-center py-2.5 gap-2">
              Sign in <ArrowRight className="w-3 h-3" />
            </button>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                <Shield className="w-3 h-3 text-emerald-500/50" />
                AES-256 encrypted
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                <Globe className="w-3 h-3 text-emerald-500/50" />
                Neural Core v4.0
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
