import React from 'react';
import { Sliders, Layers, Zap, ShieldCheck } from 'lucide-react';
import { LanguageSetting } from '../types';
import { translations } from '../utils/translations';

interface FeaturesSectionProps {
  lang: LanguageSetting;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ lang }) => {
  const t = translations[lang];

  const features = [
    {
      index: '01',
      icon: <Sliders className="w-5 h-5 text-blue-500" />,
      title: t.feat1Title,
      description: t.feat1Desc,
    },
    {
      index: '02',
      icon: <Layers className="w-5 h-5 text-indigo-500" />,
      title: t.feat2Title,
      description: t.feat2Desc,
    },
    {
      index: '03',
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      title: t.feat3Title,
      description: t.feat3Desc,
    },
    {
      index: '04',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      title: t.feat4Title,
      description: t.feat4Desc,
    },
  ];

  return (
    <section id="features" className="scroll-reveal scroll-mt-24 py-10 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1.5">
            {lang === 'id' ? 'FITUR UTAMA' : 'KEY FEATURES'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.featTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            {t.featSub}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {features.map((f) => (
            <div
              key={f.index}
              className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-400/50 dark:hover:border-blue-500/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {f.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-600">
                    {f.index}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">
                  {f.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
