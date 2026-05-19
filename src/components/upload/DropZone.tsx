import React, { useState } from 'react';
import { Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export const DropZone: React.FC = () => {
  const {
    setUploadedFile,
    setIsProcessing,
    setSummary,
    setSessionId,
    sessionId,
    user,
    guestUploadCount,
    incrementGuestUpload,
    setIsModalOpen,
    token,
    pendingFile,
    setPendingFile
  } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  React.useEffect(() => {
    if (user && pendingFile) {
      const fileToUpload = pendingFile;
      setPendingFile(null);
      onUpload(fileToUpload);
    }
  }, [user, pendingFile]);

  const onUpload = async (file: File) => {
    if (!user && guestUploadCount >= 1) {
      setPendingFile(file);
      setIsModalOpen(true);
      return;
    }

    setFileName(file.name);
    setIsUploading(true);
    setUploadedFile(file);
    setIsProcessing(true);

    let sid = sessionId;
    if (!sid) {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_API.replace(/\/$/, '')}/api/auth/session`);
      sid = res.data.session_id;
      setSessionId(sid!);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_id', sid!);

    try {
      const headers: any = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API.replace(/\/$/, '')}/api/upload/`,
        formData,
        {
          headers,
          onUploadProgress: (e) => {
            const pct = Math.round((e.loaded * 100) / (e.total || 1));
            setProgress(pct);
          },
        }
      );
      setSummary(response.data.summary);
      if (response.data.session_db_id) {
        useAppStore.getState().setSessionDbId(response.data.session_db_id);
      }
      if (!user) {
        incrementGuestUpload();
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      if (err.response?.status === 403) {
        setIsModalOpen(true);
      } else {
        alert('Upload failed. Please check the backend connection.');
      }
      setUploadedFile(null);
      setFileName(null);
    } finally {
      setIsProcessing(false);
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'text/plain')) {
      onUpload(file);
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !isUploading && document.getElementById('file-upload')?.click()}
      className={`
        relative border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-200
        ${isDragging
          ? 'border-emerald-500/60 bg-emerald-500/[0.04]'
          : 'border-white/[0.08] hover:border-white/[0.14] hover:bg-white/[0.02]'
        }
      `}
    >
      <input
        id="file-upload"
        type="file"
        className="absolute w-px h-px opacity-0 overflow-hidden"
        accept=".pdf,.txt"
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
      />

      <AnimatePresence mode="wait">
        {isUploading ? (
          <motion.div
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 text-center py-2"
          >
            <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-white">{fileName}</p>
              <p className="text-[11px] text-slate-500">Processing · {progress}%</p>
            </div>
            <div className="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 text-center py-2"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
              ${isDragging ? 'bg-emerald-500/20' : 'bg-white/[0.04]'}`}>
              <Upload className={`w-4 h-4 ${isDragging ? 'text-emerald-400' : 'text-slate-500'}`} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">Drop your research here</p>
              <p className="text-xs text-slate-500">PDF or TXT · up to 25 MB</p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-500/70">
              <CheckCircle2 className="w-3 h-3" />
              Industry-grade RAG processing
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
