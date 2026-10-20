export type SupportedPlatform =
  | 'tiktok'
  | 'instagram'
  | 'youtube'
  | 'facebook'
  | 'twitter'
  | 'threads'
  | 'pinterest'
  | 'general';

export type ContentType = 'video' | 'carousel';

export type ResolutionOption =
  | 'auto'
  | '1080p'
  | '720p'
  | '480p'
  | '360p'
  | 'audio_320'
  | 'audio_128';

export interface FormatItem {
  id: string;
  label: string;
  resolution: string;
  type: 'video' | 'audio';
  extension: string;
  qualityBadge: string;
  sizeStr: string;
  sizeBytes: number;
  isRecommended: boolean;
  downloadUrl: string;
}

export interface SlideItem {
  id: string;
  index: number;
  url: string;
  title: string;
  width: number;
  height: number;
}

export interface MediaMetadata {
  id: string;
  originalUrl: string;
  platform: SupportedPlatform;
  platformLabel: string;
  contentType: ContentType;
  title: string;
  author: string;
  authorUsername: string;
  authorAvatar?: string;
  duration?: string;
  thumbnail: string;
  sourceResolution?: string;
  sourcePixels?: number;
  slides?: SlideItem[];
  formats: FormatItem[];
  viewsCount?: string;
  likesCount?: string;
  cachedAt?: number;
}

export interface DownloadProgressState {
  active: boolean;
  filename: string;
  formatLabel: string;
  progress: number;
  speed: string;
  downloadedMB: number;
  totalMB: number;
  timeRemaining: string;
  finished: boolean;
}

export type FontSizeSetting = 'sm' | 'base' | 'lg'; // 15px, 17px, 19px
export type LanguageSetting = 'id' | 'en';
export type ThemeSetting = 'light' | 'dark';
