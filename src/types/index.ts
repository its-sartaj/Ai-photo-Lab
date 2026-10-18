export type Language = 'en' | 'hi';

export type ToolId =
  | 'compress'
  | 'resize'
  | 'convert'
  | 'crop'
  | 'passport'
  | 'cutout'
  | 'video-compress';

export type PageView =
  | 'home'
  | 'tool'
  | 'tutorials'
  | 'tutorial-detail'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'disclaimer';

export interface ProcessedImageResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  fileSizeBytes: number;
  format: string;
  filename: string;
}

export interface VideoMetadata {
  filename: string;
  sizeBytes: number;
  durationSeconds: number;
  width: number;
  height: number;
  format: string;
}

export interface ProcessedVideoResult {
  blob: Blob;
  objectUrl: string;
  sizeBytes: number;
  width: number;
  height: number;
  durationSeconds: number;
  format: string;
  extension: string;
  reductionPercent: number;
  isLargerThanOriginal: boolean;
}

export interface TutorialItem {
  id: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  readTime: string;
  category: string;
  categoryHi: string;
  date: string;
  contentEn: string;
  contentHi: string;
  relatedTool?: ToolId;
}
