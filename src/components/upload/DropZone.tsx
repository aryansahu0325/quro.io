import React, { useState, useCallback } from 'react';
import { Upload, CheckCircle2, Loader2, FileText } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import type { Summary } from '../../store/appStore';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

type UploadedDocument = {
  filename: string;
  file_size: number;
  summary: Partial<Summary>;
  session_db_id?: string | number;
};

export const DropZone: React.FC = () => {
  const {
    setUploadedFiles,
    setIsProcessing,
    setDocuments,
    setSessionId,
    sessionId,
    user,
    guestUploadCount,
    incrementGuestUpload,
    setIsModalOpen,
    token,
    pendingFiles,
    setPendingFiles
  } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onUpload = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    if (!user) {
      if (files.length > 1 || guestUploadCount >= 1) {
        setPendingFiles(files);
        setIsModalOpen(true);
        return;
      }
    }

    setFileNames(files.map(f => f.name));
    setIsUploading(true);
    setUploadedFiles(files);
    setIsProcessing(true);

    let sid = sessionId;
    if (!sid) {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_API.replace(/\/$/, '')}/api/auth/session`);
      sid = res.data.session_id;
      setSessionId(sid!);
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('session_id', sid!);

    try {
      const headers: Record<string, string> = {};
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
      
      setDocuments((response.data.documents as UploadedDocument[]).map((d) => ({
        filename: d.filename,
        file_size: d.file_size,
        summary: d.summary as Summary
      })));
      
      if (response.data.documents.length > 0 && response.data.documents[0].session_db_id) {
        useAppStore.getState().setSessionDbId(response.data.documents[0].session_db_id);
      }
      
      if (!user) {
        incrementGuestUpload();
      }
    } catch (err: unknown) {
      console.error('Upload failed:', err);
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setIsModalOpen(true);
      } else {
        alert('Upload failed. Please check the backend connection.');
      }
      setUploadedFiles([]);
      setFileNames([]);
    } finally {
      setIsProcessing(false);
      setIsUploading(false);
      setProgress(0);
    }
  }, [user, guestUploadCount, sessionId, token, setUploadedFiles, setIsProcessing, setSessionId, setPendingFiles, setIsModalOpen, setDocuments, incrementGuestUpload]);

  React.useEffect(() => {
    if (user && pendingFiles && pendingFiles.length > 0) {
      const filesToUpload = [...pendingFiles];
      setPendingFiles([]);
      onUpload(filesToUpload);
    }
  }, [user, pendingFiles, onUpload, setPendingFiles]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const validFiles: File[] = [];
    Array.from(e.dataTransfer.files).forEach((file: File) => {
      if (file.type === 'application/pdf' || file.type === 'text/plain') {
        validFiles.push(file);
      }
    });
    
    if (validFiles.length > 0) {
      onUpload(validFiles);
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
        multiple
        className="absolute w-px h-px opacity-0 overflow-hidden"
        accept=".pdf,.txt"
        onChange={(e) => e.target.files?.length && onUpload(Array.from(e.target.files))}
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
              <p className="text-xs font-medium text-white">
                {fileNames.length === 1 ? fileNames[0] : `Processing ${fileNames.length} papers...`}
              </p>
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
              {isDragging ? (
                 <FileText className="w-4 h-4 text-emerald-400" />
              ) : (
                 <Upload className="w-4 h-4 text-slate-500" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">Drop research papers here</p>
              <p className="text-xs text-slate-500">Upload multiple PDFs · Ek saath RAG</p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-500/70">
              <CheckCircle2 className="w-3 h-3" />
              Industry-grade multi-document analysis
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
