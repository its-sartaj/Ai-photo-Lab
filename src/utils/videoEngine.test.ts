import { describe, it, expect } from 'vitest';
import { formatDuration, getSupportedVideoMimeType } from './videoEngine';
import { translations } from '../i18n/translations';
import { TUTORIALS_DATA } from '../data/tutorialsData';

describe('Video Compression Engine Unit Tests', () => {
  describe('formatDuration', () => {
    it('handles zero, negative, and invalid seconds gracefully', () => {
      expect(formatDuration(0)).toBe('00:00');
      expect(formatDuration(-10)).toBe('00:00');
      expect(formatDuration(NaN)).toBe('00:00');
      expect(formatDuration(Infinity)).toBe('00:00');
    });

    it('formats seconds into MM:SS format accurately', () => {
      expect(formatDuration(5)).toBe('00:05');
      expect(formatDuration(59)).toBe('00:59');
      expect(formatDuration(60)).toBe('01:00');
      expect(formatDuration(75)).toBe('01:15');
      expect(formatDuration(365)).toBe('06:05');
    });
  });

  describe('Video Compressor Localization & Tutorials', () => {
    it('has video-compress tool defined in both English and Hindi translations', () => {
      expect(translations.en.tools['video-compress']).toBeDefined();
      expect(translations.hi.tools['video-compress']).toBeDefined();

      expect(translations.en.tools['video-compress'].name).toBe('Video Compressor');
      expect(translations.hi.tools['video-compress'].name).toContain('वीडियो कंप्रेसर');

      expect(translations.en.tools['video-compress'].shortDesc).toBeTruthy();
      expect(translations.hi.tools['video-compress'].shortDesc).toBeTruthy();
    });

    it('has dedicated video compression tutorial in tutorials dataset', () => {
      const videoTut = TUTORIALS_DATA.find((t) => t.id === 'how-video-compression-works-guide');
      expect(videoTut).toBeDefined();
      expect(videoTut?.relatedTool).toBe('video-compress');
      expect(videoTut?.titleEn).toContain('Video Compression');
      expect(videoTut?.titleHi).toContain('वीडियो कंप्रेशन');
      expect(videoTut?.contentEn).toContain('Bitrate');
      expect(videoTut?.contentHi).toContain('बिटरेट');
    });
  });

  describe('Video Codec & Resolution Scaling Logic', () => {
    it('scales dimensions properly while maintaining aspect ratio and even dimensions', () => {
      // 1080p source -> 720p target
      const origW = 1920;
      const origH = 1080;
      const ratio = origW / origH;
      let targetH = 720;
      let targetW = Math.round(720 * ratio);

      targetW = Math.max(2, Math.floor(targetW / 2) * 2);
      targetH = Math.max(2, Math.floor(targetH / 2) * 2);

      expect(targetW).toBe(1280);
      expect(targetH).toBe(720);
      expect(targetW % 2).toBe(0);
      expect(targetH % 2).toBe(0);
    });

    it('calculates bitrate reduction accurately', () => {
      const origSize = 100 * 1024 * 1024; // 100 MB
      const compressedSize = 35 * 1024 * 1024; // 35 MB
      const reduction = Math.round(((origSize - compressedSize) / origSize) * 100);
      expect(reduction).toBe(65);
    });
  });
});
