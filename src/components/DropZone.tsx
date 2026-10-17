import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface DropZoneProps {
  onImageSelected: (file: File) => void;
  maxSizeBytes?: number; // default 25MB
}

export const DropZone: React.FC<DropZoneProps> = ({
  onImageSelected,
  maxSizeBytes = 25 * 1024 * 1024,
}) => {
  const { t, language } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcess = (file: File) => {
    setErrorMsg(null);

    // Validate MIME type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|gif|bmp)$/i)) {
      setErrorMsg(t.notifications.invalidFile);
      return;
    }

    // Validate file size
    if (file.size > maxSizeBytes) {
      setErrorMsg(t.notifications.fileTooLarge);
      return;
    }

    onImageSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcess(e.target.files[0]);
    }
  };

  // Clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            validateAndProcess(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all duration-200 flex flex-col items-center justify-center bg-white shadow-sm group focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
          isDragging
            ? 'border-purple-600 bg-purple-50/70 scale-[1.01]'
            : 'border-purple-200 hover:border-purple-400 hover:bg-purple-50/20 hover:shadow-md'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
          onChange={handleFileInput}
          className="hidden"
          aria-label="Upload photo"
        />

        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-purple-100 to-indigo-100 text-purple-600 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-inner">
          <UploadCloud className="w-8 h-8 md:w-10 md:h-10" />
        </div>

        <h3 className="text-base md:text-lg font-bold text-slate-800">
          {isDragging ? t.dropzone.dragActive : t.dropzone.dragPrompt}
        </h3>

        <div className="mt-3">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md shadow-purple-200 transition-all">
            <ImageIcon className="w-4 h-4" />
            {t.dropzone.browseButton}
          </span>
        </div>

        <p className="mt-4 text-xs text-slate-500 max-w-md">
          {t.dropzone.supportedFormats}
        </p>

        <p className="mt-1 text-[11px] text-purple-600 font-medium">
          {t.dropzone.pasteHint}
        </p>
      </div>

      {errorMsg && (
        <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-2.5 text-rose-800 text-xs md:text-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-xs text-rose-500 hover:text-rose-700 font-bold px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
