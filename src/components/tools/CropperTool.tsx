import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { DropZone } from '../DropZone';
import {
  loadImageFromFile,
  cropImage,
  triggerDownload,
} from '../../utils/imageEngine';
import {
  Download,
  RefreshCw,
  Zap,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop as CropIcon,
  Sliders,
} from 'lucide-react';
import confetti from 'canvas-confetti';

type AspectPreset = 'free' | '1:1' | '16:9' | '4:3' | '9:16' | '3:2';

export const CropperTool: React.FC = () => {
  const { t, language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [aspect, setAspect] = useState<AspectPreset>('free');

  // Normalized crop bounds (0 to 1) relative to rotated preview canvas
  const [crop, setCrop] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0.05,
    y: 0.05,
    width: 0.9,
    height: 0.9,
  });

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragAction, setDragAction] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [startCrop, setStartCrop] = useState(crop);

  const containerRef = useRef<HTMLDivElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Render the rotated/flipped image onto the preview canvas
  const renderTransformedPreview = useCallback(() => {
    if (!originalImage || !previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const naturalW = originalImage.naturalWidth || originalImage.width;
    const naturalH = originalImage.naturalHeight || originalImage.height;
    const isSideways = rotation % 180 !== 0;

    const targetW = isSideways ? naturalH : naturalW;
    const targetH = isSideways ? naturalW : naturalH;

    canvas.width = targetW;
    canvas.height = targetH;

    ctx.save();
    ctx.clearRect(0, 0, targetW, targetH);
    ctx.translate(targetW / 2, targetH / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(originalImage, -naturalW / 2, -naturalH / 2);
    ctx.restore();
  }, [originalImage, rotation, flipH, flipV]);

  useEffect(() => {
    renderTransformedPreview();
  }, [renderTransformedPreview]);

  const handleImageSelected = async (selectedFile: File) => {
    try {
      setFile(selectedFile);
      const img = await loadImageFromFile(selectedFile);
      setOriginalImage(img);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setCrop({ x: 0.05, y: 0.05, width: 0.9, height: 0.9 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAspectChange = (newAspect: AspectPreset) => {
    setAspect(newAspect);
    if (!originalImage) return;
    if (newAspect === 'free') return;

    const [wRatio, hRatio] = newAspect.split(':').map(Number);
    const targetRatio = wRatio / hRatio;

    const isSideways = rotation % 180 !== 0;
    const imgW = isSideways ? originalImage.naturalHeight : originalImage.naturalWidth;
    const imgH = isSideways ? originalImage.naturalWidth : originalImage.naturalHeight;
    const currentImgRatio = imgW / imgH;

    let newW = 0.85;
    let newH = 0.85;

    if (targetRatio > currentImgRatio) {
      newW = 0.9;
      newH = (newW * imgW) / (targetRatio * imgH);
    } else {
      newH = 0.9;
      newW = (newH * imgH * targetRatio) / imgW;
    }

    setCrop({
      x: Math.max(0, (1 - newW) / 2),
      y: Math.max(0, (1 - newH) / 2),
      width: Math.min(1, newW),
      height: Math.min(1, newH),
    });
  };

  // Pointer drag handling for crop overlay
  const handlePointerDown = (action: string, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragAction(action);
    setDragStart({ x: e.clientX, y: e.clientY });
    setStartCrop({ ...crop });
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dx = (e.clientX - dragStart.x) / rect.width;
      const dy = (e.clientY - dragStart.y) / rect.height;

      let next = { ...startCrop };
      let targetRatio: number | null = null;
      if (aspect !== 'free') {
        const [wRatio, hRatio] = aspect.split(':').map(Number);
        targetRatio = wRatio / hRatio;
      }

      if (dragAction === 'move') {
        next.x = Math.max(0, Math.min(1 - next.width, startCrop.x + dx));
        next.y = Math.max(0, Math.min(1 - next.height, startCrop.y + dy));
      } else if (dragAction === 'se') {
        let newW = Math.max(0.08, Math.min(1 - startCrop.x, startCrop.width + dx));
        let newH = Math.max(0.08, Math.min(1 - startCrop.y, startCrop.height + dy));
        if (targetRatio) {
          newH = (newW * rect.width) / (targetRatio * rect.height);
          if (startCrop.y + newH > 1) {
            newH = 1 - startCrop.y;
            newW = (newH * rect.height * targetRatio) / rect.width;
          }
        }
        next.width = newW;
        next.height = newH;
      } else if (dragAction === 'nw') {
        let newX = Math.max(0, Math.min(startCrop.x + startCrop.width - 0.08, startCrop.x + dx));
        let newY = Math.max(0, Math.min(startCrop.y + startCrop.height - 0.08, startCrop.y + dy));
        let newW = startCrop.width + (startCrop.x - newX);
        let newH = startCrop.height + (startCrop.y - newY);
        if (targetRatio) {
          newH = (newW * rect.width) / (targetRatio * rect.height);
          newY = startCrop.y + startCrop.height - newH;
          if (newY < 0) {
            newY = 0;
            newH = startCrop.y + startCrop.height;
            newW = (newH * rect.height * targetRatio) / rect.width;
            newX = startCrop.x + startCrop.width - newW;
          }
        }
        next.width = newW;
        next.height = newH;
        next.x = newX;
        next.y = newY;
      }

      setCrop(next);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setDragAction(null);
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, dragAction, dragStart, startCrop]);

  const handleDownloadCropped = async () => {
    if (!originalImage || !file) return;

    const isSideways = rotation % 180 !== 0;
    const sourceW = isSideways ? originalImage.naturalHeight : originalImage.naturalWidth;
    const sourceH = isSideways ? originalImage.naturalWidth : originalImage.naturalHeight;

    const pixelX = Math.round(crop.x * sourceW);
    const pixelY = Math.round(crop.y * sourceH);
    const pixelW = Math.round(crop.width * sourceW);
    const pixelH = Math.round(crop.height * sourceH);

    try {
      const res = await cropImage(
        originalImage,
        pixelX,
        pixelY,
        pixelW,
        pixelH,
        rotation,
        flipH,
        flipV,
        'image/jpeg',
        0.95
      );

      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'cropped';
      triggerDownload(res.blob, `${baseName}-cropped.jpg`);

      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      } catch {}
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-3">
          <Zap className="w-3.5 h-3.5 text-purple-600" />
          <span>{t.badges.clientSide}</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t.tools.crop.name}
        </h1>
        <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
          {t.tools.crop.shortDesc}
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
                <span>{language === 'hi' ? 'क्रॉप व रोटेट विकल्प' : 'Crop & Orientation'}</span>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setOriginalImage(null);
                }}
                className="text-xs text-slate-500 hover:text-purple-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.actions.reset}</span>
              </button>
            </div>

            {/* Rotation & Flip Controls */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {language === 'hi' ? 'दिशा व रोटेशन' : 'Rotate & Flip'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="py-2 px-3 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-slate-700 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 text-purple-600" />
                  <span>90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFlipH((v) => !v)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    flipH
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'पलटें H' : 'Flip H'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFlipV((v) => !v)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    flipV
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <FlipVertical className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'पलटें V' : 'Flip V'}</span>
                </button>
              </div>
            </div>

            {/* Aspect Ratio Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {t.toolLabels.aspectRatio}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'free', label: t.toolLabels.cropPresetFree },
                  { id: '1:1', label: t.toolLabels.cropPreset11 },
                  { id: '16:9', label: t.toolLabels.cropPreset169 },
                  { id: '4:3', label: t.toolLabels.cropPreset43 },
                  { id: '9:16', label: t.toolLabels.cropPreset916 },
                  { id: '3:2', label: t.toolLabels.cropPreset32 },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAspectChange(item.id as AspectPreset)}
                    className={`py-2 px-2 text-xs font-medium rounded-xl border transition-all text-center cursor-pointer ${
                      aspect === item.id
                        ? 'border-purple-600 bg-purple-50 text-purple-700 font-bold shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {language === 'hi'
                ? 'स्क्रीन पर दिख रहे आयत (Crop Box) को खींचकर या कोनों को ड्रैग करके मनचाहा हिस्सा काटें।'
                : 'Drag the crop box or corners directly over the photo to adjust your selection area.'}
            </p>

            {/* Download Button */}
            <button
              onClick={handleDownloadCropped}
              className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CropIcon className="w-5 h-5" />
              <span>{language === 'hi' ? 'क्रॉप करके डाउनलोड करें' : 'Crop & Download'}</span>
            </button>
          </div>

          {/* Interactive Crop Preview Canvas Area */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4">
              <span className="text-xs font-semibold text-slate-700">
                {language === 'hi' ? 'इंटरैक्टिव क्रॉप एरिया' : 'Interactive Crop Canvas'}
              </span>
              <span className="text-xs text-slate-500">
                {language === 'hi' ? 'ड्रैग करके साइज बदलें' : 'Drag handles to adjust'}
              </span>
            </div>

            <div className="relative max-h-[480px] w-full flex items-center justify-center bg-slate-100 rounded-xl overflow-hidden select-none touch-none p-3 border border-slate-200">
              {originalImage && (
                <div
                  ref={containerRef}
                  className="relative inline-block max-h-[440px] max-w-full"
                >
                  <canvas
                    ref={previewCanvasRef}
                    className="max-h-[440px] max-w-full block rounded-lg shadow-sm"
                  />

                  {/* Shading overlay outside crop box */}
                  <div
                    className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] cursor-move"
                    style={{
                      left: `${crop.x * 100}%`,
                      top: `${crop.y * 100}%`,
                      width: `${crop.width * 100}%`,
                      height: `${crop.height * 100}%`,
                    }}
                    onPointerDown={(e) => handlePointerDown('move', e)}
                  >
                    {/* Rule of thirds grid lines */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-50">
                      <div className="border-r border-b border-white"></div>
                      <div className="border-r border-b border-white"></div>
                      <div className="border-b border-white"></div>
                      <div className="border-r border-b border-white"></div>
                      <div className="border-r border-b border-white"></div>
                      <div className="border-b border-white"></div>
                      <div className="border-r border-white"></div>
                      <div className="border-r border-white"></div>
                      <div></div>
                    </div>

                    {/* Resize handles */}
                    <div
                      className="absolute -top-2 -left-2 w-4 h-4 bg-purple-600 border-2 border-white rounded-full cursor-nwse-resize shadow"
                      onPointerDown={(e) => handlePointerDown('nw', e)}
                    />
                    <div
                      className="absolute -bottom-2 -right-2 w-4 h-4 bg-purple-600 border-2 border-white rounded-full cursor-nwse-resize shadow"
                      onPointerDown={(e) => handlePointerDown('se', e)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
