import React from 'react';
import { Cpu, RefreshCw, Lock } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const { uploadedFile, reset, setIsModalOpen } = useAppStore();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#08080c]/90 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto px-5 flex h-12 items-center justify-between">

        {/* Logo */}
        <motion.div
          onClick={reset}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center
                          group-hover:bg-emerald-400 transition-colors duration-200 flex-shrink-0">
            <Cpu className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">
            quro<span className="text-emerald-500">.</span>io
          </span>
          <span className="tag hidden sm:inline-flex">
            <span className="dot-live" />
            v4.0
          </span>
        </motion.div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6 text-[11px] font-medium text-slate-500">
          <a href="#" className="hover:text-slate-300 transition-colors">Docs</a>
          <a href="#" className="hover:text-slate-300 transition-colors">API</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Pricing</a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {uploadedFile && (
            <button onClick={reset} className="btn gap-1.5 hidden sm:inline-flex">
              <RefreshCw className="w-3 h-3" />
              New file
            </button>
          )}
          <div className="w-px h-4 bg-white/[0.08] hidden sm:block" />
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn"
          >
            <Lock className="w-3 h-3" />
            Sign in
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-solid"
          >
            Deploy
          </button>
        </div>

      </div>
    </nav>
  );
};
