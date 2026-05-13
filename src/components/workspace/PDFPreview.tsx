import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { Maximize2, ExternalLink, ShieldCheck } from 'lucide-react';

export const PDFPreview: React.FC = () => {
  const { uploadedFile } = useAppStore();
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (uploadedFile) {
      const objectUrl = URL.createObjectURL(uploadedFile);
      setUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [uploadedFile]);

  if (!url) return null;

  return (
    <div className="panel flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Preview</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button className="p-1 hover:bg-white/5 rounded-md transition-colors group">
            <Maximize2 className="w-3 h-3 text-slate-600 group-hover:text-slate-400" />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="p-1 hover:bg-white/5 rounded-md transition-colors group"
          >
            <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-slate-400" />
          </a>
        </div>
      </div>

      {/* PDF iframe */}
      <div className="flex-1 overflow-hidden bg-[#06060a]">
        <iframe
          src={`${url}#toolbar=0&navpanes=0`}
          className="w-full h-full border-none"
          style={{ filter: 'invert(0.88) hue-rotate(180deg) brightness(1.05) contrast(0.92)' }}
          title="PDF Preview"
        />
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 flex items-center justify-center gap-1.5 py-1.5 border-t border-white/[0.05]">
        <div className="dot-live" />
        <span className="text-[9px] text-slate-700 uppercase tracking-widest">Sandboxed viewer</span>
      </div>
    </div>
  );
};
