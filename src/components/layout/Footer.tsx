import React, { useState } from 'react';
import { Cpu } from 'lucide-react';
import { TermsModal, PrivacyModal, SecurityModal, StatusModal } from './FooterModals';

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | 'security' | 'status' | null>(null);

  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="w-full border-t border-white/[0.06] bg-[#08080c] mt-auto">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center">
                  <Cpu className="w-3.5 h-3.5 text-black" />
                </div>
                <span className="text-sm font-bold text-white tracking-tight">
                  quro<span className="text-emerald-500">.</span>io
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                The industry-standard platform for ultra-fast, secure, and infinitely scalable neural document intelligence.
              </p>
            </div>

            {/* Platform Column */}
            <div className="col-span-1">
              <h4 className="text-white text-[13px] font-semibold mb-4">Platform</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Vector Workspace</a></li>
                <li><a href="#" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">REST API Docs</a></li>
                <li><button onClick={() => setActiveModal('security')} className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Security Architecture</button></li>
                <li><a href="#" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Enterprise Pricing</a></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="col-span-1">
              <h4 className="text-white text-[13px] font-semibold mb-4">Legal & Compliance</h4>
              <ul className="space-y-3">
                <li><button onClick={() => setActiveModal('terms')} className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Terms of Service</button></li>
                <li><button onClick={() => setActiveModal('privacy')} className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Privacy Policy</button></li>
                <li><a href="#" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Cookie Preferences</a></li>
                <li><a href="#" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Help Center</a></li>
              </ul>
            </div>

            {/* System Column */}
            <div className="col-span-1">
              <h4 className="text-white text-[13px] font-semibold mb-4">System</h4>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => setActiveModal('status')} className="text-xs text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:animate-pulse"></span>
                    Live Status
                  </button>
                </li>
                <li><a href="#" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Developer Portal</a></li>
                <li><a href="https://github.com" target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">GitHub Repository</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-slate-600">
              &copy; {currentYear} Quro AI Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-[11px] text-slate-600 font-mono">
              <span>SYS.OK</span>
              <span>AES-256</span>
              <span>v4.0.0</span>
            </div>
          </div>
        </div>
      </footer>

      <TermsModal isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)} />
      <PrivacyModal isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)} />
      <SecurityModal isOpen={activeModal === 'security'} onClose={() => setActiveModal(null)} />
      <StatusModal isOpen={activeModal === 'status'} onClose={() => setActiveModal(null)} />
    </>
  );
};
