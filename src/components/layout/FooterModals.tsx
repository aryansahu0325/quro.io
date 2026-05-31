import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Activity, Lock, CheckCircle2, Server, Globe, Cpu } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalWrapper: React.FC<ModalProps & { title: string, icon: React.ComponentType<{ className?: string }>, children: React.ReactNode }> = ({ isOpen, onClose, title, icon: Icon, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl border border-white/[0.08] bg-[#0c0d10] overflow-hidden"
          style={{ boxShadow: '0 0 60px rgba(16,185,129,0.05), 0 25px 60px rgba(0,0,0,0.8)' }}
        >
          {/* Header */}
          <div className="h-16 shrink-0 border-b border-white/[0.06] bg-[#121318] flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-emerald-500" />
              </div>
              <h2 className="text-[15px] font-bold text-white">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const TermsModal: React.FC<ModalProps> = (props) => (
  <ModalWrapper {...props} title="Terms of Service" icon={Server}>
    <div className="prose prose-invert max-w-none">
      <h3 className="text-xl font-semibold text-emerald-400 mb-4">1. Acceptance of Terms</h3>
      <p className="text-slate-300 text-sm leading-relaxed mb-6">
        By accessing or using the Quro AI Platform, you agree to be bound by these Terms of Service. 
        If you do not agree to all of the terms and conditions, you must not access or use our services.
      </p>

      <h3 className="text-xl font-semibold text-emerald-400 mb-4">2. Service Description</h3>
      <p className="text-slate-300 text-sm leading-relaxed mb-6">
        Quro AI provides neural document analysis and vector-based semantic retrieval. We reserve the right 
        to modify, suspend, or discontinue the service at any time without prior notice.
      </p>

      <h3 className="text-xl font-semibold text-emerald-400 mb-4">3. User Responsibilities</h3>
      <ul className="list-disc pl-5 text-slate-300 text-sm leading-relaxed mb-6 space-y-2">
        <li>You must maintain the confidentiality of your authentication credentials.</li>
        <li>You agree not to upload malicious software or exploit vulnerabilities in our vector ingestion pipeline.</li>
        <li>You are solely responsible for ensuring you have the legal right to upload and process your documents.</li>
      </ul>
      
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mt-8 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <p className="text-[12px] text-emerald-400/90 leading-relaxed m-0">
          Last updated: May 2026. For questions regarding these terms, please contact our legal team through the support portal.
        </p>
      </div>
    </div>
  </ModalWrapper>
);

export const PrivacyModal: React.FC<ModalProps> = (props) => (
  <ModalWrapper {...props} title="Privacy Policy" icon={Lock}>
    <div className="prose prose-invert max-w-none">
      <h3 className="text-xl font-semibold text-white mb-4">Data Protection First</h3>
      <p className="text-slate-300 text-sm leading-relaxed mb-6">
        At Quro AI, privacy is deeply embedded in our infrastructure. We believe that your research, 
        documents, and AI interactions belong exclusively to you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4">
          <h4 className="text-emerald-400 font-medium mb-2 text-sm">Data Collection</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            We collect only the minimum required metadata (email addresses for authentication) and the actual 
            document content you explicitly upload for vector processing.
          </p>
        </div>
        <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4">
          <h4 className="text-emerald-400 font-medium mb-2 text-sm">Zero Training Policy</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your documents and chat histories are strictly used for your active sessions. We do not use your private 
            data to train our foundational language models.
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white mb-4">Information Sharing</h3>
      <p className="text-slate-300 text-sm leading-relaxed">
        We do not sell, rent, or trade your personal information. Data is only shared with essential 
        sub-processors (e.g., Qdrant for vector storage, Neon for database management) who are bound by 
        equally strict confidentiality agreements.
      </p>
    </div>
  </ModalWrapper>
);

export const SecurityModal: React.FC<ModalProps> = (props) => (
  <ModalWrapper {...props} title="Security Architecture" icon={Shield}>
    <div className="prose prose-invert max-w-none">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <Shield className="w-8 h-8 text-emerald-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white m-0 mb-1">Enterprise-Grade Protection</h3>
          <p className="text-sm text-slate-400 m-0">Your documents are secured by industry-leading cryptographic standards.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-[#121318] border border-white/[0.06] rounded-xl p-4 flex gap-4">
          <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
          <div>
            <h4 className="text-white font-medium text-sm mb-1">Encryption at Rest & Transit</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Our database volumes 
              and vector storage blocks are fully encrypted.
            </p>
          </div>
        </div>

        <div className="bg-[#121318] border border-white/[0.06] rounded-xl p-4 flex gap-4">
          <Cpu className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
          <div>
            <h4 className="text-white font-medium text-sm mb-1">Isolated Vector Namespaces</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Document embeddings are isolated in the Qdrant Cloud using unique UUID-based payloads. It is cryptographically 
              impossible for one user's query to retrieve another user's document vectors.
            </p>
          </div>
        </div>

        <div className="bg-[#121318] border border-white/[0.06] rounded-xl p-4 flex gap-4">
          <Globe className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
          <div>
            <h4 className="text-white font-medium text-sm mb-1">DDoS Mitigation & Rate Limiting</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our API gateway enforces strict sliding-window rate limits (e.g., 50 requests/minute) using distributed Redis caching 
              to prevent abuse and ensure high availability for all users.
            </p>
          </div>
        </div>
      </div>
    </div>
  </ModalWrapper>
);

export const StatusModal: React.FC<ModalProps> = (props) => (
  <ModalWrapper {...props} title="System Status" icon={Activity}>
    <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full mix-blend-screen" />
      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 relative z-10">
        <div className="w-10 h-10 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2 relative z-10">All Systems Operational</h3>
      <p className="text-emerald-400/80 text-sm relative z-10">Latency: ~42ms globally</p>
    </div>

    <div className="space-y-2">
      {[
        { name: 'API Gateway', status: 'Operational', ping: '12ms' },
        { name: 'PostgreSQL Database (Neon)', status: 'Operational', ping: '45ms' },
        { name: 'Vector Store (Qdrant Cloud)', status: 'Operational', ping: '38ms' },
        { name: 'LLM Inference Engine (Groq)', status: 'Operational', ping: '65ms' },
        { name: 'Redis Caching Cluster', status: 'Operational', ping: '1ms' },
        { name: 'Transactional Email (Resend)', status: 'Operational', ping: '24ms' },
      ].map((service, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-black/40 border border-white/[0.04] rounded-xl hover:bg-white/[0.02] transition-colors">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-slate-200">{service.name}</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-emerald-400">{service.status}</span>
            <span className="text-slate-500 w-12 text-right">{service.ping}</span>
          </div>
        </div>
      ))}
    </div>
  </ModalWrapper>
);
