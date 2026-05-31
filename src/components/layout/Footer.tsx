import React from 'react';
import { Cpu } from 'lucide-react';
import { navigateToPath } from '../../utils/navigation';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleNavigate = (path: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigateToPath(path);
  };

  return (
    <footer className="w-full border-t border-white/[0.06] bg-[#08080c] mt-auto">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
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

          <div className="col-span-1">
            <h4 className="text-white text-[13px] font-semibold mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><a href="/" onClick={handleNavigate('/')} className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Vector Workspace</a></li>
              <li><a href="/docs" onClick={handleNavigate('/docs')} className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">REST API Docs</a></li>
              <li><a href="/security" onClick={handleNavigate('/security')} className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Security Architecture</a></li>
              <li><a href="/pricing" onClick={handleNavigate('/pricing')} className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Enterprise Pricing</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-white text-[13px] font-semibold mb-4">Legal & Compliance</h4>
            <ul className="space-y-3">
              <li><a href="/terms" onClick={handleNavigate('/terms')} className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" onClick={handleNavigate('/privacy')} className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
              <li><a href="/cookies" onClick={handleNavigate('/cookies')} className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Cookie Preferences</a></li>
              <li><a href="/help" onClick={handleNavigate('/help')} className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-white text-[13px] font-semibold mb-4">System</h4>
            <ul className="space-y-3">
              <li>
                <a href="/status" onClick={handleNavigate('/status')} className="text-xs text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:animate-pulse"></span>
                  Live Status
                </a>
              </li>
              <li><a href="/docs" onClick={handleNavigate('/docs')} className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Developer Portal</a></li>
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
  );
};
