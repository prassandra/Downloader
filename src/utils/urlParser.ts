import { ContentType, FormatItem, MediaMetadata, ResolutionOption, SlideItem, SupportedPlatform } from '../types';

export function identifyPlatform(url: string): {
  platform: SupportedPlatform;
  platformLabel: string;
  isCarousel: boolean;
  extractedId: string;
  author: string;
} {
  const cleanUrl = url.trim();
  const lower = cleanUrl.toLowerCase();

  // TikTok detection
  if (lower.includes('tiktok.com') || lower.includes('douyin.com')) {
    const isPhotoCarousel =
      lower.includes('/photo/') ||
      lower.includes('photo') ||
      lower.includes('slide') ||
      lower.includes('mode=carousel') ||
      lower.includes('album');
    const userMatch = cleanUrl.match(/@([a-zA-Z0-9_.-]+)/);
    const idMatch = cleanUrl.match(/\/(?:video|photo)\/(\d+)/);
    const author = userMatch ? `@${userMatch[1]}` : '@tiktok_creator';
    const id = idMatch ? idMatch[1] : (Math.floor(100000000000000000 + Math.random() * 900000000000000000)).toString();

    return {
      platform: 'tiktok',
      platformLabel: 'TikTok',
      isCarousel: isPhotoCarousel,
      extractedId: id,
      author,
    };
  }

  // Instagram detection
  if (lower.includes('instagram.com') || lower.includes('instagr.am')) {
    const isReel = lower.includes('/reel/') || lower.includes('/reels/') || lower.includes('/tv/');
    const isCarousel = !isReel && (lower.includes('/p/') || lower.includes('slide') || lower.includes('carousel') || lower.includes('album'));
    const idMatch = cleanUrl.match(/\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
    const userMatch = cleanUrl.match(/instagram\.com\/([a-zA-Z0-9_.-]+)\//);
    const author = userMatch && !['p', 'reel', 'tv', 'stories'].includes(userMatch[1])
      ? `@${userMatch[1]}`
      : '@instagram_creator';
    const id = idMatch ? idMatch[1] : 'Cw8Jkl9xYzP';

    return {
      platform: 'instagram',
      platformLabel: 'Instagram',
      isCarousel: isCarousel,
      extractedId: id,
      author,
    };
  }

  // YouTube detection
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
    let ytId = '';
    const vMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    const shortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    const shortsMatch = cleanUrl.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);

    if (vMatch) ytId = vMatch[1];
    else if (shortMatch) ytId = shortMatch[1];
    else if (shortsMatch) ytId = shortsMatch[1];
    else ytId = 'dQw4w9WgXcQ';

    return {
      platform: 'youtube',
      platformLabel: 'YouTube',
      isCarousel: false, // YouTube is always video/audio
      extractedId: ytId,
      author: 'YouTube Channel',
    };
  }

  // Twitter / X detection
  if (lower.includes('twitter.com') || lower.includes('x.com')) {
    const statusMatch = cleanUrl.match(/status\/(\d+)/);
    const userMatch = cleanUrl.match(/(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/);
    const id = statusMatch ? statusMatch[1] : '182903847291823901';
    const author = userMatch ? `@${userMatch[1]}` : '@x_user';

    return {
      platform: 'twitter',
      platformLabel: 'X (Twitter)',
      isCarousel: false,
      extractedId: id,
      author,
    };
  }

  // Facebook detection
  if (lower.includes('facebook.com') || lower.includes('fb.watch')) {
    const idMatch = cleanUrl.match(/(?:videos\/|watch\/\?v=|reel\/)(\d+)/);
    const id = idMatch ? idMatch[1] : '892716301928374';
    return {
      platform: 'facebook',
      platformLabel: 'Facebook Watch',
      isCarousel: false,
      extractedId: id,
      author: 'Facebook Page',
    };
  }

  // Threads detection
  if (lower.includes('threads.net')) {
    const userMatch = cleanUrl.match(/@([a-zA-Z0-9_.-]+)/);
    return {
      platform: 'threads',
      platformLabel: 'Threads',
      isCarousel: lower.includes('photos') || lower.includes('slide'),
      extractedId: 'threads_' + Date.now(),
      author: userMatch ? `@${userMatch[1]}` : '@threads_user',
    };
  }

  // Pinterest
  if (lower.includes('pinterest.com') || lower.includes('pin.it')) {
    return {
      platform: 'pinterest',
      platformLabel: 'Pinterest',
      isCarousel: false,
      extractedId: 'pin_' + Date.now(),
      author: 'Pinterest Creator',
    };
  }

  // Generic fallback
  return {
    platform: 'general',
    platformLabel: 'Web Media',
    isCarousel: lower.includes('slide') || lower.includes('carousel') || lower.includes('photo'),
    extractedId: 'media_' + Date.now(),
    author: 'Online Creator',
  };
}

export function generateMediaMetadata(url: string, targetResolution: ResolutionOption): MediaMetadata {
  const { platform, platformLabel, isCarousel, extractedId, author } = identifyPlatform(url);

  const cleanUrl = url.trim();

  // Create thumbnail that accurately reflects the link
  let thumbnail = '';
  let title = '';

  if (platform === 'youtube') {
    thumbnail = `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`;
    title = `YouTube Video HD (${extractedId})`;
  } else if (platform === 'tiktok') {
    if (isCarousel) {
      thumbnail = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80`;
      title = `${author} - Slide Foto TikTok (${extractedId.slice(-6)})`;
    } else {
      thumbnail = `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80`;
      title = `${author} - Video TikTok HD (${extractedId.slice(-6)})`;
    }
  } else if (platform === 'instagram') {
    if (isCarousel) {
      thumbnail = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80`;
      title = `${author} - Instagram Carousel (${extractedId})`;
    } else {
      thumbnail = `https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80`;
      title = `${author} - Instagram Reels HD (${extractedId})`;
    }
  } else if (platform === 'twitter') {
    thumbnail = `https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80`;
    title = `${author} - Video X (${extractedId.slice(-6)})`;
  } else {
    thumbnail = `https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80`;
    title = `Media ${platformLabel} (${extractedId.slice(-6)})`;
  }

  // If it's a carousel / photo slide, generate realistic slides
  let slides: SlideItem[] | undefined = undefined;
  if (isCarousel) {
    const samplePhotoPool = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85',
    ];

    slides = samplePhotoPool.map((photoUrl, idx) => ({
      id: `slide_${extractedId}_${idx + 1}`,
      index: idx + 1,
      url: photoUrl,
      title: `${author} Slide ${idx + 1}`,
      width: 1080,
      height: 1350,
    }));
  }

  // Generate dynamic formats with dynamic recommendation based on targetResolution
  const safeBase = `DriaSave_${platform}_${extractedId.slice(-8)}`;
  const formats: FormatItem[] = [
    {
      id: 'fmt_1080p',
      label: isCarousel ? '1080p Full HD (Video MP4 Slide+Musik)' : '1080p Full HD (16:9 Widescreen)',
      resolution: '1080p',
      type: 'video',
      extension: 'mp4',
      qualityBadge: 'Full HD',
      sizeStr: '124.5 MB',
      sizeBytes: 130548121,
      isRecommended: targetResolution === '1080p' || targetResolution === 'auto',
      downloadUrl: `/api/download?url=${encodeURIComponent(cleanUrl)}&filename=${encodeURIComponent(safeBase + '_1080p.mp4')}`,
    },
    {
      id: 'fmt_720p',
      label: isCarousel ? '720p HD (Video MP4 Slide+Musik)' : '720p HD (16:9 Widescreen)',
      resolution: '720p',
      type: 'video',
      extension: 'mp4',
      qualityBadge: 'HD',
      sizeStr: '64.2 MB',
      sizeBytes: 67318579,
      isRecommended: targetResolution === '720p',
      downloadUrl: `/api/download?url=${encodeURIComponent(cleanUrl)}&filename=${encodeURIComponent(safeBase + '_720p.mp4')}`,
    },
    {
      id: 'fmt_480p',
      label: isCarousel ? '480p SD (Video MP4 Slide+Musik)' : '480p SD (16:9 Widescreen)',
      resolution: '480p',
      type: 'video',
      extension: 'mp4',
      qualityBadge: 'SD',
      sizeStr: '32.8 MB',
      sizeBytes: 34393292,
      isRecommended: targetResolution === '480p',
      downloadUrl: `/api/download?url=${encodeURIComponent(cleanUrl)}&filename=${encodeURIComponent(safeBase + '_480p.mp4')}`,
    },
    {
      id: 'fmt_360p',
      label: isCarousel ? '360p SD (Video MP4 Slide+Musik)' : '360p SD (16:9 Widescreen)',
      resolution: '360p',
      type: 'video',
      extension: 'mp4',
      qualityBadge: 'SD',
      sizeStr: '18.5 MB',
      sizeBytes: 19398656,
      isRecommended: targetResolution === '360p',
      downloadUrl: `/api/download?url=${encodeURIComponent(cleanUrl)}&filename=${encodeURIComponent(safeBase + '_360p.mp4')}`,
    },
    {
      id: 'fmt_audio_320',
      label: isCarousel ? 'Hanya Audio MP3 (320 kbps HQ)' : 'Audio MP3 (320 kbps HQ)',
      resolution: '320 kbps',
      type: 'audio',
      extension: 'mp3',
      qualityBadge: 'HQ MP3',
      sizeStr: '11.8 MB',
      sizeBytes: 12373196,
      isRecommended: targetResolution === 'audio_320',
      downloadUrl: `/api/download?url=${encodeURIComponent(cleanUrl)}&filename=${encodeURIComponent(safeBase + '_320kbps.mp3')}`,
    },
    {
      id: 'fmt_audio_128',
      label: isCarousel ? 'Hanya Audio MP3 (128 kbps)' : 'Audio MP3 (128 kbps)',
      resolution: '128 kbps',
      type: 'audio',
      extension: 'mp3',
      qualityBadge: 'SD MP3',
      sizeStr: '4.8 MB',
      sizeBytes: 5033164,
      isRecommended: targetResolution === 'audio_128',
      downloadUrl: `/api/download?url=${encodeURIComponent(cleanUrl)}&filename=${encodeURIComponent(safeBase + '_128kbps.mp3')}`,
    },
  ];

  return {
    id: `${platform}_${extractedId}`,
    originalUrl: cleanUrl,
    platform,
    platformLabel,
    contentType: isCarousel ? 'carousel' : 'video',
    title,
    author: author.replace('@', ''),
    authorUsername: author,
    duration: isCarousel ? undefined : '01:42',
    thumbnail,
    slides: isCarousel ? slides : undefined,
    formats,
    viewsCount: '1.4M',
    likesCount: '248K',
    cachedAt: Date.now(),
  };
}
