import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { Maximize2, ExternalLink, ShieldCheck, FileText } from 'lucide-react';

export const PDFPreview: React.FC = () => {
  const { uploadedFiles } = useAppStore();
  const [url, setUrl] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const file = uploadedFiles[activeIndex];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setUrl(null);
    }
  }, [uploadedFiles, activeIndex]);

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

      {/* Multi-file tabs */}
      {uploadedFiles.length > 1 && (
        <div className="flex-shrink-0 flex items-center gap-1 px-2 py-1.5 border-b border-white/[0.04] overflow-x-auto scroll-none bg-black/20">
          {uploadedFiles.map((f, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-medium whitespace-nowrap transition-all
                ${activeIndex === i
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-600 hover:text-slate-400 border border-transparent'
                }`}
            >
              <FileText className="w-2.5 h-2.5" />
              {f.name.length > 20 ? f.name.slice(0, 18) + '…' : f.name}
            </button>
          ))}
        </div>
      )}

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
        <span className="text-[9px] text-slate-700 uppercase tracking-widest">
          {uploadedFiles.length > 1 ? `${activeIndex + 1} / ${uploadedFiles.length} papers` : 'Sandboxed viewer'}
        </span>
      </div>
    </div>
  );
};
