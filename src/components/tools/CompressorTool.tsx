import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { DropZone } from '../DropZone';
import {
  formatBytes,
  loadImageFromFile,
  compressImage,
  triggerDownload,
  EngineResult,
} from '../../utils/imageEngine';
import { Download, RefreshCw, Zap, Sliders, CheckCircle2, ArrowRight, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CompressorSeoContent } from './seo/CompressorSeoContent';

export const CompressorTool: React.FC = () => {
  const { t, language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp'>('image/jpeg');
  const [maxDimension, setMaxDimension] = useState<number>(0); // 0 = original
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [compressedResult, setCompressedResult] = useState<EngineResult | null>(null);
  const [compareMode, setCompareMode] = useState<'preview' | 'split'>('preview');

  const handleImageSelected = async (selectedFile: File) => {
    try {
      setIsProcessing(true);
      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      const img = await loadImageFromFile(selectedFile);
      setOriginalImage(img);
      setMaxDimension(Math.max(img.naturalWidth, img.naturalHeight));
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Recompress whenever quality, format or maxDimension changes
  useEffect(() => {
    if (!originalImage || !file) return;

    let isMounted = true;
    const runCompression = async () => {
      setIsProcessing(true);
      try {
        const maxWidth = maxDimension > 0 ? maxDimension : undefined;
        const maxHeight = maxDimension > 0 ? maxDimension : undefined;
        const res = await compressImage(
          originalImage,
          quality / 100,
          format,
          maxWidth,
          maxHeight
        );
        if (isMounted) {
          setCompressedResult((prev) => {
            if (prev?.objectUrl) URL.revokeObjectURL(prev.objectUrl);
            return res;
          });
        } else {
          URL.revokeObjectURL(res.objectUrl);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsProcessing(false);
      }
    };

    const debounceTimer = setTimeout(runCompression, 120);
    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [originalImage, quality, format, maxDimension]);

  const handleDownload = () => {
    if (!compressedResult || !file) return;
    const ext = format === 'image/webp' ? 'webp' : 'jpg';
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'photo';
    const newFilename = `${baseName}-compressed-${quality}q.${ext}`;

    triggerDownload(compressedResult.blob, newFilename);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {}
  };

  const handleTargetPreset = (targetKb: number) => {
    if (!originalSize) return;
    const targetBytes = targetKb * 1024;
    // Estimate starting quality ratio
    const ratio = targetBytes / originalSize;
    if (ratio >= 0.9) {
      setQuality(85);
    } else if (ratio >= 0.5) {
      setQuality(70);
    } else if (ratio >= 0.25) {
      setQuality(50);
    } else {
      setQuality(30);
      // Also scale dimension down if target is very strict
      if (originalImage && Math.max(originalImage.naturalWidth, originalImage.naturalHeight) > 1200) {
        setMaxDimension(1000);
      }
    }
  };

  const percentSaved =
    originalSize > 0 && compressedResult
      ? Math.round(((originalSize - compressedResult.sizeBytes) / originalSize) * 100)
      : 0;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-3">
          <Zap className="w-3.5 h-3.5" />
          <span>{t.badges.clientSide}</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t.tools.compress.name}
        </h1>
        <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
          {t.tools.compress.shortDesc}
        </p>
      </div>

      {!file ? (
        <div className="max-w-2xl mx-auto">
          <DropZone onImageSelected={handleImageSelected} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-purple-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Sliders className="w-4 h-4 text-purple-600" />
                <span>{language === 'hi' ? 'कंप्रेशन सेटिंग्स' : 'Compression Settings'}</span>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setOriginalImage(null);
                  setCompressedResult(null);
                }}
                className="text-xs text-slate-500 hover:text-purple-600 flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.actions.reset}</span>
              </button>
            </div>

            {/* Quality Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-700">
                  {t.toolLabels.quality}
                </label>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  {quality}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="98"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-[11px] text-slate-600 mt-1">
                <span>{language === 'hi' ? 'छोटा साइज (कम)' : 'Smaller Size'}</span>
                <span>{language === 'hi' ? 'बेस्ट (75-85%)' : 'Sweet Spot (80%)'}</span>
                <span>{language === 'hi' ? 'हाई क्वालिटी' : 'High Quality'}</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-2">
                {t.toolLabels.qualityNotice}
              </p>
            </div>

            {/* Target Size Presets (UPSC/SSC/Web) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {language === 'hi' ? 'सरकारी फॉर्म व वेब प्रीसेट्स' : 'Quick Target Size Presets'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '< 50 KB', kb: 45, tag: 'Govt Form' },
                  { label: '< 100 KB', kb: 95, tag: 'Portal' },
                  { label: '< 200 KB', kb: 190, tag: 'Email' },
                  { label: '< 500 KB', kb: 480, tag: 'Web' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleTargetPreset(item.kb)}
                    className="p-2 text-center rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-xs font-medium text-slate-700"
                  >
                    <div className="font-bold text-slate-900">{item.label}</div>
                    <div className="text-[10px] text-slate-600">{item.tag}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Format Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {t.toolLabels.outputFormat}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('image/jpeg')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    format === 'image/jpeg'
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  JPG / JPEG
                  <span className="block text-[10px] font-normal text-slate-500">
                    {language === 'hi' ? 'सर्वश्रेष्ठ अनुकूलता' : 'Universal compatibility'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('image/webp')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    format === 'image/webp'
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  WebP
                  <span className="block text-[10px] font-normal text-slate-500">
                    {language === 'hi' ? '30% और छोटा साइज' : '30% smaller web standard'}
                  </span>
                </button>
              </div>
            </div>

            {/* Stats Comparison Card */}
            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">{t.stats.originalSize}:</span>
                <span className="font-semibold text-slate-700 line-through">
                  {formatBytes(originalSize)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-700 font-bold">{t.stats.newSize}:</span>
                <span className="font-extrabold text-purple-700 text-sm">
                  {compressedResult ? formatBytes(compressedResult.sizeBytes) : '...'}
                </span>
              </div>
              {percentSaved > 0 && (
                <div className="flex justify-between items-center text-xs pt-1 border-t border-purple-200/60">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t.stats.saved}:
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    -{percentSaved}%
                  </span>
                </div>
              )}
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={!compressedResult || isProcessing}
              className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-purple-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>{t.actions.download}</span>
            </button>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4">
              <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-purple-600" />
                <span>{language === 'hi' ? 'लाइव पूर्वावलोकन' : 'Live Preview'}</span>
                {isProcessing && (
                  <span className="text-[11px] text-purple-600 animate-pulse ml-2">
                    {t.actions.processing}
                  </span>
                )}
              </div>
              {compressedResult && (
                <span className="text-xs text-slate-500">
                  {compressedResult.width} × {compressedResult.height} px
                </span>
              )}
            </div>

            <div className="w-full min-h-[320px] max-h-[500px] bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-2 relative checkerboard-bg border border-slate-200">
              {compressedResult ? (
                <img
                  src={compressedResult.objectUrl}
                  alt="Compressed preview"
                  className="max-h-[460px] max-w-full object-contain rounded-lg shadow-sm"
                />
              ) : (
                <div className="text-xs text-slate-400">{t.actions.processing}</div>
              )}
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-slate-600">
                {language === 'hi'
                  ? 'यह फोटो आपके ब्राउज़र में ही प्रोसेस हुई है। कोई डेटा सर्वर पर नहीं भेजा गया।'
                  : 'Processed 100% inside your local browser memory with zero network upload.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Deep SEO Guide & Sarkari Exam Specifications below tool */}
      <CompressorSeoContent />
    </div>
  );
};
