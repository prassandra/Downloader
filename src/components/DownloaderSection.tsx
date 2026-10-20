import React, { useState, useEffect, useRef } from 'react';
import {
  Link as LinkIcon,
  ClipboardPaste,
  RefreshCw,
  X,
  Check,
  AlertCircle,
  Film,
  Images,
  ArrowRight,
  SlidersHorizontal,
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { LanguageSetting, ResolutionOption } from '../types';
import { translations } from '../utils/translations';
import { identifyPlatform } from '../utils/urlParser';

interface DownloaderSectionProps {
  lang: LanguageSetting;
  targetResolution: ResolutionOption;
  onChangeResolution: (res: ResolutionOption) => void;
  onProcessUrl: (url: string, resolution: ResolutionOption) => void;
  isProcessing: boolean;
  initialUrl?: string;
}

export const DownloaderSection: React.FC<DownloaderSectionProps> = ({
  lang,
  targetResolution,
  onChangeResolution,
  onProcessUrl,
  isProcessing,
  initialUrl = '',
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);
  const [detectedType, setDetectedType] = useState<'video' | 'carousel' | null>(null);
  const [clipboardUrl, setClipboardUrl] = useState<string | null>(null);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pasteErrorTimerRef = useRef<NodeJS.Timeout | null>(null);

  const t = translations[lang];

  const clearPasteError = () => {
    if (pasteErrorTimerRef.current) {
      clearTimeout(pasteErrorTimerRef.current);
      pasteErrorTimerRef.current = null;
    }
    setPasteError(null);
  };

  useEffect(() => {
    if (url.trim().length > 8) {
      const parsed = identifyPlatform(url);
      setDetectedPlatform(parsed.platformLabel);
      setDetectedType(parsed.isCarousel ? 'carousel' : 'video');
    } else {
      setDetectedPlatform(null);
      setDetectedType(null);
    }
  }, [url]);

  // Automatically detect and pre-fill input on window focus or visibility change if valid social media URL is found in clipboard
  useEffect(() => {
    const handleCheckClipboard = async () => {
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          const trimmed = text ? text.trim() : '';
          if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            const lower = trimmed.toLowerCase();
            const isSocialUrl =
              lower.includes('tiktok.com') ||
              lower.includes('douyin.com') ||
              lower.includes('instagram.com') ||
              lower.includes('instagr.am') ||
              lower.includes('youtube.com') ||
              lower.includes('youtu.be') ||
              lower.includes('twitter.com') ||
              lower.includes('x.com') ||
              lower.includes('facebook.com') ||
              lower.includes('fb.watch') ||
              lower.includes('threads.net') ||
              lower.includes('pinterest.com') ||
              lower.includes('pin.it') ||
              lower.includes('reddit.com') ||
              lower.includes('snackvideo.com') ||
              lower.includes('kuaishou.com');

            if (isSocialUrl && trimmed !== url.trim()) {
              setUrl(trimmed);
              setPasteError(null);
              const parsed = identifyPlatform(trimmed);
              setDetectedPlatform(parsed.platformLabel);
              setDetectedType(parsed.isCarousel ? 'carousel' : 'video');
            }
          }
        }
      } catch {
        // Silently catch clipboard permission errors on focus
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        handleCheckClipboard();
      }
    };

    window.addEventListener('focus', handleCheckClipboard);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('focus', handleCheckClipboard);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [url]);

  const handlePasteButtonClick = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    clearPasteError();

    // 0. If user already entered a link in input, clicking paste button immediately processes it
    if (url.trim().length > 5 && (url.trim().startsWith('http://') || url.trim().startsWith('https://'))) {
      onProcessUrl(url.trim(), targetResolution);
      return;
    }

    let pastedText = '';
    let readThrewError = false;

    // 1. Primary: Use modern Clipboard API readText
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
        pastedText = await navigator.clipboard.readText();
      }
    } catch (err: any) {
      readThrewError = true;
      console.warn('Clipboard readText restricted:', err);
    }

    // 2. Secondary fallback: Use navigator.clipboard.read() if readText was blocked or empty
    if (!pastedText && typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.read) {
      try {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          if (item.types.includes('text/plain')) {
            const blob = await item.getType('text/plain');
            pastedText = await blob.text();
            break;
          }
        }
      } catch {
        readThrewError = true;
      }
    }

    // 3. Fallback: check session storage if a link was recently copied in app
    if (!pastedText) {
      try {
        const stored = sessionStorage.getItem('driasave_last_copied_link') || localStorage.getItem('driasave_last_copied_link');
        if (stored && (stored.startsWith('http://') || stored.startsWith('https://'))) {
          pastedText = stored;
        }
      } catch {
        // Storage restricted
      }
    }

    const trimmed = pastedText ? pastedText.trim() : '';

    if (trimmed) {
      clearPasteError();
      setUrl(trimmed);
      setClipboardUrl(null);
      setPasteSuccess(true);
      setTimeout(() => setPasteSuccess(false), 2500);

      // Instantly recognize platform and update input
      const parsed = identifyPlatform(trimmed);
      setDetectedPlatform(parsed.platformLabel);
      setDetectedType(parsed.isCarousel ? 'carousel' : 'video');

      if (inputRef.current) {
        inputRef.current.value = trimmed;
      }

      // Automatically trigger extraction if it's a valid link
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        onProcessUrl(trimmed, targetResolution);
      }
      return;
    }

    // Always focus the input field so Android Gboard clipboard chip or native paste popover appears
    inputRef.current?.focus();
    inputRef.current?.select();

    // Differentiate between security permission restrictions in iframes vs empty clipboard
    if (readThrewError) {
      setPasteError(
        lang === 'id'
          ? 'Peramban membatasi baca otomatis: Silakan ketuk tombol Tempel di atas keyboard atau tekan tahan kolom input.'
          : 'Browser restricted auto-paste: Please tap the Paste button on your keyboard or long-press the field.'
      );
    } else {
      setPasteError(
        lang === 'id'
          ? 'Papan klip masih kosong. Silakan salin link video TikTok atau Instagram terlebih dahulu.'
          : 'Clipboard is empty. Please copy a video link from TikTok or Instagram first.'
      );
    }

    pasteErrorTimerRef.current = setTimeout(() => {
      setPasteError(null);
      pasteErrorTimerRef.current = null;
    }, 4500);
  };

  const handleApplyClipboardDetected = () => {
    if (clipboardUrl) {
      setUrl(clipboardUrl);
      const toProcess = clipboardUrl;
      setClipboardUrl(null);
      onProcessUrl(toProcess, targetResolution);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onProcessUrl(url.trim(), targetResolution);
    }
  };

  return (
    <section className="relative w-full pt-1 pb-4">
      <div className="w-full">
        {/* Floating Clipboard Notification */}
        {clipboardUrl && (
          <div className="mb-4 p-3 rounded-2xl bg-white dark:bg-[#111827] border border-blue-500/40 dark:border-blue-500/50 shadow-lg shadow-blue-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                <ClipboardPaste className="w-4 h-4" />
              </span>
              <div className="truncate">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {t.clipboardDetected}
                </span>
                <span className="text-xs font-mono text-blue-600 dark:text-blue-400 truncate block">
                  {clipboardUrl}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={handleApplyClipboardDetected}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>{t.clipboardPasteAction}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setClipboardUrl(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Extraction Card Console */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 sm:p-7 shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-800 relative">
          {/* Card Header SEO Words & Badges */}
          <div className="mb-6 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/80 shadow-2xs">
              <Zap className="w-3 h-3 text-blue-500 fill-blue-500" />
              <span>{t.downloaderCardKicker}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-snug">
              {t.downloaderCardTitle}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {t.downloaderCardDesc}
            </p>

            {/* Micro Feature Badges */}
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>{t.badgeNoWm}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60">
                <CheckCircle2 className="w-3 h-3 text-blue-500" />
                <span>{t.badgeFullHd}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60">
                <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                <span>{t.badgeMp3Hq}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200/70 dark:border-violet-800/60">
                <CheckCircle2 className="w-3 h-3 text-violet-500" />
                <span>{t.badgeSlideBatch}</span>
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Unified Input Bar with Integrated Paste & Clear Action */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <LinkIcon className="w-4 h-4" />
              </div>

              <input
                ref={inputRef}
                type="url"
                value={url}
                onFocus={() => clearPasteError()}
                onChange={(e) => {
                  clearPasteError();
                  setUrl(e.target.value);
                }}
                onPaste={(e) => {
                  clearPasteError();
                  const pasted = e.clipboardData.getData('text');
                  if (pasted) {
                    const trimmed = pasted.trim();
                    setUrl(trimmed);
                    const parsed = identifyPlatform(trimmed);
                    setDetectedPlatform(parsed.platformLabel);
                    setDetectedType(parsed.isCarousel ? 'carousel' : 'video');
                  }
                }}
                placeholder={t.inputPlaceholder}
                className={`w-full pl-11 ${
                  url ? 'pr-40 sm:pr-44' : 'pr-32 sm:pr-36'
                } py-3.5 sm:py-4 rounded-2xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white font-medium text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all`}
                required
              />

              {/* Actions inside input bar on the right */}
              <div className="absolute inset-y-0 right-2 flex items-center gap-1.5">
                {url && (
                  <button
                    type="button"
                    onClick={() => {
                      setUrl('');
                      setDetectedPlatform(null);
                      inputRef.current?.focus();
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    title={t.clearBtn}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handlePasteButtonClick}
                  className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer ${
                    pasteSuccess
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-blue-600 hover:bg-blue-500'
                  }`}
                  title={t.pasteBtn}
                >
                  {pasteSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white animate-in zoom-in-75 duration-150" />
                      <span>{t.pasteSuccessBtn || 'Tertempel!'}</span>
                    </>
                  ) : (
                    <>
                      <ClipboardPaste className="w-3.5 h-3.5" />
                      <span>{t.pasteBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Detected Platform Tag if URL entered */}
            {detectedPlatform && url && (
              <div className="flex items-center gap-2 px-1">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5 shadow-2xs">
                  {detectedType === 'carousel' ? (
                    <Images className="w-3 h-3 text-pink-500" />
                  ) : (
                    <Film className="w-3 h-3 text-blue-500" />
                  )}
                  <span>Platform: {detectedPlatform}</span>
                </span>
              </div>
            )}

            {pasteError && (
              <div className="flex items-center justify-between gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl px-3 py-2 font-medium animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                  <span>{pasteError}</span>
                </div>
                <button
                  type="button"
                  onClick={clearPasteError}
                  className="p-1 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-500 dark:text-amber-400 transition-colors shrink-0 cursor-pointer"
                  aria-label="Dismiss notice"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Resolution Selector & Action Button Row */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <label
                  htmlFor="resSelect"
                  className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shrink-0"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{t.resolutionSelectorLabel}</span>
                </label>
                <div className="relative flex-1 sm:w-64">
                  <select
                    id="resSelect"
                    value={targetResolution}
                    onChange={(e) => {
                      const newRes = e.target.value as ResolutionOption;
                      onChangeResolution(newRes);
                      if (url.trim()) {
                        onProcessUrl(url.trim(), newRes);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="auto">{t.resAuto}</option>
                    <option value="1080p">{t.res1080p}</option>
                    <option value="720p">{t.res720p}</option>
                    <option value="480p">{t.res480p}</option>
                    <option value="360p">{t.res360p}</option>
                    <option value="audio_320">{t.resAudio320}</option>
                    <option value="audio_128">{t.resAudio128}</option>
                  </select>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isProcessing || !url.trim()}
                className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-40 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t.processingBtn}</span>
                  </>
                ) : (
                  <>
                    <span>{t.processBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick 3-Step Guide & SEO Platform Support Strip */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>{t.seoStepsTitle}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {t.seoStep1Title}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                  {t.seoStep1Desc}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {t.seoStep2Title}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                  {t.seoStep2Desc}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {t.seoStep3Title}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                  {t.seoStep3Desc}
                </p>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed bg-slate-50/50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center sm:text-left">
              {t.seoSupportedKeywords}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
