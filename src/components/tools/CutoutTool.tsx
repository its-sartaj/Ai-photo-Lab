import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { DropZone } from '../DropZone';
import {
  loadImageFromFile,
  autoDetectBackgroundMask,
  applyWandToMask,
  brushOnMask,
  renderMaskCompositeToCanvas,
  exportMaskResult,
  triggerDownload,
  generateSampleCutoutBlob,
  generateSampleProductBlob,
  CutoutBackgroundType,
} from '../../utils/imageEngine';
import {
  runAiSegmentation,
  AiStatus,
  AiModelMode,
} from '../../utils/aiSegmenter';
import {
  Download,
  RefreshCw,
  Sliders,
  Eraser,
  Pipette,
  Undo2,
  Sparkles,
  ShieldCheck,
  Check,
  Bot,
  AlertCircle,
  Loader2,
  Info,
  Layers,
  Eye,
  Columns,
  Paintbrush,
  ShoppingBag,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CutoutTool: React.FC = () => {
  const { t, language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);

  // AI model & status
  const [modelMode, setModelMode] = useState<AiModelMode>('auto');
  const [aiStatus, setAiStatus] = useState<AiStatus>('idle');
  const [aiStatusMsg, setAiStatusMsg] = useState<string>('');
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);
  const [detectedModelName, setDetectedModelName] = useState<string>('');

  // View mode: 'slider' (before/after split), 'cutout' (processed), 'original'
  const [viewMode, setViewMode] = useState<'slider' | 'cutout' | 'original'>('slider');
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 to 100%
  const isDraggingSliderRef = useRef<boolean>(false);

  // Manual refinement tools
  const [toolMode, setToolMode] = useState<'sample' | 'erase' | 'restore'>('sample');
  const [brushSize, setBrushSize] = useState<number>(24);
  const [tolerance, setTolerance] = useState<number>(25);
  const [contiguous, setContiguous] = useState<boolean>(true);
  const [sampledColor, setSampledColor] = useState<{ r: number; g: number; b: number } | null>(null);

  // Background replacement options
  const [replacementBg, setReplacementBg] = useState<CutoutBackgroundType>('transparent');
  const [customBgHex, setCustomBgHex] = useState<string>('#fde047');
  const [blurRadius, setBlurRadius] = useState<number>(16);

  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Core canvas & mask refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalDisplayCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<Uint8Array | null>(null);
  const historyRef = useRef<Uint8Array[]>([]);
  const isPaintingRef = useRef<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Sync original display canvas (used in slider & original views)
  const syncOriginalCanvas = useCallback(() => {
    if (!originalCanvasRef.current || !originalDisplayCanvasRef.current) return;
    const orig = originalCanvasRef.current;
    const target = originalDisplayCanvasRef.current;
    if (target.width !== orig.width || target.height !== orig.height) {
      target.width = orig.width;
      target.height = orig.height;
    }
    const ctx = target.getContext('2d');
    if (ctx) {
      ctx.drawImage(orig, 0, 0);
    }
  }, []);

  // Update visible cutout canvas with current mask & background
  const updateDisplayCanvas = useCallback(() => {
    if (!originalCanvasRef.current || !maskRef.current || !canvasRef.current) return;
    renderMaskCompositeToCanvas(
      originalCanvasRef.current,
      maskRef.current,
      canvasRef.current,
      replacementBg,
      customBgHex,
      blurRadius
    );
    syncOriginalCanvas();
  }, [replacementBg, customBgHex, blurRadius, syncOriginalCanvas]);

  // Push mask snapshot to undo stack
  const pushHistory = useCallback(() => {
    if (!maskRef.current) return;
    historyRef.current.push(new Uint8Array(maskRef.current));
    if (historyRef.current.length > 25) {
      historyRef.current.shift();
    }
    setCanUndo(historyRef.current.length > 1);
  }, []);

  // Run AI segmentation on loaded image
  const processWithAi = async (origCanvas: HTMLCanvasElement, forcedMode?: AiModelMode) => {
    setAiStatus('loading-model');
    setAiError(null);
    const activeMode = forcedMode || modelMode;

    try {
      const { mask, confidenceScore, modelName } = await runAiSegmentation(
        origCanvas,
        origCanvas.width,
        origCanvas.height,
        (msg) => setAiStatusMsg(msg),
        { mode: activeMode }
      );

      maskRef.current = mask;
      setAiConfidence(confidenceScore);
      setDetectedModelName(modelName);
      setAiStatus('ready');
      setAiStatusMsg('');
      historyRef.current = [new Uint8Array(mask)];
      setCanUndo(false);
      updateDisplayCanvas();
    } catch (err) {
      console.warn('AI segmentation fallback needed:', err);
      setAiStatus('error');
      setAiError(
        err instanceof Error
          ? err.message
          : 'Could not initialize neural network. Switched to smart edge-detection.'
      );

      // Intelligent fallback so the user is never stuck
      const { mask: fallbackMask, detectedColor } = autoDetectBackgroundMask(
        origCanvas,
        tolerance,
        3
      );
      maskRef.current = fallbackMask;
      setSampledColor(detectedColor);
      setDetectedModelName('Intelligent Edge & Saliency Detector');
      historyRef.current = [new Uint8Array(fallbackMask)];
      setCanUndo(false);
      updateDisplayCanvas();
    }
  };

  // Process a new uploaded image
  const processNewImage = async (img: HTMLImageElement, initialFile: File) => {
    setFile(initialFile);
    setAiConfidence(null);
    setAiError(null);
    setViewMode('slider');
    setSliderPos(50);

    // 1. Create pristine original canvas (never modified)
    const origCanvas = document.createElement('canvas');
    origCanvas.width = img.naturalWidth || img.width;
    origCanvas.height = img.naturalHeight || img.height;
    const origCtx = origCanvas.getContext('2d');
    if (!origCtx) throw new Error('Could not create original canvas context');
    origCtx.drawImage(img, 0, 0);
    originalCanvasRef.current = origCanvas;

    // 2. Automatically run AI background removal
    await processWithAi(origCanvas);
  };

  const handleImageSelected = async (selectedFile: File) => {
    try {
      const img = await loadImageFromFile(selectedFile);
      await processNewImage(img, selectedFile);
    } catch (err) {
      console.error(err);
    }
  };

  // Sample photo 1: Portrait / Person
  const handleLoadSamplePortrait = async () => {
    try {
      const { file: sampleFile } = await generateSampleCutoutBlob();
      const img = await loadImageFromFile(sampleFile);
      await processNewImage(img, sampleFile);
    } catch (err) {
      console.error(err);
    }
  };

  // Sample photo 2: E-commerce Product (Sneaker)
  const handleLoadSampleProduct = async () => {
    try {
      const { file: sampleFile } = await generateSampleProductBlob();
      const img = await loadImageFromFile(sampleFile);
      await processNewImage(img, sampleFile);
    } catch (err) {
      console.error(err);
    }
  };

  // Re-render display canvas whenever background styling or file changes
  useEffect(() => {
    updateDisplayCanvas();
  }, [updateDisplayCanvas, file]);

  // Accurately map client pointer coordinates to internal canvas pixel coordinates
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.max(0, Math.min(canvas.width - 1, Math.round((e.clientX - rect.left) * scaleX)));
    const y = Math.max(0, Math.min(canvas.height - 1, Math.round((e.clientY - rect.top) * scaleY)));

    return { x, y };
  };

  // Manual Color Wand
  const applyWandAt = (x: number, y: number) => {
    if (!originalCanvasRef.current || !maskRef.current) return;

    const { newMask, sampledColor: color } = applyWandToMask(
      originalCanvasRef.current,
      maskRef.current,
      x,
      y,
      tolerance,
      3,
      contiguous
    );

    maskRef.current = newMask;
    setSampledColor(color);
    pushHistory();
    updateDisplayCanvas();
  };

  // Pointer down: Wand sample OR Brush (Erase / Restore)
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // If in slider view, don't paint; user can switch to cutout view or drag slider
    if (viewMode === 'slider') return;

    const coords = getCanvasCoords(e);
    if (!coords) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    if (toolMode === 'sample') {
      applyWandAt(coords.x, coords.y);
    } else {
      // Erase or Restore
      isPaintingRef.current = true;
      lastPointRef.current = coords;
      if (originalCanvasRef.current && maskRef.current) {
        brushOnMask(
          maskRef.current,
          originalCanvasRef.current.width,
          originalCanvasRef.current.height,
          coords.x,
          coords.y,
          coords.x,
          coords.y,
          brushSize / 2,
          toolMode
        );
        updateDisplayCanvas();
      }
    }
  };

  // Pointer move: Brush drag
  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (viewMode === 'slider') return;
    if (!isPaintingRef.current || (toolMode !== 'erase' && toolMode !== 'restore')) return;
    const coords = getCanvasCoords(e);
    if (!coords || !lastPointRef.current) return;

    if (originalCanvasRef.current && maskRef.current) {
      brushOnMask(
        maskRef.current,
        originalCanvasRef.current.width,
        originalCanvasRef.current.height,
        lastPointRef.current.x,
        lastPointRef.current.y,
        coords.x,
        coords.y,
        brushSize / 2,
        toolMode
      );
      updateDisplayCanvas();
    }
    lastPointRef.current = coords;
  };

  // Pointer up: End brush stroke
  const handleCanvasPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (isPaintingRef.current && (toolMode === 'erase' || toolMode === 'restore')) {
      isPaintingRef.current = false;
      lastPointRef.current = null;
      pushHistory();
      updateDisplayCanvas();
    }
  };

  // Slider dragging handlers
  const handleSliderMove = (clientX: number, containerRect: DOMRect) => {
    const rawPos = ((clientX - containerRect.left) / containerRect.width) * 100;
    const clamped = Math.max(0, Math.min(100, Math.round(rawPos)));
    setSliderPos(clamped);
  };

  const handleSliderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingSliderRef.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    const rect = e.currentTarget.getBoundingClientRect();
    handleSliderMove(e.clientX, rect);
  };

  const handleSliderPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingSliderRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleSliderMove(e.clientX, rect);
  };

  const handleSliderPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingSliderRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Undo last action
  const handleUndo = () => {
    if (historyRef.current.length > 1) {
      historyRef.current.pop();
      const prevState = historyRef.current[historyRef.current.length - 1];
      if (prevState) {
        maskRef.current = new Uint8Array(prevState);
        updateDisplayCanvas();
      }
      setCanUndo(historyRef.current.length > 1);
    }
  };

  // Re-run AI segmentation
  const handleRetryAi = async (forcedMode?: AiModelMode) => {
    if (!originalCanvasRef.current) return;
    await processWithAi(originalCanvasRef.current, forcedMode);
  };

  // Download final processed image
  const handleDownload = async (targetFormat?: 'png' | 'jpg') => {
    if (!originalCanvasRef.current || !maskRef.current || !file) return;

    try {
      setIsExporting(true);
      // If user specifically requested 'png', force transparent or export PNG
      const exportBg = targetFormat === 'png' ? 'transparent' : targetFormat === 'jpg' && replacementBg === 'transparent' ? 'white' : replacementBg;

      const result = await exportMaskResult(
        originalCanvasRef.current,
        maskRef.current,
        exportBg,
        customBgHex,
        0.95,
        blurRadius
      );

      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'removebg';
      const suffix = exportBg === 'transparent' ? 'removebg' : exportBg === 'white' ? 'white' : exportBg;
      triggerDownload(result.blob, `${baseName}-${suffix}.${result.extension}`);

      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      } catch {}
    } catch (err) {
      console.error('Download export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-3">
          <Bot className="w-3.5 h-3.5 text-purple-600" />
          <span>{language === 'hi' ? 'Remove.bg स्टाइल ऑटोमैटिक AI बैकग्राउंड रिमूवर' : 'Remove.bg Style Automatic AI Background Remover'}</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          {language === 'hi' ? 'ऑटोमैटिक AI बैकग्राउंड रिमूवर' : 'AI Background Remover'}
        </h1>
        <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
          {language === 'hi'
            ? 'किसी भी फोटो का बैकग्राउंड 100% ऑटोमैटिक और फ्री हटाएं — बिना किसी सर्वर अपलोड के, ठीक remove.bg की तरह।'
            : 'Remove image backgrounds 100% automatically in 1 click using in-browser AI. Free, private, and instantaneous.'}
        </p>
      </div>

      {!file ? (
        <div className="max-w-2xl mx-auto space-y-6">
          <DropZone onImageSelected={handleImageSelected} />

          {/* Quick Demo Sample Photos */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'hi' ? 'नमूना फोटो टेस्ट करें (Try Demo Samples)' : 'Try Demo Sample Photos'}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleLoadSamplePortrait}
                className="inline-flex items-center gap-2 text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-purple-200 shadow-2xs"
              >
                <User className="w-4 h-4 text-purple-600" />
                <span>
                  {language === 'hi'
                    ? 'व्यक्ति व पोर्ट्रेट (Portrait Sample)'
                    : 'Portrait (Person & Hair)'}
                </span>
              </button>
              <button
                type="button"
                onClick={handleLoadSampleProduct}
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-amber-200 shadow-2xs"
              >
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                <span>
                  {language === 'hi'
                    ? 'प्रोडक्ट व वस्तु (Product / Sneaker)'
                    : 'Product (E-commerce Sneaker)'}
                </span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              {language === 'hi'
                ? 'पोर्ट्रेट और ई-कॉमर्स प्रोडक्ट दोनों के लिए ऑटोमैटिक न्यूरल सेगमेंटेशन उपलब्ध है।'
                : 'Supports people, hair, clothes, and e-commerce product cutout.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-purple-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Sliders className="w-4 h-4 text-purple-600" />
                <span>{language === 'hi' ? 'Remove.bg स्टाइल कंट्रोल्स' : 'Remove.bg Controls'}</span>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  originalCanvasRef.current = null;
                  maskRef.current = null;
                  historyRef.current = [];
                  setSampledColor(null);
                  setCanUndo(false);
                  setAiConfidence(null);
                  setAiError(null);
                  setAiStatus('idle');
                }}
                className="text-xs text-slate-500 hover:text-purple-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.actions.reset}</span>
              </button>
            </div>

            {/* AI Status / Notification banner */}
            {(aiStatus === 'loading-model' || aiStatus === 'processing') && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-800 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600 shrink-0" />
                <span className="font-semibold">
                  {aiStatusMsg || (language === 'hi' ? 'AI मॉडल बैकग्राउंड स्कैन कर रहा है...' : 'Scanning background with AI...')}
                </span>
              </div>
            )}

            {aiStatus === 'ready' && aiConfidence !== null && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                <div className="flex items-center gap-1.5 font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'hi' ? 'AI बैकग्राउंड रिमूवल सफल' : 'AI Cutout Complete'}</span>
                </div>
                <span className="text-[11px] font-semibold bg-emerald-100 px-2 py-0.5 rounded-md text-emerald-700">
                  {detectedModelName || 'MediaPipe Vision'} ({aiConfidence}%)
                </span>
              </div>
            )}

            {aiError && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-2">
                <div className="flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{aiError}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleRetryAi('portrait')}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    {language === 'hi' ? 'पोर्ट्रेट AI' : 'Retry Portrait'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRetryAi('general')}
                    className="px-2.5 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    {language === 'hi' ? 'ऑब्जेक्ट AI' : 'Retry Object'}
                  </button>
                </div>
              </div>
            )}

            {/* AI Model Target Switcher */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  {language === 'hi' ? 'AI डिटेक्शन मोड' : 'AI Detection Mode'}
                </label>
                <span className="text-[10px] text-purple-600 font-medium">
                  {language === 'hi' ? 'Google MediaPipe On-Device' : 'Google MediaPipe On-Device'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setModelMode('auto');
                    handleRetryAi('auto');
                  }}
                  className={`py-1.5 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    modelMode === 'auto'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'hi' ? '⚡ ऑटो' : '⚡ Auto'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModelMode('portrait');
                    handleRetryAi('portrait');
                  }}
                  className={`py-1.5 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    modelMode === 'portrait'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'hi' ? '👤 पोर्ट्रेट' : '👤 Portrait'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModelMode('general');
                    handleRetryAi('general');
                  }}
                  className={`py-1.5 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    modelMode === 'general'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'hi' ? '📦 प्रोडक्ट' : '📦 Products'}
                </button>
              </div>
            </div>

            {/* Remove.bg Style Background Replacement Palette */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-700">
                  {language === 'hi' ? 'नया बैकग्राउंड चुनें (Remove.bg स्टाइल)' : 'Change Background (Remove.bg Style)'}
                </label>
                <span className="text-[10px] text-slate-400">
                  {replacementBg.toUpperCase()}
                </span>
              </div>

              {/* Quick Primary Choices */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                {/* Transparent (PNG) */}
                <button
                  type="button"
                  onClick={() => setReplacementBg('transparent')}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    replacementBg === 'transparent'
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-xs ring-1 ring-purple-600'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 checkerboard-bg" />
                  <span>{t.toolLabels.transparent}</span>
                </button>

                {/* Clean White (JPG) */}
                <button
                  type="button"
                  onClick={() => setReplacementBg('white')}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    replacementBg === 'white'
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-xs ring-1 ring-purple-600'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 bg-white" />
                  <span>{t.toolLabels.white}</span>
                </button>

                {/* DSLR Bokeh Blur */}
                <button
                  type="button"
                  onClick={() => setReplacementBg('blur')}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    replacementBg === 'blur'
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-xs ring-1 ring-purple-600'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-purple-300 bg-purple-200/80" />
                  <span>{language === 'hi' ? 'DSLR ब्लर' : 'DSLR Blur'}</span>
                </button>
              </div>

              {/* Popular Color Swatches */}
              <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 mr-1">
                  {language === 'hi' ? 'कलर पैलेट:' : 'Colors:'}
                </span>

                {/* Visa Light Blue */}
                <button
                  type="button"
                  onClick={() => setReplacementBg('lightblue')}
                  title="Visa Light Blue (#D0E6F8)"
                  className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                    replacementBg === 'lightblue' ? 'ring-2 ring-purple-600 scale-110' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: '#d0e6f8' }}
                />

                {/* Studio Gray */}
                <button
                  type="button"
                  onClick={() => setReplacementBg('softgray')}
                  title="Studio Gray (#F1F5F9)"
                  className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                    replacementBg === 'softgray' ? 'ring-2 ring-purple-600 scale-110' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: '#f1f5f9' }}
                />

                {/* Slate Dark */}
                <button
                  type="button"
                  onClick={() => setReplacementBg('dark')}
                  title="Slate Dark (#0F172A)"
                  className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                    replacementBg === 'dark' ? 'ring-2 ring-purple-600 scale-110' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: '#0f172a' }}
                />

                {/* Warm Amber */}
                <button
                  type="button"
                  onClick={() => setReplacementBg('warm')}
                  title="Warm Amber (#FEF3C7)"
                  className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                    replacementBg === 'warm' ? 'ring-2 ring-purple-600 scale-110' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: '#fef3c7' }}
                />

                {/* Soft Rose */}
                <button
                  type="button"
                  onClick={() => setReplacementBg('rose')}
                  title="Soft Rose (#FFE4E6)"
                  className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                    replacementBg === 'rose' ? 'ring-2 ring-purple-600 scale-110' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: '#ffe4e6' }}
                />

                {/* Mint Green */}
                <button
                  type="button"
                  onClick={() => setReplacementBg('mint')}
                  title="Mint Green (#ECFDF5)"
                  className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                    replacementBg === 'mint' ? 'ring-2 ring-purple-600 scale-110' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: '#ecfdf5' }}
                />

                {/* Royal Blue */}
                <button
                  type="button"
                  onClick={() => setReplacementBg('royal')}
                  title="Royal Blue (#1D4ED8)"
                  className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                    replacementBg === 'royal' ? 'ring-2 ring-purple-600 scale-110' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: '#1d4ed8' }}
                />

                {/* Custom Color Input */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <input
                    type="color"
                    value={customBgHex}
                    onChange={(e) => {
                      setCustomBgHex(e.target.value);
                      setReplacementBg('custom');
                    }}
                    className="w-6 h-6 rounded-full cursor-pointer border border-slate-300 p-0"
                    title="Pick custom color"
                  />
                  <span className="text-[11px] font-bold text-slate-600">
                    {replacementBg === 'custom' ? customBgHex.toUpperCase() : t.toolLabels.custom}
                  </span>
                </div>
              </div>

              {/* Blur Slider (if blur is active) */}
              {replacementBg === 'blur' && (
                <div className="mt-2 p-2.5 bg-purple-50/70 rounded-xl border border-purple-100 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-purple-900">
                      {language === 'hi' ? 'ब्लर की तीव्रता (Blur Radius)' : 'Bokeh Blur Intensity'}
                    </span>
                    <span className="font-bold text-purple-700">{blurRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="36"
                    value={blurRadius}
                    onChange={(e) => setBlurRadius(Number(e.target.value))}
                    className="w-full h-1.5 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
              )}
            </div>

            {/* Remove.bg Style Erase / Restore / Wand Editor */}
            <div className="pt-2 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  {language === 'hi' ? 'बारीक सुधार टूल्स (Erase & Restore)' : 'Erase & Restore Manual Brush'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {language === 'hi' ? 'Remove.bg स्टाइल एडिटर' : 'Remove.bg Style Editor'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* Erase */}
                <button
                  type="button"
                  onClick={() => {
                    setToolMode('erase');
                    setViewMode('cutout');
                  }}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    toolMode === 'erase' && viewMode === 'cutout'
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-xs ring-1 ring-purple-600'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>{t.toolLabels.eraseBrush}</span>
                </button>

                {/* Restore */}
                <button
                  type="button"
                  onClick={() => {
                    setToolMode('restore');
                    setViewMode('cutout');
                  }}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    toolMode === 'restore' && viewMode === 'cutout'
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-xs ring-1 ring-purple-600'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Paintbrush className="w-3.5 h-3.5" />
                  <span>{t.toolLabels.restoreBrush}</span>
                </button>

                {/* Color Wand */}
                <button
                  type="button"
                  onClick={() => {
                    setToolMode('sample');
                    setViewMode('cutout');
                  }}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    toolMode === 'sample' && viewMode === 'cutout'
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-xs ring-1 ring-purple-600'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Pipette className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'कलर वैंड' : 'Color Wand'}</span>
                </button>
              </div>

              {/* Brush Size / Tolerance Controls */}
              {(toolMode === 'erase' || toolMode === 'restore') && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">{t.toolLabels.brushSize}</span>
                    <span className="font-bold text-purple-700">{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="80"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleUndo}
                      disabled={!canUndo}
                      className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        canUndo
                          ? 'border-slate-300 hover:bg-slate-50 text-slate-700'
                          : 'border-slate-200 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      <Undo2 className="w-4 h-4" />
                      <span>{language === 'hi' ? 'वापस लाएं (Undo)' : 'Undo'}</span>
                    </button>
                  </div>
                </div>
              )}

              {toolMode === 'sample' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">{t.toolLabels.tolerance}</span>
                    <span className="font-bold text-purple-700">{tolerance}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={tolerance}
                    onChange={(e) => setTolerance(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contiguous}
                      onChange={(e) => setContiguous(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded border-slate-300 accent-purple-600 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold flex items-center gap-1 text-slate-800">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {language === 'hi' ? 'सबजेक्ट सुरक्षा (Contiguous Flood Fill)' : 'Protect Subject Interior (Contiguous)'}
                      </span>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Download Buttons Suite */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleDownload()}
                disabled={isExporting}
                className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold rounded-xl shadow-lg shadow-purple-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>
                  {replacementBg === 'transparent'
                    ? `${t.actions.download} (Transparent PNG)`
                    : replacementBg === 'white'
                    ? `${t.actions.download} (Clean White JPG)`
                    : `${t.actions.download} (${replacementBg.toUpperCase()})`}
                </span>
              </button>

              {/* Secondary quick format button */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleDownload('png')}
                  disabled={isExporting}
                  className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer text-center"
                >
                  {language === 'hi' ? 'पारदर्शी PNG डाउनलोड' : 'Download PNG'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload('jpg')}
                  disabled={isExporting}
                  className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer text-center"
                >
                  {language === 'hi' ? 'Clean White JPG' : 'Clean White JPG'}
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Canvas & Remove.bg Comparison Slider Area */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center">
            {/* View Mode Toggle Tabs (Remove.bg signature) */}
            <div className="w-full flex flex-wrap justify-between items-center gap-2 mb-4">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode('slider')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'slider'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? '⇄ Before / After तुलना' : '⇄ Comparison Slider'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cutout')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'cutout'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'रिमूव्ड बैकग्राउंड' : 'Removed Background'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('original')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'original'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'मूल फोटो' : 'Original Photo'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                  {detectedModelName || 'MediaPipe AI'}
                </span>
              </div>
            </div>

            {/* Remove.bg Interactive Split Slider Container */}
            <div
              onPointerDown={viewMode === 'slider' ? handleSliderPointerDown : undefined}
              onPointerMove={viewMode === 'slider' ? handleSliderPointerMove : undefined}
              onPointerUp={viewMode === 'slider' ? handleSliderPointerUp : undefined}
              className={`relative w-full min-h-[360px] max-h-[540px] rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200 select-none ${
                viewMode === 'slider' ? 'cursor-ew-resize' : ''
              } ${replacementBg === 'transparent' ? 'checkerboard-bg' : 'bg-slate-50'}`}
            >
              {/* Processed Cutout Canvas Layer */}
              <canvas
                ref={canvasRef}
                onPointerDown={handleCanvasPointerDown}
                onPointerMove={handleCanvasPointerMove}
                onPointerUp={handleCanvasPointerUp}
                onPointerLeave={handleCanvasPointerUp}
                className="max-h-[500px] max-w-full shadow-md rounded-lg pointer-events-auto"
                style={{
                  display: viewMode === 'original' ? 'none' : 'block',
                  maxWidth: '100%',
                  maxHeight: '500px',
                  width: 'auto',
                  height: 'auto',
                  touchAction: 'none',
                  cursor: viewMode === 'slider' ? 'ew-resize' : 'crosshair',
                }}
              />

              {/* Original Canvas Layer (Used in Slider split or Original view) */}
              <canvas
                ref={originalDisplayCanvasRef}
                className="max-h-[500px] max-w-full shadow-md rounded-lg pointer-events-none"
                style={{
                  display: viewMode === 'cutout' ? 'none' : 'block',
                  position: viewMode === 'slider' ? 'absolute' : 'relative',
                  maxWidth: '100%',
                  maxHeight: '500px',
                  width: 'auto',
                  height: 'auto',
                  clipPath: viewMode === 'slider' ? `inset(0 ${100 - sliderPos}% 0 0)` : 'none',
                }}
              />

              {/* Slider Split Divider & Circular Pill Handle (Remove.bg Signature) */}
              {viewMode === 'slider' && (
                <div
                  className="absolute top-0 bottom-0 pointer-events-none flex items-center justify-center"
                  style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
                >
                  {/* Vertical line */}
                  <div className="w-0.5 h-full bg-white shadow-md" />

                  {/* Circular draggable button */}
                  <div className="absolute w-8 h-8 rounded-full bg-white shadow-xl border-2 border-purple-600 flex items-center justify-center text-purple-700 text-xs font-bold">
                    ⇄
                  </div>
                </div>
              )}

              {/* On-screen Badges for Split Slider */}
              {viewMode === 'slider' && (
                <>
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md pointer-events-none">
                    {language === 'hi' ? 'मूल फोटो (Original)' : 'Original'}
                  </div>
                  <div className="absolute top-3 right-3 bg-purple-600/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md pointer-events-none">
                    {language === 'hi' ? 'रिमूव्ड बैकग्राउंड' : 'Background Removed'}
                  </div>
                </>
              )}
            </div>

            {/* Footer Status & Privacy Assurance */}
            <div className="w-full mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {language === 'hi'
                    ? '100% ब्राउज़र AI — ज़ीरो सर्वर अपलोड / सुरक्षित'
                    : '100% In-Browser AI — Zero Server Upload / 100% Private'}
                </span>
              </div>
              <span className="font-semibold text-purple-700">
                {viewMode === 'slider'
                  ? (language === 'hi' ? 'हैंडल को बाएं/दाएं खींचकर तुलना करें' : 'Drag slider ⇄ to compare')
                  : (language === 'hi' ? 'क्लिक करके टच-अप करें' : 'Click/Drag on photo to touch up')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
