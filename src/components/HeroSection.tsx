import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { LanguageSetting } from '../types';
import { translations } from '../utils/translations';

interface HeroSectionProps {
  lang: LanguageSetting;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <section className="scroll-reveal relative w-full pt-4 pb-3 sm:pt-6 sm:pb-4 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Kicker Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/80 mb-3.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>{t.heroKicker}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.18]">
          {t.heroTitle}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400">
            {t.heroTitleAccent}
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          {t.heroDescription}
        </p>

        {/* Feature Highlights Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.heroHighlight1}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
            <span>{t.heroHighlight2}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>{t.heroHighlight3}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
