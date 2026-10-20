import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowDown, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DownloadProgressState, LanguageSetting } from '../types';
import { translations } from '../utils/translations';

interface DownloadProgressBarProps {
  progressState: DownloadProgressState;
  onClose: () => void;
  lang: LanguageSetting;
}

export const DownloadProgressBar: React.FC<DownloadProgressBarProps> = ({
  progressState,
  onClose,
  lang,
}) => {
  const [confettiFired, setConfettiFired] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    if (!progressState.finished) {
      setConfettiFired(false);
    } else if (progressState.finished && !confettiFired) {
      setConfettiFired(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#06b6d4', '#10b981', '#f59e0b'],
        });
      } catch {
        // Ignore canvas confetti restriction
      }
    }
  }, [progressState.finished, confettiFired]);

  if (!progressState.active) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#0d121c] rounded-3xl p-6 shadow-2xl border border-slate-200/90 dark:border-slate-800/90 space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl text-white ${
                progressState.finished ? 'bg-emerald-600' : 'bg-blue-600 animate-pulse'
              }`}
            >
              {progressState.finished ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <ArrowDown className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                {progressState.finished ? t.downloadCompleteTitle : t.downloadingTitle}
              </h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[240px] mt-0.5">
                {progressState.filename} ({progressState.formatLabel})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar Track */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-300 font-mono">
              {progressState.downloadedMB.toFixed(1)} MB / {progressState.totalMB.toFixed(1)} MB
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">
              {Math.round(progressState.progress)}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-[#070a10] overflow-hidden p-0.5 border border-slate-200/80 dark:border-slate-800/80">
            <div
              className={`h-full rounded-full transition-all duration-150 ${
                progressState.finished
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progressState.progress))}%` }}
            />
          </div>
        </div>

        {/* Download Metrics */}
        <div className="grid grid-cols-2 gap-3 py-2 bg-slate-50 dark:bg-[#070a10] rounded-xl p-3 border border-slate-200/80 dark:border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-normal text-[11px]">
              {t.downloadSpeed}
            </span>
            <span className="font-semibold text-slate-900 dark:text-white font-mono mt-0.5 block">
              {progressState.finished ? 'Selesai' : progressState.speed}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-normal text-[11px]">
              {t.timeRemaining}
            </span>
            <span className="font-semibold text-slate-900 dark:text-white font-mono mt-0.5 block">
              {progressState.finished ? '0s' : progressState.timeRemaining}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {progressState.finished ? (
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors"
          >
            {t.closeBtn}
          </button>
        ) : (
          <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Mengalirkan berkas secara langsung dengan kecepatan maksimum...
          </div>
        )}
      </div>
    </div>
  );
};
