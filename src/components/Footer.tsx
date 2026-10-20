import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { LanguageSetting } from '../types';
import { translations } from '../utils/translations';
import { ModalType } from './InfoModals';

interface FooterProps {
  lang: LanguageSetting;
  onOpenModal: (type: ModalType) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onOpenModal }) => {
  const t = translations[lang];

  return (
    <footer className="scroll-reveal w-full mt-16 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] transition-colors pb-16 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs">
                <Download className="w-4 h-4 stroke-[2.4]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 dark:text-white leading-none">
                  Dria<span className="text-blue-600 dark:text-blue-400">Save</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  by{' '}
                  <a
                    href="https://driacom.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-bold"
                  >
                    Driacom
                  </a>
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              {t.footerBrandDesc}
            </p>
          </div>

          {/* Legal & Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t.footerInfoTitle}
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => onOpenModal('about')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {t.footerAbout}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('contact')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {t.footerContact}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('disclaimer')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {t.footerDisclaimer}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('privacy')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {t.footerPrivacy}
                </button>
              </li>
            </ul>
          </div>

          {/* Tools Driacom */}
          <div className="space-y-3 md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t.footerToolsHeader}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* DriaConvert */}
              <a
                href="https://convert.driacom.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 dark:bg-[#111827] dark:hover:bg-[#151e32] border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all group flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between text-slate-900 dark:text-white font-bold text-xs sm:text-sm">
                    <span>{t.footerToolsDriaConvert}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal font-normal">
                    {t.footerToolsDriaConvertDesc}
                  </p>
                </div>
                <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold mt-3">
                  convert.driacom.com
                </span>
              </a>

              {/* DriaSeo */}
              <a
                href="https://seo.driacom.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 dark:bg-[#111827] dark:hover:bg-[#151e32] border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all group flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between text-slate-900 dark:text-white font-bold text-xs sm:text-sm">
                    <span>{t.footerToolsDriaSeo}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal font-normal">
                    {t.footerToolsDriaSeoDesc}
                  </p>
                </div>
                <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold mt-3">
                  seo.driacom.com
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Created by Driacom (Centered) */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col items-center justify-center text-center gap-2.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} DriaSave. {t.allRightsReserved}
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <span>{t.createdBy}</span>
            <a
              href="https://driacom.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-bold text-sm"
            >
              Driacom
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
