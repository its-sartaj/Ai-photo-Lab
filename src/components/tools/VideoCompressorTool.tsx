import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  formatDuration,
  getVideoMetadata,
  compressVideo,
  generateSampleVideo,
  VideoCompressionOptions,
} from '../../utils/videoEngine';
import { formatBytes, triggerDownload } from '../../utils/imageEngine';
import { VideoMetadata, ProcessedVideoResult } from '../../types';
import {
  Film,
  UploadCloud,
  Download,
  RefreshCw,
  Zap,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  XCircle,
  Sparkles,
  Info,
  Play,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VideoCompressorTool: React.FC = () => {
  const { language, t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [videoMeta, setVideoMeta] = useState<VideoMetadata | null>(null);
  const [originalVideoUrl, setOriginalVideoUrl] = useState<string | null>(null);

  // Settings
  const [preset, setPreset] = useState<'high' | 'balanced' | 'small'>('balanced');
  const [targetResolution, setTargetResolution] = useState<'original' | '720p' | '480p' | '360p'>('720p');
  const [includeAudio, setIncludeAudio] = useState<boolean>(true);

  // Drag and Drop State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isGeneratingSample, setIsGeneratingSample] = useState<boolean>(false);

  // Progress & Execution
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Result
  const [compressedResult, setCompressedResult] = useState<ProcessedVideoResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoFile = async (selectedFile: File) => {
    setErrorMsg(null);
    setCompressedResult(null);

    // Validate video type
    if (!selectedFile.type.startsWith('video/') && !selectedFile.name.match(/\.(mp4|webm|mov|mkv|m4v)$/i)) {
      setErrorMsg(
        language === 'hi'
          ? 'कृपया मान्य वीडियो फाइल चुनें (MP4, WebM, MOV)'
          : 'Please select a valid video file (MP4, WebM, or MOV).'
      );
      return;
    }

    // Safety warning for massive files (>300MB)
    if (selectedFile.size > 300 * 1024 * 1024) {
      setErrorMsg(
        language === 'hi'
          ? 'ब्राउज़र सुरक्षा के लिए 300MB से कम साइज का वीडियो चुनें ताकि मेमोरी क्रैश न हो।'
          : 'For browser stability, please choose a video under 300 MB to avoid browser memory limits.'
      );
      return;
    }

    try {
      const meta = await getVideoMetadata(selectedFile);
      setFile(selectedFile);
      setVideoMeta(meta);

      if (originalVideoUrl) {
        URL.revokeObjectURL(originalVideoUrl);
      }
      const url = URL.createObjectURL(selectedFile);
      setOriginalVideoUrl(url);

      // Auto-set resolution recommendation based on input
      if (meta.height >= 1080) {
        setTargetResolution('720p');
      } else if (meta.height >= 720) {
        setTargetResolution('720p');
      } else {
        setTargetResolution('original');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to read video file.');
    }
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
      handleVideoFile(e.dataTransfer.files[0]);
    }
  };

  const handleLoadSample = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsGeneratingSample(true);
      setErrorMsg(null);
      const sampleFile = await generateSampleVideo();
      await handleVideoFile(sampleFile);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not generate sample video.');
    } finally {
      setIsGeneratingSample(false);
    }
  };

  const handleStartCompression = async () => {
    if (!file) return;

    setErrorMsg(null);
    setIsCompressing(true);
    setProgressPercent(1);
    setStatusText(language === 'hi' ? 'कंप्रेशन इंजन तैयार हो रहा है...' : 'Initializing video encoder...');

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const options: VideoCompressionOptions = {
      preset,
      targetResolution,
      includeAudio,
      onProgress: (percent, text) => {
        setProgressPercent(percent);
        setStatusText(text);
      },
      abortSignal: abortController.signal,
    };

    try {
      const result = await compressVideo(file, options);
      setCompressedResult((prev) => {
        if (prev?.objectUrl) URL.revokeObjectURL(prev.objectUrl);
        return result;
      });
      setIsCompressing(false);
      setProgressPercent(100);

      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      } catch {}
    } catch (err: any) {
      if (err.message !== 'Video compression was cancelled.') {
        setErrorMsg(err.message || 'Video compression failed.');
      }
      setIsCompressing(false);
      setProgressPercent(0);
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsCompressing(false);
    setProgressPercent(0);
    setStatusText('');
  };

  const handleDownload = () => {
    if (!compressedResult || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'video';
    const filename = `${baseName}-compressed.${compressedResult.extension}`;
    triggerDownload(compressedResult.blob, filename);
  };

  const handleReset = () => {
    if (originalVideoUrl) URL.revokeObjectURL(originalVideoUrl);
    if (compressedResult?.objectUrl) URL.revokeObjectURL(compressedResult.objectUrl);
    setFile(null);
    setVideoMeta(null);
    setOriginalVideoUrl(null);
    setCompressedResult(null);
    setProgressPercent(0);
  };

  const originalUrlRef = useRef<string | null>(null);
  const compressedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    originalUrlRef.current = originalVideoUrl;
  }, [originalVideoUrl]);

  useEffect(() => {
    compressedUrlRef.current = compressedResult?.objectUrl || null;
  }, [compressedResult]);

  useEffect(() => {
    return () => {
      if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
      if (compressedUrlRef.current) URL.revokeObjectURL(compressedUrlRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-3">
          <Zap className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? '100% असली इन-ब्राउज़र वीडियो कंप्रेसर' : 'Real 100% In-Browser Video Compressor'}</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          {language === 'hi' ? 'वीडियो कंप्रेसर (Video Compressor)' : 'Video Compressor'}
        </h1>
        <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
          {language === 'hi'
            ? 'बिना सर्वर पर अपलोड किए सीधे अपने ब्राउज़र में MP4 और WebM वीडियो कंप्रेस करें। बिटरेट व रेजोल्यूशन कंट्रोल के साथ।'
            : 'Compress MP4 and WebM videos locally with resolution downscaling and bitrate controls. 100% private with zero server uploads.'}
        </p>
      </div>

      {!file ? (
        /* Video Upload DropZone */
        <div className="max-w-2xl mx-auto">
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
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all bg-white shadow-sm flex flex-col items-center justify-center group focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              isDragging
                ? 'border-purple-600 bg-purple-50/70 scale-[1.01]'
                : 'border-purple-200 hover:border-purple-400 hover:bg-purple-50/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/x-matroska,.mp4,.webm,.mov,.mkv"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleVideoFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-purple-100 to-indigo-100 text-purple-600 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-inner">
              <Film className="w-8 h-8 md:w-10 md:h-10" />
            </div>

            <h3 className="text-base md:text-lg font-bold text-slate-800">
              {isDragging
                ? language === 'hi' ? 'वीडियो फाइल यहाँ छोड़ें...' : 'Drop your video file here...'
                : language === 'hi' ? 'अपना वीडियो यहाँ खींचें (Drag & Drop), या' : 'Drag & drop your video file here, or'}
            </h3>

            <div className="mt-3 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md shadow-purple-200 transition-all">
                <UploadCloud className="w-4 h-4" />
                <span>{language === 'hi' ? 'डिवाइस से वीडियो चुनें' : 'Browse Video from Device'}</span>
              </span>
            </div>

            <p className="mt-4 text-xs text-slate-500 max-w-md">
              {language === 'hi'
                ? 'सपोर्टेड फॉर्मेट: MP4, WebM, QuickTime MOV • 100% क्लाइंट-साइड सुरक्षा'
                : 'Supports MP4, WebM, MOV • Recommended under 200MB • Zero server upload'}
            </p>

            {/* Quick Sample Video Generator Button */}
            <div className="mt-6 pt-4 border-t border-purple-100 w-full flex flex-col items-center">
              <button
                type="button"
                onClick={handleLoadSample}
                disabled={isGeneratingSample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-colors cursor-pointer"
              >
                {isGeneratingSample ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                )}
                <span>
                  {isGeneratingSample
                    ? language === 'hi' ? 'सैंपल वीडियो बन रहा है...' : 'Generating Sample...'
                    : language === 'hi' ? 'वीडियो नहीं है? सैंपल वीडियो से टेस्ट करें' : "Don't have a video? Try Sample Video"}
                </span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-800 text-xs md:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      ) : (
        /* Video Compressor Studio */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-purple-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Sliders className="w-4 h-4 text-purple-600" />
                <span>{language === 'hi' ? 'कंप्रेशन सेटिंग्स' : 'Video Compression Settings'}</span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                disabled={isCompressing}
                className="text-xs text-slate-500 hover:text-purple-600 flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.actions.reset}</span>
              </button>
            </div>

            {/* Original Video Info Card */}
            {videoMeta && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-800 truncate" title={videoMeta.filename}>
                  {videoMeta.filename}
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                  <div>
                    <span className="text-slate-400 block">{language === 'hi' ? 'साइज' : 'Size'}:</span>
                    <span className="font-semibold">{formatBytes(videoMeta.sizeBytes)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{language === 'hi' ? 'अवधि' : 'Duration'}:</span>
                    <span className="font-semibold">{formatDuration(videoMeta.durationSeconds)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{language === 'hi' ? 'माप' : 'Resolution'}:</span>
                    <span className="font-semibold">{videoMeta.width}×{videoMeta.height}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Compression Preset Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {language === 'hi' ? 'कंप्रेशन प्रीसेट चुनें' : 'Select Compression Preset'}
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'balanced',
                    name: language === 'hi' ? 'संतुलित (Balanced - सर्वोत्तम)' : 'Balanced (~1.2 Mbps, Recommended)',
                    desc: language === 'hi' ? 'साइज में 50-70% की कमी और बेहतरीन विजुअल क्वालिटी' : '50% to 70% size reduction with sharp details',
                  },
                  {
                    id: 'small',
                    name: language === 'hi' ? 'छोटा साइज (Small - WhatsApp/ईमेल)' : 'Small Size (~550 kbps, Max Compression)',
                    desc: language === 'hi' ? 'अधिकतम कंप्रेशन (70-85% बचत), सोशल शेयरिंग हेतु' : 'Maximum file shrink for quick messaging and emails',
                  },
                  {
                    id: 'high',
                    name: language === 'hi' ? 'उच्च गुणवत्ता (High Quality)' : 'High Quality (~2.5 Mbps)',
                    desc: language === 'hi' ? 'हल्का कंप्रेशन, उच्चतम क्लैरिटी सुरक्षित' : 'Mild compression with near-lossless clarity',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isCompressing}
                    onClick={() => setPreset(item.id as any)}
                    className={`w-full p-3 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer disabled:opacity-50 ${
                      preset === item.id
                        ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                    {preset === item.id && (
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Resolution */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {language === 'hi' ? 'आउटपुट रेजोल्यूशन (Resolution)' : 'Target Video Resolution'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'original', label: 'Original' },
                  { id: '720p', label: '720p HD' },
                  { id: '480p', label: '480p SD' },
                  { id: '360p', label: '360p' },
                ].map((res) => (
                  <button
                    key={res.id}
                    type="button"
                    disabled={isCompressing}
                    onClick={() => setTargetResolution(res.id as any)}
                    className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all cursor-pointer disabled:opacity-50 ${
                      targetResolution === res.id
                        ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {res.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Toggle */}
            <div className="pt-1">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {language === 'hi' ? 'ऑडियो ट्रैक विकल्प' : 'Audio Track Options'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isCompressing}
                  onClick={() => setIncludeAudio(true)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
                    includeAudio
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{language === 'hi' ? 'ऑडियो रखें' : 'Keep Audio'}</span>
                </button>
                <button
                  type="button"
                  disabled={isCompressing}
                  onClick={() => setIncludeAudio(false)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
                    !includeAudio
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <VolumeX className="w-4 h-4" />
                  <span>{language === 'hi' ? 'म्यूट / हटाएं' : 'Mute Video'}</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Progress Bar during Compression */}
            {isCompressing && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-purple-900">
                    {language === 'hi' ? 'वीडियो प्रोसेस हो रहा है...' : 'Compressing Video...'}
                  </span>
                  <span className="font-extrabold text-purple-700 text-sm">
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-purple-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-200"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="text-[11px] text-purple-700 truncate">
                  {statusText}
                </div>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="mt-2 w-full py-1.5 px-3 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>{language === 'hi' ? 'रद्द करें (Cancel)' : 'Cancel Compression'}</span>
                </button>
              </div>
            )}

            {/* Action Buttons */}
            {!isCompressing && !compressedResult && (
              <button
                type="button"
                onClick={handleStartCompression}
                className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Film className="w-5 h-5" />
                <span>{language === 'hi' ? 'वीडियो कंप्रेस करें' : 'Compress Video Now'}</span>
              </button>
            )}

            {/* Comparison Stats & Download */}
            {compressedResult && !isCompressing && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-100 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{t.stats.originalSize}:</span>
                    <span className="font-semibold text-slate-700 line-through">
                      {formatBytes(file.size)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 font-bold">{t.stats.newSize}:</span>
                    <span className="font-extrabold text-purple-700 text-sm">
                      {formatBytes(compressedResult.sizeBytes)}
                    </span>
                  </div>
                  {compressedResult.reductionPercent > 0 && (
                    <div className="flex justify-between items-center pt-1 border-t border-purple-200/60">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t.stats.saved}:
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        -{compressedResult.reductionPercent}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Honest warning if output is larger */}
                {compressedResult.isLargerThanOriginal && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      {language === 'hi'
                        ? 'यह वीडियो पहले से ही काफी कंप्रेस था, इसलिए नया साइज थोड़ा बड़ा हो गया। आप अपनी मूल फाइल ही सुरक्षित रखें।'
                        : 'The compressed output is slightly larger than the source video because the original was already heavily compressed. We recommend keeping your original file.'}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>{language === 'hi' ? 'तैयार वीडियो डाउनलोड करें' : 'Download Compressed Video'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Video Preview Column */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4">
              <span className="text-xs font-semibold text-slate-700">
                {compressedResult
                  ? language === 'hi' ? 'कंप्रेस किया गया वीडियो (परिणाम)' : 'Compressed Video Result'
                  : language === 'hi' ? 'मूल वीडियो पूर्वावलोकन' : 'Original Video Preview'}
              </span>
              {compressedResult && (
                <span className="text-xs font-bold text-purple-700">
                  {compressedResult.width} × {compressedResult.height} px • {formatBytes(compressedResult.sizeBytes)}
                </span>
              )}
            </div>

            <div className="w-full min-h-[320px] max-h-[500px] bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-slate-800">
              {compressedResult ? (
                <video
                  src={compressedResult.objectUrl}
                  controls
                  playsInline
                  className="max-h-[460px] max-w-full rounded-lg shadow-md"
                />
              ) : originalVideoUrl ? (
                <video
                  src={originalVideoUrl}
                  controls
                  playsInline
                  className="max-h-[460px] max-w-full rounded-lg shadow-md"
                />
              ) : (
                <div className="text-xs text-slate-500">No video selected</div>
              )}
            </div>

            <p className="mt-4 text-xs text-slate-500 text-center max-w-md">
              {language === 'hi'
                ? 'वीडियो प्रोसेसिंग 100% आपके ब्राउज़र के अंदर होती है। कोई वीडियो किसी सर्वर पर अपलोड नहीं होता।'
                : '100% in-browser Canvas & MediaRecorder encoding. Your video is never uploaded to any remote server.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
