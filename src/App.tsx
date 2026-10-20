import React, { useState, useEffect } from 'react';
import {
  DownloadProgressState,
  FontSizeSetting,
  FormatItem,
  LanguageSetting,
  MediaMetadata,
  ResolutionOption,
  SlideItem,
  ThemeSetting,
} from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { DownloaderSection } from './components/DownloaderSection';
import { MediaResultCard } from './components/MediaResultCard';
import { AdSlot } from './components/AdSlot';
import { AdSlot300x250 } from './components/AdSlot300x250';
import { FeaturesSection } from './components/FeaturesSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { DownloadProgressBar } from './components/DownloadProgressBar';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { InfoModals, ModalType } from './components/InfoModals';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import { generateMediaMetadata } from './utils/urlParser';
import { fetchAccurateMedia } from './utils/realMediaFetcher';
import { addDownloadHistory, saveCachedMedia } from './utils/cache';
import { downloadSlidesAsZip } from './utils/zipDownloader';
import { Bell, Check, X, Download, RefreshCw } from 'lucide-react';

export default function App() {
  // Activate lightweight scroll animation hook
  useScrollAnimation();

  // Theme state (persisted, default dark)
  const [theme, setTheme] = useState<ThemeSetting>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('driasave_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark';
    }
    return 'dark';
  });

  // Language state (default id)
  const [lang, setLang] = useState<LanguageSetting>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('driasave_lang');
      if (saved === 'en' || saved === 'id') return saved;
    }
    return 'id';
  });

  // Font size state (sm: 15px, base: 17px, lg: 19px)
  const [fontSize, setFontSize] = useState<FontSizeSetting>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('driasave_font_size');
      if (saved === 'sm' || saved === 'base' || saved === 'lg') return saved;
    }
    return 'base';
  });

  // Downloader & Media states
  const [targetResolution, setTargetResolution] = useState<ResolutionOption>('1080p');
  const [currentUrl, setCurrentUrl] = useState('');
  const [media, setMedia] = useState<MediaMetadata | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Download progress bar state
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgressState>({
    active: false,
    filename: '',
    formatLabel: '',
    progress: 0,
    speed: '24.2 MB/s',
    downloadedMB: 0,
    totalMB: 0,
    timeRemaining: '2s',
    finished: false,
  });

  // Modals state & Notifications
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('driasave_notifications') === 'true';
    }
    return false;
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Normalize and clean URL if trailing /l or /l/ is detected on initial open
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname === '/l' || pathname === '/l/' || pathname.endsWith('/l')) {
        const cleanPath = pathname.replace(/\/l\/?$/, '') || '/';
        window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
      }
    }
  }, []);

  // Apply Theme & Font Size to Document Root
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('theme-dark');
      body.classList.remove('theme-light');
    } else {
      root.classList.remove('dark');
      body.classList.add('theme-light');
      body.classList.remove('theme-dark');
    }
    localStorage.setItem('driasave_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-sm', 'font-base', 'font-lg');
    root.classList.add(`font-${fontSize}`);
    localStorage.setItem('driasave_font_size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('driasave_lang', lang);
  }, [lang]);

  // Check initial notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      }
    }
  }, []);

  // Auto-dismiss toast after 3.5 seconds
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleToggleNotifications = async () => {
    const nextState = !notificationsEnabled;
    setNotificationsEnabled(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('driasave_notifications', String(nextState));
    }

    if (nextState) {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        try {
          if (Notification.permission === 'granted') {
            new Notification('DriaSave by Driacom', {
              body: lang === 'id'
                ? 'Notifikasi aktif! Pembaruan server & download siap digunakan.'
                : 'Notifications enabled! Server speed & download updates are active.',
              icon: '/icon.svg',
            });
          } else if (Notification.permission !== 'denied') {
            const perm = await Notification.requestPermission();
            if (perm === 'granted') {
              new Notification('DriaSave by Driacom', {
                body: lang === 'id' ? 'Notifikasi aktif!' : 'Notifications active!',
                icon: '/icon.svg',
              });
            }
          }
        } catch {
          // Handled if restricted in iframe or browser security settings
        }
      }
      setToastMessage(
        lang === 'id'
          ? 'Notifikasi diaktifkan! Anda akan menerima informasi pembaruan fitur secara berkala.'
          : 'Notifications enabled! You will receive live updates on server status & download features.'
      );
    } else {
      setToastMessage(
        lang === 'id'
          ? 'Notifikasi telah dinonaktifkan.'
          : 'Notifications have been disabled.'
      );
    }
  };

  // Process URL handler with real accurate media fetching
  const handleProcessUrl = async (urlToProcess: string, resolution: ResolutionOption) => {
    if (!urlToProcess.trim()) return;

    setCurrentUrl(urlToProcess);
    setMedia(null); // Reset previous media so old data is immediately cleared
    setIsProcessing(true);

    try {
      // Fetch accurate real media metadata directly from live APIs
      const newMedia = await fetchAccurateMedia(urlToProcess, resolution);
      setMedia(newMedia);
      setFromCache(false);
      setIsProcessing(false);

      // Cache and record to history
      saveCachedMedia(urlToProcess, newMedia);
      addDownloadHistory(newMedia);

      // Automatically scroll smoothly directly to download area
      setTimeout(() => {
        const resultElem = document.getElementById('media-result');
        if (resultElem) {
          resultElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } catch {
      // Graceful fallback to generator
      const fallbackMedia = generateMediaMetadata(urlToProcess, resolution);
      setMedia(fallbackMedia);
      setFromCache(false);
      setIsProcessing(false);

      setTimeout(() => {
        const resultElem = document.getElementById('media-result');
        if (resultElem) {
          resultElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

  // Real file delivery & download execution
  const executeRealFileDownload = async (
    targetUrl: string,
    filename: string,
    formatLabel: string,
    totalMB: number,
    ext: string
  ) => {
    const sanitizedName =
      filename
        .replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF -]/g, '')
        .trim()
        .slice(0, 75) || 'DriaSave_Media';
    const finalFilename = `${sanitizedName}.${ext}`;

    const endpoint = targetUrl.startsWith('/api/download')
      ? targetUrl
      : `/api/download?url=${encodeURIComponent(targetUrl)}&filename=${encodeURIComponent(finalFilename)}`;

    // 1. Initialize strictly at 0%
    setDownloadProgress({
      active: true,
      filename: finalFilename,
      formatLabel,
      progress: 0,
      speed: '18.4 MB/s',
      downloadedMB: 0,
      totalMB,
      timeRemaining: `${Math.max(1, Math.round(totalMB / 18.4))}s`,
      finished: false,
    });

    // 2. Continuous real-time smooth progress simulation while streaming
    let currentPct = 0;
    const progressInterval = setInterval(() => {
      if (currentPct < 96) {
        const step = currentPct < 30 ? 6 + Math.random() * 5 : currentPct < 75 ? 4 + Math.random() * 4 : 2 + Math.random() * 2;
        currentPct = Math.min(96, currentPct + step);
        const downloaded = parseFloat(((currentPct / 100) * totalMB).toFixed(1));
        const liveSpeed = (16.0 + Math.random() * 6.0).toFixed(1);
        const remainingMb = Math.max(0, totalMB - downloaded);
        const remainingSec = Math.max(1, Math.round(remainingMb / parseFloat(liveSpeed)));

        setDownloadProgress((prev) => {
          if (!prev.active || prev.finished) return prev;
          return {
            ...prev,
            progress: Math.round(currentPct),
            downloadedMB: downloaded,
            speed: `${liveSpeed} MB/s`,
            timeRemaining: `${remainingSec}s`,
          };
        });
      }
    }, 100);

    const finishDownload = () => {
      clearInterval(progressInterval);
      setDownloadProgress((prev) => ({
        ...prev,
        progress: 100,
        downloadedMB: totalMB,
        speed: '0 MB/s',
        timeRemaining: '0s',
        finished: true,
      }));
    };

    // 3. Trigger native file stream delivery directly to the user's Downloads folder
    // This allows files of any length/size (even 45-minute videos of several hundred megabytes)
    // to stream smoothly without in-memory JavaScript blob restrictions.
    try {
      const a = document.createElement('a');
      a.href = endpoint;
      a.download = finalFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Finish progress animation smoothly
      setTimeout(() => {
        finishDownload();
      }, 1400);
    } catch (err) {
      clearInterval(progressInterval);
      setDownloadProgress((prev) => ({ ...prev, active: false }));
      console.error('Download execution failed:', err);
    }
  };

  const handleDownloadFormat = (format: FormatItem) => {
    const totalMbNum =
      format.sizeBytes > 0
        ? parseFloat((format.sizeBytes / (1024 * 1024)).toFixed(1))
        : (parseFloat(format.sizeStr.replace(/[^0-9.]/g, '')) || 5.0);
    const cleanTitle = media?.title || 'DriaSave_Media';
    executeRealFileDownload(format.downloadUrl, cleanTitle, format.label, totalMbNum, format.extension);
  };

  const handleDownloadSlide = (slide: SlideItem) => {
    executeRealFileDownload(slide.url, slide.title, lang === 'id' ? 'Foto Resolusi Penuh' : 'Full Resolution Photo', 3.2, 'jpg');
  };

  const handleDownloadAllSlides = async (slides: SlideItem[]) => {
    const cleanTitle = media?.title || 'DriaSave_Slides';
    const totalEstMB = parseFloat((slides.length * 2.8).toFixed(1));

    // Initialize strictly at 0%
    setDownloadProgress({
      active: true,
      filename: `${cleanTitle}_All_Slides.zip`,
      formatLabel: lang === 'id' ? 'Arsip ZIP Foto HD' : 'HD Photos ZIP Archive',
      progress: 0,
      speed: '24.5 MB/s',
      downloadedMB: 0,
      totalMB: totalEstMB,
      timeRemaining: `${Math.max(1, Math.round(totalEstMB / 24.5))}s`,
      finished: false,
    });

    try {
      await downloadSlidesAsZip(slides, cleanTitle, (p) => {
        const liveSpeed = (20.0 + Math.random() * 8.0).toFixed(1);
        const downloaded = parseFloat(((p.percent / 100) * totalEstMB).toFixed(1));
        const remMb = Math.max(0, totalEstMB - downloaded);
        const remSec = Math.max(1, Math.round(remMb / parseFloat(liveSpeed)));

        setDownloadProgress((prev) => ({
          ...prev,
          progress: Math.min(100, Math.round(p.percent)),
          downloadedMB: downloaded,
          speed: p.percent >= 100 ? '0 MB/s' : `${liveSpeed} MB/s`,
          timeRemaining: p.percent >= 100 ? '0s' : `${remSec}s`,
          finished: p.percent >= 100,
        }));
      });
    } catch (err) {
      console.error('ZIP generation failed, using sequential download fallback:', err);
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const filename = `${cleanTitle}_Foto_${i + 1}`;
        executeRealFileDownload(slide.url, filename, `Foto #${i + 1}`, 3.2, 'jpg');
        await new Promise((r) => setTimeout(r, 450));
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200 bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
      {/* Lightweight Top Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Modern Ambient Glow Accent */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-blue-500/12 via-indigo-500/6 to-transparent blur-3xl rounded-full dark:from-blue-600/15 dark:via-indigo-600/8" />
      </div>

      {/* Header */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        lang={lang}
        onChangeLang={setLang}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={handleToggleNotifications}
        onOpenModal={(modal) => setActiveModal(modal)}
      />

      {/* Toast Notification Alert Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-full bg-white dark:bg-[#111827] border border-blue-500/40 dark:border-blue-500/50 shadow-2xl rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
            {notificationsEnabled ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          </div>
          <div className="flex-1 text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
            {toastMessage}
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top High-CTR Header Ad Slot (Above Hero & Downloader) */}
        <div className="w-full mb-4">
          <AdSlot type="header-wide" />
        </div>

        {/* 1. HERO SECTION */}
        <HeroSection lang={lang} />

        {/* 2. HIGH CTR LEADERBOARD AD (Slot 5462390377) */}
        <div className="w-full my-4">
          <AdSlot type="header-wide" />
        </div>

        {/* 3. DOWNLOADER CONSOLE & LAYOUT (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Area: Downloader, Result, Features, FAQ */}
          <div className="lg:col-span-8 space-y-8">
            {/* Area Salin Link */}
            <div className="scroll-reveal">
              <DownloaderSection
                lang={lang}
                targetResolution={targetResolution}
                onChangeResolution={(res) => setTargetResolution(res)}
                onProcessUrl={handleProcessUrl}
                isProcessing={isProcessing}
                initialUrl={currentUrl}
              />
            </div>

            {/* Ad Slot Below Downloader Input - Hidden when media result is displayed so download area is 100% clean */}
            {!media && !isProcessing && (
              <div className="w-full">
                <AdSlot type="below-input" />
              </div>
            )}

            {/* Prominent Animated Loading Card when fetching media */}
            {isProcessing && (
              <div id="processing-loader" className="w-full bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-blue-500/40 dark:border-blue-500/50 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center max-w-md mx-auto space-y-4">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-2xl bg-blue-500/20 animate-ping" />
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                      <Download className="w-7 h-7 animate-bounce" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {lang === 'id' ? 'Sedang Mengambil Media...' : 'Fetching Media Streams...'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === 'id'
                        ? 'Mengekstrak stream kualitas asli tanpa watermark dan deteksi slide carousel'
                        : 'Extracting original watermark-free streams and photo carousel slides'}
                    </p>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="w-full space-y-2 pt-2">
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 rounded-full animate-progress" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>{lang === 'id' ? 'Mengekstrak stream kualitas asli' : 'Extracting original media quality'}</span>
                      </span>
                      <span className="font-mono text-slate-400">Driacom Server Engine</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Media Result Card (Scroll target) - Pure, clean, no ads here! */}
            {media && (
              <div id="media-result" className="scroll-mt-24 animate-in fade-in slide-in-from-top-4 duration-300">
                <MediaResultCard
                  media={media}
                  lang={lang}
                  fromCache={fromCache}
                  onDownloadFormat={handleDownloadFormat}
                  onDownloadSlide={handleDownloadSlide}
                  onDownloadAllSlides={handleDownloadAllSlides}
                />
              </div>
            )}

            {/* Content Responsive Display Ad Slot - Hidden when download area is active */}
            {!media && (
              <div className="my-6">
                <AdSlot type="content-mid" />
              </div>
            )}

            {/* Features Showcase */}
            <FeaturesSection lang={lang} />

            {/* In-Content High CTR Ad Slot Between Features and FAQ */}
            <div className="my-6">
              <AdSlot type="between-sections" />
            </div>

            {/* FAQ Accordion Section */}
            <FAQSection lang={lang} />
          </div>

          {/* Desktop Right Sidebar & Sticky Sidebar Ads */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Sidebar Ad (Slot 1222928318) - Asli */}
              <AdSlot type="sidebar" />
              {/* Sticky Sidebar Ad (Slot 5462390377) - Asli */}
              <AdSlot type="sticky-sidebar" />
              {/* Tambahan Slot Iklan 300x250 di Sidebar Kanan Sesuai Permintaan */}
              <AdSlot300x250 slotId="1116459861" key="right-ad-1" />
              <AdSlot300x250 slotId="1116459861" key="right-ad-2" />
            </div>
          </aside>
        </div>

        {/* 1 Slot Iklan Antara FAQ dan Footer - Menggunakan Iklan Header (Slot 5462390377) */}
        <div className="w-full my-6 sm:my-8">
          <AdSlot type="header-wide" />
        </div>
      </main>

      {/* Footer (Centered Copyright & Created by Driacom) */}
      <Footer lang={lang} onOpenModal={(type) => setActiveModal(type)} />

      {/* Back To Top Button with Smooth Scroll */}
      <BackToTop />

      {/* Download Progress Modal */}
      <DownloadProgressBar
        progressState={downloadProgress}
        onClose={() => setDownloadProgress((prev) => ({ ...prev, active: false }))}
        lang={lang}
      />

      {/* Info & Legal Modals */}
      <InfoModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        lang={lang}
      />
    </div>
  );
}
