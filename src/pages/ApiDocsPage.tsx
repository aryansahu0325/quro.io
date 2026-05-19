import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Key, Zap, FileText } from 'lucide-react';

export const ApiDocsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#08080c] relative overflow-hidden text-white pt-12 pb-24">
      <div className="ambient opacity-20" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium uppercase tracking-widest">
            <Code2 className="w-4 h-4" /> Developers
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">Quro API Documentation</h1>
          <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
            Integrate high-fidelity research intelligence into your own applications. Our API allows developers to upload documents, generate research-perspective summaries, and query the resulting knowledge nodes.
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Authentication */}
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-4">
            <h2 className="text-xl font-medium flex items-center gap-2 border-b border-white/10 pb-2">
              <Key className="w-5 h-5 text-emerald-500" /> Authentication
            </h2>
            <p className="text-sm text-slate-400">
              Authenticate requests using your API key or Bearer token in the <code className="bg-white/5 px-1.5 py-0.5 rounded text-emerald-400">Authorization</code> header.
            </p>
            <div className="glass p-4 rounded-lg bg-black/40 border border-white/5 font-mono text-xs text-slate-300">
              Authorization: Bearer YOUR_API_KEY
            </div>
          </motion.section>

          {/* Upload Endpoint */}
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-4">
            <h2 className="text-xl font-medium flex items-center gap-2 border-b border-white/10 pb-2">
              <FileText className="w-5 h-5 text-emerald-500" /> Upload Document
            </h2>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-xs font-bold uppercase">POST</span>
              <code className="text-sm">/api/upload/</code>
            </div>
            <p className="text-sm text-slate-400">
              Upload a PDF or TXT document for immediate vectorization and summary generation from a research perspective.
            </p>
            
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Request Format (multipart/form-data)</h4>
              <div className="glass p-4 rounded-lg bg-black/40 border border-white/5 font-mono text-xs text-slate-300">
                <div className="flex"><span className="text-slate-500 w-24">file:</span><span className="text-emerald-400">(binary file, .pdf or .txt)</span></div>
                <div className="flex"><span className="text-slate-500 w-24">session_id:</span><span className="text-indigo-400">"uuid-string"</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Success Response (200 OK)</h4>
              <pre className="glass p-4 rounded-lg bg-black/40 border border-white/5 font-mono text-xs text-slate-300 overflow-x-auto">
{`{
  "status": "success",
  "document_id": "doc_12345",
  "summary": {
    "title": "Neural Networks in Medical Imaging",
    "english_summary": "...",
    "mathematical_insights": [...],
    "pictorial_concepts": [...],
    "crust": [...]
  }
}`}
              </pre>
            </div>
          </motion.section>

          {/* Rate Limits */}
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-4">
            <h2 className="text-xl font-medium flex items-center gap-2 border-b border-white/10 pb-2">
              <Zap className="w-5 h-5 text-emerald-500" /> Rate Limits & Quotas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass p-5 rounded-xl border border-white/5 bg-white/[0.02]">
                <h3 className="text-sm font-semibold mb-2 text-white">Unauthenticated Guests</h3>
                <ul className="text-xs text-slate-400 space-y-2">
                  <li>• 1 Upload per session</li>
                  <li>• Max 5MB file size</li>
                  <li>• Standard processing priority</li>
                </ul>
              </div>
              <div className="glass p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02]">
                <h3 className="text-sm font-semibold mb-2 text-emerald-400">Authenticated Users</h3>
                <ul className="text-xs text-slate-400 space-y-2">
                  <li>• Unlimited uploads</li>
                  <li>• Max 25MB file size</li>
                  <li>• High-priority inference queue</li>
                </ul>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};
