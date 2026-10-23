import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { DropZone } from '../DropZone';
import {
  formatBytes,
  loadImageFromFile,
  resizeImage,
  triggerDownload,
  EngineResult,
} from '../../utils/imageEngine';
import { Download, RefreshCw, Lock, Unlock, Zap, Maximize2, Sliders } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ResizerSeoContent } from './seo/ResizerSeoContent';

export const ResizerTool: React.FC = () => {
  const { t, language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [unit, setUnit] = useState<'px' | 'cm' | 'mm' | 'in'>('px');
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<EngineResult | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  useEffect(() => {
    resultUrlRef.current = result?.objectUrl || null;
  }, [result]);

  useEffect(() => {
    return () => {
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  const pxToUnit = (px: number, u: 'px' | 'cm' | 'mm' | 'in'): number => {
    if (u === 'px') return px;
    if (u === 'in') return Number((px / 300).toFixed(2));
    if (u === 'cm') return Number(((px / 300) * 2.54).toFixed(2));
    if (u === 'mm') return Number(((px / 300) * 25.4).toFixed(1));
    return px;
  };

  const unitToPx = (val: number, u: 'px' | 'cm' | 'mm' | 'in'): number => {
    if (u === 'px') return Math.round(val);
    if (u === 'in') return Math.round(val * 300);
    if (u === 'cm') return Math.round((val / 2.54) * 300);
    if (u === 'mm') return Math.round((val / 25.4) * 300);
    return Math.round(val);
  };

  const handleImageSelected = async (selectedFile: File) => {
    try {
      setIsProcessing(true);
      setFile(selectedFile);
      const img = await loadImageFromFile(selectedFile);
      setOriginalImage(img);
      setOriginalWidth(img.naturalWidth);
      setOriginalHeight(img.naturalHeight);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (lockAspect && originalWidth > 0) {
      const ratio = originalHeight / originalWidth;
      setHeight(Math.max(1, Math.round(newWidth * ratio)));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (lockAspect && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setWidth(Math.max(1, Math.round(newHeight * ratio)));
    }
  };

  const handleUnitWidthChange = (val: number) => {
    const newPx = Math.max(1, unitToPx(val, unit));
    handleWidthChange(newPx);
  };

  const handleUnitHeightChange = (val: number) => {
    const newPx = Math.max(1, unitToPx(val, unit));
    handleHeightChange(newPx);
  };

  const handleScalePreset = (percent: number) => {
    if (!originalWidth || !originalHeight) return;
    const factor = percent / 100;
    setWidth(Math.round(originalWidth * factor));
    setHeight(Math.round(originalHeight * factor));
  };

  // Re-render resized canvas
  useEffect(() => {
    if (!originalImage || width <= 0 || height <= 0) return;

    let isMounted = true;
    const executeResize = async () => {
      setIsProcessing(true);
      try {
        const res = await resizeImage(
          originalImage,
          width,
          height,
          format,
          quality / 100
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

    const debounce = setTimeout(executeResize, 120);
    return () => {
      isMounted = false;
      clearTimeout(debounce);
    };
  }, [originalImage, width, height, format, quality]);

  const handleDownload = () => {
    if (!result || !file) return;
    const ext = format === 'image/webp' ? 'webp' : format === 'image/png' ? 'png' : 'jpg';
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'photo';
    const newFilename = `${baseName}-${width}x${height}.${ext}`;

    triggerDownload(result.blob, newFilename);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch {}
  };

  // Calculated print inches at 300 DPI
  const printWidthInches = width > 0 ? (width / 300).toFixed(1) : '0';
  const printHeightInches = height > 0 ? (height / 300).toFixed(1) : '0';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-3">
          <Zap className="w-3.5 h-3.5" />
          <span>{t.badges.clientSide}</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t.tools.resize.name}
        </h1>
        <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
          {t.tools.resize.shortDesc}
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
                <span>{language === 'hi' ? 'रीसाइज सेटिंग्स' : 'Resize Settings'}</span>
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

            {/* Scale Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {t.toolLabels.scalePreset}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => handleScalePreset(pct)}
                    className="py-1.5 px-2 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-xs font-bold text-slate-700"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Unit Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {language === 'hi' ? 'माप इकाई (Measurement Unit)' : 'Measurement Unit'}
              </label>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl">
                {(['px', 'cm', 'mm', 'in'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`py-1 text-xs font-bold rounded-lg transition-all ${
                      unit === u
                        ? 'bg-white text-purple-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {u.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Width and Height Controls */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.toolLabels.width} ({unit})
                  </label>
                  <input
                    type="number"
                    step={unit === 'px' ? '1' : '0.01'}
                    min={unit === 'px' ? '10' : '0.1'}
                    max={unit === 'px' ? '10000' : '100'}
                    value={width ? pxToUnit(width, unit) : ''}
                    onChange={(e) => handleUnitWidthChange(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.toolLabels.height} ({unit})
                  </label>
                  <input
                    type="number"
                    step={unit === 'px' ? '1' : '0.01'}
                    min={unit === 'px' ? '10' : '0.1'}
                    max={unit === 'px' ? '10000' : '100'}
                    value={height ? pxToUnit(height, unit) : ''}
                    onChange={(e) => handleUnitHeightChange(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              {unit !== 'px' && (
                <div className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 flex items-center justify-between">
                  <span>{language === 'hi' ? 'समकक्ष पिक्सल (300 DPI):' : 'Equivalent Pixels @ 300 DPI:'}</span>
                  <span>{width} × {height} px</span>
                </div>
              )}

              {/* Aspect Ratio Lock Toggle */}
              <button
                type="button"
                onClick={() => setLockAspect(!lockAspect)}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  lockAspect
                    ? 'border-purple-300 bg-purple-50 text-purple-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {lockAspect ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-purple-600" />
                    <span>{t.toolLabels.lockAspect} ({language === 'hi' ? 'सक्रिय' : 'Locked'})</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{language === 'hi' ? 'अनुपात अनलॉक है' : 'Aspect Ratio Unlocked'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Format & Quality */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                {t.toolLabels.outputFormat}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['image/jpeg', 'image/png', 'image/webp'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      format === fmt
                        ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {fmt === 'image/jpeg' ? 'JPG' : fmt === 'image/png' ? 'PNG' : 'WebP'}
                  </button>
                ))}
              </div>

              {format !== 'image/png' && (
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-600">{t.toolLabels.quality}</span>
                    <span className="font-bold text-purple-700">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
              )}
            </div>

            {/* Print Dimensions Math info */}
            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800">
                {language === 'hi' ? 'प्रिंटिंग माप (300 DPI पर):' : 'Print Dimensions (@300 DPI):'}
              </div>
              <div>
                {printWidthInches} × {printHeightInches} {language === 'hi' ? 'इंच (Inches)' : 'inches'}
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
                {language === 'hi' ? 'रीसाइज़्ड फोटो' : 'Resized Preview'}{' '}
                {result && `(${formatBytes(result.sizeBytes)})`}
              </span>
              <span className="text-xs font-bold text-purple-700">
                {width} × {height} px
              </span>
            </div>

            <div className="w-full min-h-[320px] max-h-[500px] bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-2 checkerboard-bg border border-slate-200">
              {result ? (
                <img
                  src={result.objectUrl}
                  alt="Resized output"
                  className="max-h-[460px] max-w-full object-contain rounded-lg shadow-sm"
                />
              ) : (
                <div className="text-xs text-slate-400">{t.actions.processing}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Deep SEO & Technical Guide below tool */}
      <ResizerSeoContent />
    </div>
  );
};
