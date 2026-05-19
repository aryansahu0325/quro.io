import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Shield, Globe, ArrowRight, Loader2, BookOpen, Zap, History, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { loginUser, registerUser } from '../../services/api';

interface AuthModalProps {
  onSuccessCallback?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccessCallback }) => {
  const {
    isModalOpen, setIsModalOpen, setToken, setUser,
    pendingFile, setPendingFile, loadPastSessions,
  } = useAppStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isModalOpen) {
      setEmail('');
      setPassword('');
      setError('');
      if (!useAppStore.getState().user) {
        setPendingFile(null);
      }
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = isLogin
        ? await loginUser(email, password)
        : await registerUser(email, password);

      setToken(data.access_token);
      setUser(data.user);
      setIsModalOpen(false);

      // Load past sessions for history sidebar
      await loadPastSessions();

      // Trigger any pending callback (e.g. retry a blocked upload)
      if (onSuccessCallback) {
        onSuccessCallback();
      }
      if (pendingFile) {
        setPendingFile(null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: History, text: 'Full session history saved forever' },
    { icon: BookOpen, text: 'Resume any past PDF discussion' },
    { icon: Zap, text: 'Unlimited document uploads' },
    { icon: Shield, text: 'End-to-end encrypted storage' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsModalOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal — wide split panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-2xl flex overflow-hidden rounded-2xl shadow-2xl border border-white/[0.08] bg-[#0c0d10]"
          style={{ boxShadow: '0 0 60px rgba(16,185,129,0.08), 0 25px 60px rgba(0,0,0,0.8)' }}
        >
          {/* Top accent */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

          {/* Left — Benefits panel */}
          <div className="hidden md:flex flex-col w-[45%] bg-gradient-to-br from-emerald-950/40 to-black/40 border-r border-white/[0.06] p-8 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-black" />
                </div>
                <span className="text-sm font-bold text-white tracking-tight">
                  quro<span className="text-emerald-500">.</span>io
                </span>
              </div>

              <h2 className="text-lg font-bold text-white leading-tight mb-2">
                Your research,<br />
                <span className="text-emerald-400">saved forever.</span>
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-8">
                Sign in to unlock unlimited PDF analysis and access your full conversation history from any device.
              </p>

              <div className="space-y-4">
                {benefits.map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 + 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <b.icon className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-[11px] text-slate-400">{b.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-700">
              <CheckCircle2 className="w-3 h-3 text-emerald-500/40" />
              Free forever · No credit card needed
            </div>
          </div>

          {/* Right — Form panel */}
          <div className="flex-1 p-6 md:p-8 flex flex-col">
            {/* Mobile logo */}
            <div className="flex md:hidden items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5 text-black" />
              </div>
              <span className="text-sm font-bold text-white">quro<span className="text-emerald-500">.</span>io</span>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white">
                  {isLogin ? 'Welcome back' : 'Create account'}
                </h3>
                {pendingFile && (
                  <p className="text-[10px] text-emerald-400/80 mt-1">
                    Sign in to continue uploading <span className="font-medium text-emerald-400">{pendingFile.name}</span>
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-600 uppercase tracking-widest">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="field w-full"
                    required
                    autoFocus
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-600 uppercase tracking-widest">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="field w-full"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-solid justify-center py-3 gap-2 text-xs"
              >
                {isLoading
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <>{isLogin ? 'Sign in' : 'Create account'} <ArrowRight className="w-3.5 h-3.5" /></>
                }
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="text-[10px] text-emerald-500/60 hover:text-emerald-400 transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up free" : 'Already have an account? Sign in'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 mt-auto border-t border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-[9px] text-slate-700">
                  <Shield className="w-3 h-3 text-emerald-500/40" />
                  AES-256 encrypted
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-slate-700">
                  <Globe className="w-3 h-3 text-emerald-500/40" />
                  Neural Core v4.0
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
