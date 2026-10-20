import { MediaMetadata } from '../types';

const CACHE_KEY = 'driasave_media_cache_v1';
const HISTORY_KEY = 'driasave_download_history_v1';

export function getCachedMedia(url: string): MediaMetadata | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cacheMap: Record<string, MediaMetadata> = JSON.parse(raw);
    const item = cacheMap[url.trim()];
    if (!item) return null;
    // Expire cache after 48 hours
    if (Date.now() - (item.cachedAt || 0) > 48 * 60 * 60 * 1000) {
      delete cacheMap[url.trim()];
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheMap));
      return null;
    }
    return item;
  } catch {
    return null;
  }
}

export function saveCachedMedia(url: string, data: MediaMetadata): void {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const cacheMap: Record<string, MediaMetadata> = raw ? JSON.parse(raw) : {};
    cacheMap[url.trim()] = { ...data, cachedAt: Date.now() };
    
    // Maintain maximum 30 cached items
    const keys = Object.keys(cacheMap);
    if (keys.length > 30) {
      delete cacheMap[keys[0]];
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheMap));
  } catch {
    // Ignore storage quota errors
  }
}

export function clearMediaCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // Ignore
  }
}

export function getDownloadHistory(): MediaMetadata[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addDownloadHistory(item: MediaMetadata): void {
  try {
    const list = getDownloadHistory();
    const filtered = list.filter((i) => i.id !== item.id);
    const updated = [item, ...filtered].slice(0, 15);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Ignore
  }
}
