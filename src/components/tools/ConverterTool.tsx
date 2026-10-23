import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { DropZone } from '../DropZone';
import {
  formatBytes,
  loadImageFromFile,
  compressImage,
  triggerDownload,
  EngineResult,
} from '../../utils/imageEngine';
import { Download, RefreshCw, Zap, ArrowRight, Check, Sliders } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ConverterTool: React.FC = () => {
  const { t, language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [originalFormat, setOriginalFormat] = useState<string>('');
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');
  const [quality, setQuality] = useState<number>(85);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<EngineResult | null>(null);
  const resultUrlRef = React.useRef<string | null>(null);

  useEffect(() => {
    resultUrlRef.current = result?.objectUrl || null;
  }, [result]);

  useEffect(() => {
    return () => {
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  const handleImageSelected = async (selectedFile: File) => {
    try {
      setIsProcessing(true);
      setFile(selectedFile);
      const ext = selectedFile.name.split('.').pop()?.toUpperCase() || 'IMAGE';
      setOriginalFormat(ext);
      // Auto-set complementary target format
      if (ext === 'PNG') setTargetFormat('image/webp');
      else if (ext === 'WEBP') setTargetFormat('image/jpeg');
      else setTargetFormat('image/webp');

      const img = await loadImageFromFile(selectedFile);
      setOriginalImage(img);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!originalImage) return;

    let isMounted = true;
    const convert = async () => {
      setIsProcessing(true);
      try {
        const res = await compressImage(
          originalImage,
          quality / 100,
          targetFormat
        );
        if (isMounted) {
          setResult((prev) => {
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

    const debounce = setTimeout(convert, 120);
    return () => {
      isMounted = false;
      clearTimeout(debounce);
    };
  }, [originalImage, targetFormat, quality]);

  const handleDownload = () => {
    if (!result || !file) return;
    const ext = targetFormat === 'image/webp' ? 'webp' : targetFormat === 'image/png' ? 'png' : 'jpg';
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'converted-photo';
    const newFilename = `${baseName}.${ext}`;

    triggerDownload(result.blob, newFilename);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch {}
  };

  const getFormatName = (fmt: string) => {
    if (fmt === 'image/jpeg') return 'JPG / JPEG';
    if (fmt === 'image/png') return 'PNG';
    return 'WebP';
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-3">
          <Zap className="w-3.5 h-3.5" />
          <span>{t.badges.clientSide}</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t.tools.convert.name}
        </h1>
        <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
          {t.tools.convert.shortDesc}
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
                <span>{language === 'hi' ? 'कन्वर्जन विकल्प' : 'Conversion Options'}</span>
              </div>
              <button
                onClick={() => {
                  if (result?.objectUrl) URL.revokeObjectURL(result.objectUrl);
                  setFile(null);
                  setOriginalImage(null);
                  setResult(null);
                }}
                className="text-xs text-slate-500 hover:text-purple-600 flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.actions.reset}</span>
              </button>
            </div>

            {/* Current vs Target format banner */}
            <div className="p-3.5 rounded-xl bg-purple-50 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="px-2.5 py-1 bg-white rounded-lg border border-purple-200">
                {originalFormat}
              </span>
              <ArrowRight className="w-4 h-4 text-purple-600" />
              <span className="px-2.5 py-1 bg-purple-600 text-white rounded-lg shadow-sm">
                {getFormatName(targetFormat)}
              </span>
            </div>

            {/* Target format selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {t.toolLabels.outputFormat}
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'image/webp',
                    name: 'WebP (Recommended)',
                    desc: language === 'hi' ? 'आधुनिक वेब मानक, 30% छोटा साइज' : 'Next-gen web format, ~30% smaller',
                  },
                  {
                    id: 'image/jpeg',
                    name: 'JPG / JPEG',
                    desc: language === 'hi' ? 'सार्वभौमिक अनुकूलता व प्रिंटिंग' : 'Universal compatibility for print & portals',
                  },
                  {
                    id: 'image/png',
                    name: 'PNG',
                    desc: language === 'hi' ? 'पारदर्शिता (Transparency) व टेक्स्ट' : 'Lossless quality with alpha transparency',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTargetFormat(item.id as any)}
                    className={`w-full p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                      targetFormat === item.id
                        ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500">{item.desc}</div>
                    </div>
                    {targetFormat === item.id && (
                      <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Slider (for JPG & WebP) */}
            {targetFormat !== 'image/png' && (
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-700 font-semibold">{t.toolLabels.quality}</span>
                  <span className="font-bold text-purple-700">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            )}

            {/* File size info */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>{t.stats.originalSize}:</span>
                <span className="font-medium text-slate-700">{formatBytes(file.size)}</span>
              </div>
              <div className="flex justify-between text-slate-700 font-bold">
                <span>{t.stats.newSize}:</span>
                <span className="text-purple-700">
                  {result ? formatBytes(result.sizeBytes) : '...'}
                </span>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={!result || isProcessing}
              className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-purple-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>{t.actions.download}</span>
            </button>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4">
              <span className="text-xs font-semibold text-slate-700">
                {language === 'hi' ? 'रूपांतरित फोटो पूर्वावलोकन' : 'Converted Preview'}
              </span>
              <span className="text-xs font-bold text-purple-700">
                {result ? formatBytes(result.sizeBytes) : ''}
              </span>
            </div>

            <div className="w-full min-h-[320px] max-h-[500px] bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-2 checkerboard-bg border border-slate-200">
              {result ? (
                <img
                  src={result.objectUrl}
                  alt="Converted output"
                  className="max-h-[460px] max-w-full object-contain rounded-lg shadow-sm"
                />
              ) : (
                <div className="text-xs text-slate-400">{t.actions.processing}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
