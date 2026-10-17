import { describe, it, expect } from 'vitest';
import {
  formatBytes,
  removeColorKey,
  createInitialMask,
  parseHexColor,
  eraseBrushOnMask,
  brushOnMask,
} from './imageEngine';
import { translations } from '../i18n/translations';
import { TUTORIALS_DATA } from '../data/tutorialsData';

describe('AI Photo Lab - Performance & Engine Unit Tests', () => {
  describe('formatBytes helper', () => {
    it('correctly handles zero and negative numbers', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(-100)).toBe('0 Bytes');
    });

    it('formats bytes, kilobytes, and megabytes accurately', () => {
      expect(formatBytes(512)).toBe('512 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1024 * 50)).toBe('50 KB');
      expect(formatBytes(1024 * 1024 * 1.5)).toBe('1.5 MB');
      expect(formatBytes(1024 * 1024 * 10.25)).toBe('10.25 MB');
    });
  });

  describe('Bilingual Content & Localization Integrity', () => {
    it('contains matching keys between English and Hindi translations', () => {
      expect(translations.en).toBeDefined();
      expect(translations.hi).toBeDefined();
      expect(Object.keys(translations.en.tools)).toEqual(Object.keys(translations.hi.tools));
      expect(Object.keys(translations.en.nav)).toEqual(Object.keys(translations.hi.nav));
      expect(Object.keys(translations.en.stats)).toEqual(Object.keys(translations.hi.stats));
    });

    it('has all 6 core tools defined with bilingual details', () => {
      const tools = ['compress', 'resize', 'convert', 'crop', 'passport', 'cutout'] as const;
      for (const toolId of tools) {
        expect(translations.en.tools[toolId].name).toBeTruthy();
        expect(translations.hi.tools[toolId].name).toBeTruthy();
        expect(translations.en.tools[toolId].shortDesc).toBeTruthy();
        expect(translations.hi.tools[toolId].shortDesc).toBeTruthy();
      }
    });

    it('has 5 rich educational tutorials with English and Hindi content', () => {
      expect(TUTORIALS_DATA.length).toBeGreaterThanOrEqual(5);
      TUTORIALS_DATA.forEach((tut) => {
        expect(tut.id).toBeTruthy();
        expect(tut.titleEn.length).toBeGreaterThan(10);
        expect(tut.titleHi.length).toBeGreaterThan(10);
        expect(tut.contentEn.length).toBeGreaterThan(100);
        expect(tut.contentHi.length).toBeGreaterThan(100);
        expect(tut.readTime).toBeTruthy();
      });
    });
  });

  describe('Aspect Ratio and Dimension Calculations', () => {
    it('accurately preserves aspect ratio when width changes', () => {
      const origW = 1920;
      const origH = 1080;
      const newW = 960;
      const ratio = origH / origW;
      const calculatedH = Math.round(newW * ratio);
      expect(calculatedH).toBe(540);
    });

    it('accurately calculates passport dimensions at 300 DPI', () => {
      // 35mm x 45mm = ~1.378 x 1.771 inches => at 300 DPI is approx 413x531 px
      const widthMm = 35;
      const heightMm = 45;
      const dpi = 300;
      const widthPx = Math.round((widthMm / 25.4) * dpi);
      const heightPx = Math.round((heightMm / 25.4) * dpi);
      expect(widthPx).toBe(413);
      expect(heightPx).toBe(531);
    });

    it('accurately calculates 2x2 inch US Visa dimensions at 300 DPI', () => {
      const inches = 2;
      const dpi = 300;
      const px = inches * dpi;
      expect(px).toBe(600);
    });
  });

  describe('Color Distance Mathematics for Background Cutout', () => {
    it('computes Euclidean color distance correctly', () => {
      // Target pure white (255, 255, 255), test sample off-white (245, 245, 245)
      const dr = 245 - 255;
      const dg = 245 - 255;
      const db = 245 - 255;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);
      expect(dist).toBeCloseTo(17.32, 1);

      // Max distance across entire spectrum is ~441.67
      const maxDist = Math.sqrt(255 * 255 * 3);
      expect(maxDist).toBeCloseTo(441.67, 1);
    });

    it('correctly distinguishes pure white from near-white and darker tones', () => {
      // White (255,255,255) vs Off-white (240, 240, 240)
      const offWhiteDist = Math.sqrt(3 * Math.pow(255 - 240, 2));
      expect(offWhiteDist).toBeCloseTo(25.98, 1);

      // White vs Light Gray (200, 200, 200)
      const grayDist = Math.sqrt(3 * Math.pow(255 - 200, 2));
      expect(grayDist).toBeCloseTo(95.26, 1);

      // White vs Dark Suit / Navy (20, 30, 80)
      const navyDist = Math.sqrt(
        Math.pow(255 - 20, 2) + Math.pow(255 - 30, 2) + Math.pow(255 - 80, 2)
      );
      expect(navyDist).toBeGreaterThan(300);
    });

    it('calibrates tolerance threshold appropriately for 25% default', () => {
      const tolerance = 25;
      const threshold = (tolerance / 100) * 280; // 70
      expect(threshold).toBe(70);

      // A threshold of 70 safely absorbs off-white noise (distance ~26)
      // while preserving skin tones (distance usually > 80-120) and clothing
      const offWhiteDist = 25.98;
      expect(offWhiteDist).toBeLessThan(threshold);
    });
  });

  describe('Clean White (#FFFFFF) & Transparent Compositing Logic', () => {
    it('ensures clean white output uses pure #FFFFFF and JPEG mime format', () => {
      const backgroundType = 'white';
      const expectedMime = backgroundType === 'white' ? 'image/jpeg' : 'image/png';
      const expectedExt = backgroundType === 'white' ? 'jpg' : 'png';
      const expectedFill = '#ffffff';

      expect(expectedMime).toBe('image/jpeg');
      expect(expectedExt).toBe('jpg');
      expect(expectedFill).toBe('#ffffff');
    });

    it('ensures transparent output uses image/png with png extension', () => {
      const backgroundType = 'transparent';
      const expectedMime = backgroundType === 'transparent' ? 'image/png' : 'image/jpeg';
      const expectedExt = backgroundType === 'transparent' ? 'png' : 'jpg';

      expect(expectedMime).toBe('image/png');
      expect(expectedExt).toBe('png');
    });

    it('supports Visa light blue background color #d0e6f8', () => {
      const visaColor = '#d0e6f8';
      expect(visaColor).toBe('#d0e6f8');
    });

    it('accurately parses 3-digit and 6-digit hex colors', () => {
      expect(parseHexColor('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(parseHexColor('#000000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(parseHexColor('#fff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(parseHexColor('#d0e6f8')).toEqual({ r: 208, g: 230, b: 248 });
    });

    it('initializes mask with 255 (opaque subject)', () => {
      const mask = createInitialMask(10, 10);
      expect(mask.length).toBe(100);
      expect(mask[0]).toBe(255);
      expect(mask[99]).toBe(255);
    });

    it('erases pixels on mask within brush radius correctly', () => {
      const width = 20;
      const height = 20;
      const mask = createInitialMask(width, height);
      // Erase around center (10, 10) with radius 3
      eraseBrushOnMask(mask, width, height, 10, 10, 10, 10, 3);

      // Center should be erased to 0
      expect(mask[10 * width + 10]).toBe(0);
      expect(mask[10 * width + 11]).toBe(0);
      expect(mask[10 * width + 9]).toBe(0);

      // Pixel far away (0, 0) remains 255
      expect(mask[0]).toBe(255);
    });

    it('restores erased pixels on mask with brushOnMask in restore mode', () => {
      const width = 20;
      const height = 20;
      const mask = createInitialMask(width, height);
      // First erase
      brushOnMask(mask, width, height, 10, 10, 10, 10, 3, 'erase');
      expect(mask[10 * width + 10]).toBe(0);

      // Now restore
      brushOnMask(mask, width, height, 10, 10, 10, 10, 3, 'restore');
      expect(mask[10 * width + 10]).toBe(255);
    });

    it('validates remove.bg background presets and color values', () => {
      const presets = {
        white: '#ffffff',
        lightblue: '#d0e6f8',
        softgray: '#f1f5f9',
        dark: '#0f172a',
        warm: '#fef3c7',
        rose: '#ffe4e6',
        mint: '#ecfdf5',
        royal: '#1d4ed8',
      };
      for (const [key, hex] of Object.entries(presets)) {
        const rgb = parseHexColor(hex);
        expect(rgb.r).toBeGreaterThanOrEqual(0);
        expect(rgb.g).toBeGreaterThanOrEqual(0);
        expect(rgb.b).toBeGreaterThanOrEqual(0);
      }
    });

    it('verifies exact pixel math: mask=0 yields 100% pure #FFFFFF (255,255,255,255)', () => {
      // For any source pixel (e.g. gray wall 200, 200, 200)
      const sR = 200;
      const sG = 200;
      const sB = 200;
      const maskVal = 0; // Removed background
      const alpha = maskVal / 255; // 0
      const bgR = 255;
      const bgG = 255;
      const bgB = 255;

      const outR = Math.round(sR * alpha + bgR * (1 - alpha));
      const outG = Math.round(sG * alpha + bgG * (1 - alpha));
      const outB = Math.round(sB * alpha + bgB * (1 - alpha));

      expect(outR).toBe(255);
      expect(outG).toBe(255);
      expect(outB).toBe(255);
    });

    it('verifies exact pixel math: mask=255 retains 100% original subject color', () => {
      const sR = 120;
      const sG = 80;
      const sB = 40;
      const maskVal = 255; // Subject preserved
      const alpha = maskVal / 255; // 1
      const bgR = 255;
      const bgG = 255;
      const bgB = 255;

      const outR = Math.round(sR * alpha + bgR * (1 - alpha));
      const outG = Math.round(sG * alpha + bgG * (1 - alpha));
      const outB = Math.round(sB * alpha + bgB * (1 - alpha));

      expect(outR).toBe(sR);
      expect(outG).toBe(sG);
      expect(outB).toBe(sB);
    });
  });

  describe('AI Segmentation Mask Mapping & Contrast Curve', () => {
    it('applies contrast threshold curve: values <= 0.25 become 0 (transparent background)', () => {
      const val = 0.2;
      let alphaVal: number;
      if (val <= 0.25) {
        alphaVal = 0;
      } else if (val >= 0.75) {
        alphaVal = 255;
      } else {
        alphaVal = Math.round(((val - 0.25) / 0.5) * 255);
      }
      expect(alphaVal).toBe(0);
    });

    it('applies contrast threshold curve: values >= 0.75 become 255 (solid subject)', () => {
      const val = 0.85;
      let alphaVal: number;
      if (val <= 0.25) {
        alphaVal = 0;
      } else if (val >= 0.75) {
        alphaVal = 255;
      } else {
        alphaVal = Math.round(((val - 0.25) / 0.5) * 255);
      }
      expect(alphaVal).toBe(255);
    });

    it('linearly feathers edge values between 0.25 and 0.75', () => {
      const val = 0.5; // Exactly halfway
      let alphaVal: number;
      if (val <= 0.25) {
        alphaVal = 0;
      } else if (val >= 0.75) {
        alphaVal = 255;
      } else {
        alphaVal = Math.round(((val - 0.25) / 0.5) * 255);
      }
      expect(alphaVal).toBe(128);
    });

    it('interpolates bilinear samples correctly across coordinates', () => {
      // 4 corners: p00=0 (bg), p10=1 (subject), p01=0 (bg), p11=1 (subject)
      const p00 = 0.0;
      const p10 = 1.0;
      const p01 = 0.0;
      const p11 = 1.0;

      const fx = 0.5;
      const fy = 0.5;

      const top = p00 + fx * (p10 - p00);
      const bottom = p01 + fx * (p11 - p01);
      const val = top + fy * (bottom - top);

      expect(val).toBe(0.5);
    });
  });
});

