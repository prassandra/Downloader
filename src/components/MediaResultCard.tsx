import React, { useState } from 'react';
import {
  Download,
  Film,
  Music,
  Images,
  CheckCircle2,
  Clock,
  User,
  Zap,
  Layers,
  Copy,
  Check,
  Sparkles,
  FileVideo,
  FileAudio,
  HardDrive,
  ShieldCheck,
  FolderArchive,
  Tv,
} from 'lucide-react';
import { FormatItem, LanguageSetting, MediaMetadata, SlideItem } from '../types';
import { translations } from '../utils/translations';

interface MediaResultCardProps {
  media: MediaMetadata;
  lang: LanguageSetting;
  fromCache?: boolean;
  onDownloadFormat: (format: FormatItem) => void;
  onDownloadSlide: (slide: SlideItem) => void;
  onDownloadAllSlides: (slides: SlideItem[]) => void;
}

export const MediaResultCard: React.FC<MediaResultCardProps> = ({
  media,
  lang,
  fromCache = false,
  onDownloadFormat,
  onDownloadSlide,
  onDownloadAllSlides,
}) => {
  const isId = lang === 'id';
  const hasSlides = media.contentType === 'carousel' || (Boolean(media.slides) && (media.slides?.length || 0) > 0);
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'slides'>('video');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [copiedGeneral, setCopiedGeneral] = useState(false);

  const t = translations[lang];

  const videoFormats = media.formats.filter((f) => f.type === 'video');
  const audioFormats = media.formats.filter((f) => f.type === 'audio');

  const getDirectDownloadLink = (fmt?: FormatItem) => {
    const selectedFormat = fmt || videoFormats[0] || media.formats[0];
    if (!selectedFormat) return media.originalUrl;
    return selectedFormat.downloadUrl;
  };

  const handleCopyLink = async (textToCopy: string, isGeneral = false) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      if (isGeneral) {
        setCopiedGeneral(true);
        setTimeout(() => setCopiedGeneral(false), 2500);
      } else {
        setCopiedUrl(textToCopy);
        setTimeout(() => setCopiedUrl(null), 2500);
      }
    } catch (err) {
      console.warn('Failed to copy link:', err);
    }
  };

  const mainShareLink = getDirectDownloadLink();

  return (
    <div className="w-full bg-white dark:bg-[#111827] rounded-3xl p-5 sm:p-7 shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200/80 dark:border-slate-800 transition-all">
      {/* 1. Header Bar: Status & Direct Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5 shadow-2xs">
            {hasSlides ? (
              <Images className="w-3.5 h-3.5 text-pink-500" />
            ) : (
              <Film className="w-3.5 h-3.5 text-blue-500" />
            )}
            <span>{media.platformLabel}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isId ? 'Tanpa Watermark' : 'No Watermark'}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
            <Tv className="w-3.5 h-3.5 text-purple-500" />
            <span>16:9 Widescreen</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {fromCache && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
              <Zap className="w-3.5 h-3.5" />
              <span>{t.cachedBadge}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => handleCopyLink(mainShareLink, true)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
              copiedGeneral
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                : 'bg-slate-50 dark:bg-[#0b0f19] hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300'
            }`}
            title={isId ? 'Salin link download langsung' : 'Copy direct download link'}
          >
            {copiedGeneral ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500 animate-in zoom-in-50 duration-150" />
                <span>{t.copyLinkSuccess}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{t.copyLinkBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Media Overview Card - Always 16:9 Widescreen, No Chopping! */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5 p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-[#0b0f19]/80 border border-slate-200/80 dark:border-slate-800/80">
        {/* Full 16:9 Widescreen Thumbnail Preview */}
        <div className="lg:col-span-5">
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 shadow-md group">
            <img
              src={
                hasSlides && media.slides && media.slides[activeSlideIndex]
                  ? media.slides[activeSlideIndex].url
                  : media.thumbnail
              }
              alt={media.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-black/85 text-white backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                <Clock className="w-3 h-3 text-blue-400" />
                <span>
                  {hasSlides
                    ? `${t.slideNumber}${activeSlideIndex + 1}/${media.slides?.length || 0}`
                    : media.duration || 'Full HD'}
                </span>
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600/90 text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-3 h-3" />
                <span>{isId ? '16:9 Full HD' : '16:9 Full HD'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Info Details */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug line-clamp-2">
              {media.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2.5">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{media.authorUsername || media.author}</span>
              </div>
              {media.duration && (
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Durasi: {media.duration}</span>
                </div>
              )}
              {hasSlides && (
                <div className="flex items-center gap-1.5 text-pink-600 dark:text-pink-400">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{media.slides?.length || 0} {isId ? 'Slide Foto' : 'Photos'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 text-xs">
            <span className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-blue-500" />
              <span>{isId ? 'Format Layar Lebar 16:9' : '16:9 Widescreen'}</span>
            </span>
            {media.sourceResolution && (
              <span className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-black flex items-center gap-1.5 border border-indigo-200/60 dark:border-indigo-800/60">
                <Tv className="w-3.5 h-3.5 text-indigo-500" />
                <span>{isId ? `Sumber Asli: ${media.sourceResolution}` : `Source: ${media.sourceResolution}`}</span>
              </span>
            )}
            <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-emerald-500" />
              <span>{videoFormats[0]?.sizeStr || 'Ukuran Real'}</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isId ? 'Kualitas Asli Server' : 'Original Quality'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Category Tabs: Video MP4 / Audio MP3 / Slide Foto */}
      <div className="mt-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#0b0f19] border border-slate-200/80 dark:border-slate-800">
            {/* Video Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('video')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileVideo className="w-4 h-4" />
              <span>{isId ? 'Video MP4 (16:9)' : 'Video (MP4 16:9)'}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'video' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {videoFormats.length} Kualitas
              </span>
            </button>

            {/* Audio Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('audio')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'audio'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileAudio className="w-4 h-4" />
              <span>{isId ? 'Audio MP3' : 'Audio (MP3)'}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'audio' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {audioFormats.length} Kualitas
              </span>
            </button>

            {/* Slides Tab (If Carousel) */}
            {hasSlides && (
              <button
                type="button"
                onClick={() => setActiveTab('slides')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'slides'
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 ring-2 ring-pink-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Images className="w-4 h-4" />
                <span>{isId ? 'Slide Foto' : 'Photo Slides'}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'slides' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {media.slides?.length || 0} Foto
                </span>
              </button>
            )}
          </div>

          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 hidden md:inline">
            {isId ? 'Pilih resolusi & unduh langsung' : 'Select resolution & download directly'}
          </span>
        </div>

        {/* 4. Format & Resolution List Table - Spacious, Clean, Never Cut-off! */}
        {activeTab === 'video' && (
          <div className="space-y-3.5">
            {videoFormats.map((fmt, index) => {
              const formatLink = fmt.downloadUrl;
              const isCopied = copiedUrl === formatLink;
              const isFirst = index === 0;

              return (
                <div
                  key={fmt.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isFirst
                      ? 'bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-white dark:from-blue-950/40 dark:via-[#111827] dark:to-[#111827] border-blue-300 dark:border-blue-700/80 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/20'
                      : 'bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Left: Resolution, Quality & File details */}
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 ${
                        isFirst
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="text-xs sm:text-sm leading-none">{fmt.resolution}</span>
                      <span className="text-[9px] uppercase tracking-wider opacity-90 mt-1 font-mono">16:9</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                          {fmt.label}
                        </span>
                        {isFirst && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {isId ? 'Terbaik' : 'Recommended'}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          16:9 Widescreen
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {fmt.sizeStr}
                        </span>
                        <span>·</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {isId ? 'Tanpa Watermark' : 'No Watermark'}
                        </span>
                        <span>·</span>
                        <span className="font-mono uppercase text-[11px] text-slate-400">
                          MP4 HD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Prominent Download Action & Copy Link */}
                  <div className="flex items-center gap-2.5 shrink-0 self-stretch sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(formatLink)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                      title={t.copyFormatLink}
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDownloadFormat(fmt)}
                      className="flex-1 sm:flex-initial px-6 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 active:scale-95 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isId ? `Unduh MP4 (${fmt.resolution})` : `Download MP4 (${fmt.resolution})`}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. Audio Formats List */}
        {activeTab === 'audio' && (
          <div className="space-y-3.5">
            {audioFormats.map((fmt, index) => {
              const formatLink = fmt.downloadUrl;
              const isCopied = copiedUrl === formatLink;
              const isFirst = index === 0;

              return (
                <div
                  key={fmt.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isFirst
                      ? 'bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-white dark:from-emerald-950/40 dark:via-[#111827] dark:to-[#111827] border-emerald-300 dark:border-emerald-700/80 shadow-md shadow-emerald-500/5 ring-1 ring-emerald-500/20'
                      : 'bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 ${
                        isFirst
                          ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Music className="w-5 h-5" />
                      <span className="text-[9px] uppercase tracking-wider opacity-90 mt-1 font-mono">MP3</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                          {fmt.label}
                        </span>
                        {isFirst && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {isId ? 'Kualitas Suara HQ' : 'HQ Sound'}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {fmt.sizeStr}
                        </span>
                        <span>·</span>
                        <span className="text-slate-700 dark:text-slate-300 font-mono">
                          {fmt.resolution}
                        </span>
                        <span>·</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {isId ? 'Lagu & Backsound Asli' : 'Original Soundtrack'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-stretch sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(formatLink)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                      title={t.copyFormatLink}
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDownloadFormat(fmt)}
                      className="flex-1 sm:flex-initial px-6 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 active:scale-95 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isId ? `Unduh MP3 (${fmt.resolution})` : `Download MP3 (${fmt.resolution})`}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 6. Slides Carousel Gallery Tab */}
        {hasSlides && activeTab === 'slides' && media.slides && (
          <div className="space-y-4">
            {/* Top Download All ZIP Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/5 to-transparent border border-pink-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FolderArchive className="w-5 h-5 text-pink-500" />
                  <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {isId ? `Unduh Semua ${media.slides.length} Foto Sekaligus (.ZIP)` : `Download All ${media.slides.length} Photos (.ZIP)`}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isId
                    ? 'Seluruh foto resolusi penuh dikompres menjadi satu file ZIP rapi tanpa watermark.'
                    : 'All original resolution images packaged into one clean ZIP archive without watermarks.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onDownloadAllSlides(media.slides || [])}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 hover:shadow-pink-600/40 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isId ? 'Unduh Semua (.ZIP)' : 'Download All (.ZIP)'}</span>
              </button>
            </div>

            {/* Slide Grid Showcase */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {media.slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="group relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={slide.url}
                      alt={slide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-black bg-black/80 text-white backdrop-blur-md">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="p-3 space-y-2 bg-white dark:bg-[#111827]">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <span>{isId ? `Foto #${idx + 1}` : `Photo #${idx + 1}`}</span>
                      <span className="text-[10px] uppercase font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">JPG HD</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyLink(slide.url)}
                        className={`p-2 rounded-lg border text-xs font-bold transition-all cursor-pointer shrink-0 ${
                          copiedUrl === slide.url
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}
                        title="Copy URL"
                      >
                        {copiedUrl === slide.url ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => onDownloadSlide(slide)}
                        className="flex-1 py-2 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isId ? 'Unduh' : 'Download'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
