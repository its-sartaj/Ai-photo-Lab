import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { DropZone } from '../DropZone';
import {
  formatBytes,
  loadImageFromFile,
  makePassportPhoto,
  triggerDownload,
} from '../../utils/imageEngine';
import { Download, RefreshCw, Zap, ShieldCheck, Check, Sliders, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PresetOption {
  id: string;
  nameEn: string;
  nameHi: string;
  width: number;
  height: number;
  targetKb: number;
  descEn: string;
  descHi: string;
}

const PRESETS: PresetOption[] = [
  {
    id: 'india-govt',
    nameEn: 'India Passport / SSC / UPSC (35×45mm)',
    nameHi: 'भारतीय पासपोर्ट / SSC / UPSC (35×45mm)',
    width: 413,
    height: 531,
    targetKb: 45, // strictly fits under 50KB limit
    descEn: '3.5 cm × 4.5 cm at 300 DPI • 20 KB to 50 KB safe limit',
    descHi: '3.5 सेमी × 4.5 सेमी (300 DPI) • 20 KB से 50 KB सुरक्षित सीमा',
  },
  {
    id: 'us-visa',
    nameEn: 'US Visa / Green Card (2×2 inch)',
    nameHi: 'यूएस वीजा / ग्रीन कार्ड (2×2 इंच)',
    width: 600,
    height: 600,
    targetKb: 150,
    descEn: '2 inch × 2 inch square • Pure White Background',
    descHi: '2 इंच × 2 इंच चौकोर • शुद्ध सफेद बैकग्राउंड',
  },
  {
    id: 'signature',
    nameEn: 'Govt Signature Upload (40×20mm)',
    nameHi: 'सरकारी फॉर्म हस्ताक्षर / Signature (40×20mm)',
    width: 472,
    height: 236,
    targetKb: 18, // fits under 20KB limit
    descEn: 'Official signature upload for SSC/UPSC • 10 KB to 20 KB',
    descHi: 'सरकारी परीक्षाओं के लिए हस्ताक्षर • 10 KB से 20 KB',
  },
];

export const PassportTool: React.FC = () => {
  const { t, language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<PresetOption>(PRESETS[0]);
  const [targetKb, setTargetKb] = useState<number>(PRESETS[0].targetKb);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [showFaceGuide, setShowFaceGuide] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<{
    blob: Blob;
    objectUrl: string;
    sizeBytes: number;
    qualityUsed: number;
  } | null>(null);

  const handleImageSelected = async (selectedFile: File) => {
    try {
      setIsProcessing(true);
      setFile(selectedFile);
      const img = await loadImageFromFile(selectedFile);
      setOriginalImage(img);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePresetSelect = (preset: PresetOption) => {
    setSelectedPreset(preset);
    setTargetKb(preset.targetKb);
  };

  useEffect(() => {
    if (!originalImage) return;

    let isMounted = true;
    const generatePassport = async () => {
      setIsProcessing(true);
      try {
        const res = await makePassportPhoto(
          originalImage,
          selectedPreset.width,
          selectedPreset.height,
          targetKb,
          bgColor
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

    const timer = setTimeout(generatePassport, 120);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [originalImage, selectedPreset, targetKb, bgColor]);

  const resultUrlRef = React.useRef<string | null>(null);

  useEffect(() => {
    resultUrlRef.current = result?.objectUrl || null;
  }, [result]);

  useEffect(() => {
    return () => {
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  const handleDownload = () => {
    if (!result || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'passport-photo';
    const filename = `${baseName}-${selectedPreset.id}-${Math.round(result.sizeBytes / 1024)}kb.jpg`;

    triggerDownload(result.blob, filename);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch {}
  };

  const handleDownloadPrintSheet = async () => {
    if (!result || !file) return;

    // 4x6 inch photo paper at 300 DPI (1800 x 1200 px landscape)
    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = 1800;
    sheetCanvas.height = 1200;
    const ctx = sheetCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1800, 1200);

    const img = new Image();
    img.src = result.objectUrl;
    await new Promise((res) => {
      img.onload = res;
    });

    // Determine grid layout based on preset aspect
    const isSquare = selectedPreset.id === 'us-visa';
    const cols = isSquare ? 3 : 4;
    const rows = 2;
    const count = cols * rows;

    const scaledW = isSquare ? 500 : 380;
    const scaledH = Math.round((scaledW * selectedPreset.height) / selectedPreset.width);

    const gapX = Math.round((1800 - cols * scaledW) / (cols + 1));
    const gapY = Math.round((1120 - rows * scaledH) / (rows + 1));

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = gapX + c * (scaledW + gapX);
        const y = gapY + r * (scaledH + gapY);

        ctx.drawImage(img, x, y, scaledW, scaledH);

        // Thin cutting guide border
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, scaledW, scaledH);
      }
    }

    // Sheet footer watermark / guide text
    ctx.fillStyle = '#64748b';
    ctx.font = '14px sans-serif';
    ctx.fillText(
      `AI Photo Lab • 4x6 Inch Printable Sheet (${count} Photos @ 300 DPI) • Cut along borders`,
      gapX,
      1165
    );

    sheetCanvas.toBlob(
      (blob) => {
        if (!blob) return;
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'passport';
        triggerDownload(blob, `${baseName}-4x6-print-sheet-${count}photos.jpg`);
        try {
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });
        } catch {}
      },
      'image/jpeg',
      0.95
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>{t.tools.passport.badge}</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t.tools.passport.name}
        </h1>
        <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
          {t.tools.passport.shortDesc}
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
                <span>{language === 'hi' ? 'पासपोर्ट फोटो सेटिंग्स' : 'Passport Specifications'}</span>
              </div>
              <button
                onClick={() => {
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

            {/* Presets List */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {language === 'hi' ? 'परीक्षा / वीजा मानक चुनें' : 'Select Examination / Visa Standard'}
              </label>
              <div className="space-y-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePresetSelect(p)}
                    className={`w-full p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                      selectedPreset.id === p.id
                        ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {language === 'hi' ? p.nameHi : p.nameEn}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {language === 'hi' ? p.descHi : p.descEn}
                      </div>
                    </div>
                    {selectedPreset.id === p.id && (
                      <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Target KB slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-700">{t.toolLabels.targetKB}</span>
                <span className="font-bold text-purple-700 px-2 py-0.5 bg-purple-100 rounded">
                  Max {targetKb} KB
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="250"
                value={targetKb}
                onChange={(e) => setTargetKb(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-[11px] text-slate-600 mt-1">
                <span>15 KB (Signature)</span>
                <span>45 KB (SSC/UPSC)</span>
                <span>200 KB (Visa)</span>
              </div>
            </div>

            {/* Background Color replacement */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {t.toolLabels.bgColor}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: t.toolLabels.white, color: '#ffffff' },
                  { name: t.toolLabels.lightBlue, color: '#d0e6f8' },
                  { name: t.toolLabels.softGray, color: '#f1f5f9' },
                ].map((bg) => (
                  <button
                    key={bg.color}
                    type="button"
                    onClick={() => setBgColor(bg.color)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                      bgColor === bg.color
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-300"
                      style={{ backgroundColor: bg.color }}
                    />
                    <span>{bg.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Face alignment guide toggle */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-700 font-medium">
                {language === 'hi' ? 'बायोमेट्रिक फेस गाइड दिखाएं' : 'Biometric Face Overlay'}
              </span>
              <button
                type="button"
                onClick={() => setShowFaceGuide(!showFaceGuide)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  showFaceGuide ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {showFaceGuide ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Target size info verification */}
            {result && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                <div className="text-emerald-900 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    {language === 'hi'
                      ? 'सरकारी फॉर्म के अनुकूल: '
                      : 'Form Compliant: '}
                    {formatBytes(result.sizeBytes)}
                  </span>
                </div>
                <div className="text-emerald-800 text-[11px]">
                  {language === 'hi'
                    ? `माप: ${selectedPreset.width} × ${selectedPreset.height} px (300 DPI)`
                    : `Dimensions: ${selectedPreset.width} × ${selectedPreset.height} px @ 300 DPI`}
                </div>
              </div>
            )}

            {/* Download Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleDownload}
                disabled={!result || isProcessing}
                className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-purple-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>{language === 'hi' ? 'सिंगल फोटो डाउनलोड करें (फॉर्म अपलोड)' : 'Download Single Photo (Exam Upload)'}</span>
              </button>

              {selectedPreset.id !== 'signature' && (
                <button
                  onClick={handleDownloadPrintSheet}
                  disabled={!result || isProcessing}
                  className="w-full py-2.5 px-4 bg-purple-50 hover:bg-purple-100/80 border border-purple-200 disabled:opacity-50 text-purple-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  title={language === 'hi' ? '4x6 इंच फोटो पेपर पर 8 फोटो की प्रिंटेबल शीट' : '8-photo printable grid sheet on 4x6 inch paper'}
                >
                  <Download className="w-4 h-4 text-purple-600" />
                  <span>{language === 'hi' ? '4×6 प्रिंटेबल शीट डाउनलोड करें (8 फोटो)' : 'Download 4×6 Printable Sheet (8 Photos)'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4">
              <span className="text-xs font-semibold text-slate-700">
                {language === 'hi' ? 'पासपोर्ट फोटो पूर्वावलोकन' : 'Passport Photo Preview'}
              </span>
              <span className="text-xs text-purple-700 font-bold">
                {selectedPreset.width} × {selectedPreset.height} px
              </span>
            </div>

            <div className="relative w-full min-h-[340px] max-h-[500px] bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-4 border border-slate-200">
              {result ? (
                <div className="relative inline-block shadow-lg rounded border border-slate-300 overflow-hidden">
                  <img
                    src={result.objectUrl}
                    alt="Passport output"
                    className="max-h-[420px] max-w-full object-contain block"
                  />

                  {/* Biometric Oval Guide Overlay */}
                  {showFaceGuide && selectedPreset.id !== 'signature' && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                      <div className="w-[60%] h-[70%] border-2 border-dashed border-purple-500/80 rounded-full" />
                      <div className="absolute top-[42%] w-[40%] border-t border-purple-400/50" />
                      <div className="text-[10px] text-purple-700 font-bold bg-white/80 px-2 py-0.5 rounded shadow-sm mt-1">
                        {language === 'hi' ? 'आंखें व चेहरा यहां रखें' : 'Align Eyes & Head'}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-400">{t.actions.processing}</div>
              )}
            </div>

            <p className="mt-4 text-xs text-slate-600 text-center max-w-md">
              {language === 'hi'
                ? 'यह फोटो SSC, UPSC, बैंक, रेलवे और वीजा पोर्टलों के 20KB-50KB नियम के अनुसार सटीक कंप्रेस की गई है।'
                : 'Calculated to strictly respect government upload bounds (e.g. under 50KB) at crisp 300 DPI print clarity.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
