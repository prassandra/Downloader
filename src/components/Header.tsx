import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Globe,
  Type,
  Menu,
  X,
  Bell,
  BellRing,
  ChevronDown,
  ExternalLink,
  Check,
  HelpCircle,
  Sliders,
  FileText,
  Mail,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { FontSizeSetting, LanguageSetting, ThemeSetting } from '../types';
import { translations } from '../utils/translations';
import { FlagID, FlagGB } from './Flags';

interface HeaderProps {
  theme: ThemeSetting;
  onToggleTheme: () => void;
  lang: LanguageSetting;
  onChangeLang: (lang: LanguageSetting) => void;
  fontSize: FontSizeSetting;
  onChangeFontSize: (size: FontSizeSetting) => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  onOpenModal?: (type: 'about' | 'contact' | 'disclaimer' | 'privacy') => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  lang,
  onChangeLang,
  fontSize,
  onChangeFontSize,
  notificationsEnabled,
  onToggleNotifications,
  onOpenModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontSizeMenuOpen, setFontSizeMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const t = translations[lang];

  const getFontSizeDisplay = (size: FontSizeSetting) => {
    switch (size) {
      case 'sm':
        return t.fontSizeSm;
      case 'base':
        return t.fontSizeBase;
      case 'lg':
        return t.fontSizeLg;
    }
  };

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleModalOpen = (type: 'about' | 'contact' | 'disclaimer' | 'privacy') => {
    setMobileMenuOpen(false);
    if (onOpenModal) {
      onOpenModal(type);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200 backdrop-blur-xl bg-white/90 dark:bg-[#0b0f19]/90 border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand & Logo */}
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              {/* Squircle Blue Gradient with Cloud Down Arrow */}
              <a
                href="/"
                className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-[18px] bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="DriaSave Home"
              >
                {/* Cloud with Down Arrow SVG icon */}
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 16.5A4.5 4.5 0 0 1 7 7.5A6 6 0 0 1 18.5 9A4.5 4.5 0 0 1 17 17.5" />
                  <path d="M12 12v7" />
                  <path d="m9 16 3 3 3-3" />
                </svg>
              </a>

              {/* DriaSave + HD badge + by Driacom with external link */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <a
                    href="/"
                    className="text-2xl sm:text-[26px] font-black tracking-tight text-slate-900 dark:text-white leading-none hover:opacity-90 transition-opacity"
                  >
                    <span>Dria</span>
                    <span className="text-blue-600 dark:text-blue-500">Save</span>
                  </a>

                  {/* HD pill badge */}
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-black tracking-wide text-sky-600 dark:text-sky-400 bg-sky-100/80 dark:bg-sky-950/60 border border-sky-300/80 dark:border-sky-800 leading-none">
                    HD
                  </span>
                </div>

                <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>by</span>
                  <a
                    href="https://driacom.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>Driacom</span>
                    <ExternalLink className="w-3 h-3 stroke-[2.2]" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Desktop Quick Nav Links */}
            <nav className="flex items-center space-x-1 mr-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <button
                onClick={() => handleNavClick('features')}
                className="px-2.5 py-1.5 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                {t.navFeatures}
              </button>
              <button
                onClick={() => handleNavClick('faq')}
                className="px-2.5 py-1.5 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                {t.navFaq}
              </button>
            </nav>

            {/* Font Size Selector (Kecil, Normal, Besar) */}
            <div className="relative">
              <button
                onClick={() => {
                  setFontSizeMenuOpen(!fontSizeMenuOpen);
                  setLangMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100/90 hover:bg-slate-200/90 dark:bg-slate-800/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/70 transition-colors cursor-pointer"
                title={t.fontSizeLabel}
                aria-expanded={fontSizeMenuOpen}
              >
                <Type className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{getFontSizeDisplay(fontSize)}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {fontSizeMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-2xl shadow-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {t.fontSizeLabel}
                  </div>
                  {(['sm', 'base', 'lg'] as FontSizeSetting[]).map((sizeKey) => (
                    <button
                      key={sizeKey}
                      onClick={() => {
                        onChangeFontSize(sizeKey);
                        setFontSizeMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between font-medium transition-colors cursor-pointer ${
                        fontSize === sizeKey
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <span>{getFontSizeDisplay(sizeKey)}</span>
                      {fontSize === sizeKey && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switcher with Flags */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangMenuOpen(!langMenuOpen);
                  setFontSizeMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100/90 hover:bg-slate-200/90 dark:bg-slate-800/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/70 transition-colors cursor-pointer"
                aria-expanded={langMenuOpen}
              >
                {lang === 'id' ? <FlagID className="w-4.5 h-3.5" /> : <FlagGB className="w-4.5 h-3.5" />}
                <span className="uppercase tracking-wider font-bold">{lang}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-2xl shadow-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      onChangeLang('id');
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      lang === 'id'
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <FlagID className="w-5 h-3.5" />
                      <span>Indonesia</span>
                    </span>
                    {lang === 'id' && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  </button>
                  <button
                    onClick={() => {
                      onChangeLang('en');
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      lang === 'en'
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <FlagGB className="w-5 h-3.5" />
                      <span>English</span>
                    </span>
                    {lang === 'en' && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              onClick={onToggleNotifications}
              className={`relative p-2 rounded-xl transition-all duration-200 border cursor-pointer ${
                notificationsEnabled
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700 shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 bg-slate-100/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/70'
              }`}
              title={notificationsEnabled ? t.notificationsEnabled : t.notificationsDisabled}
              aria-label="Toggle notifications"
            >
              {notificationsEnabled ? (
                <>
                  <BellRing className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-[#0b0f19]" />
                </>
              ) : (
                <Bell className="w-4 h-4" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl transition-all duration-200 border border-slate-200 dark:border-slate-700/70 bg-slate-100/90 hover:bg-slate-200/90 dark:bg-slate-800/90 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs cursor-pointer"
              title={theme === 'dark' ? t.themeLight : t.themeDark}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>
          </div>

          {/* Mobile Right Controls: Theme + Hamburger */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900 dark:text-white" /> : <Menu className="w-5 h-5 text-slate-900 dark:text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-2xl px-5 py-5 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {/* Quick Nav Links on Mobile */}
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => handleNavClick('features')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-bold text-xs"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-500" />
              <span>{t.navFeatures}</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('faq')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-bold text-xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t.navFaq}</span>
            </button>
          </div>

          {/* Section: Language Switcher */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{t.menuLangTitle}</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onChangeLang('id');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-2.5 py-3 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  lang === 'id'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FlagID className="w-5 h-3.5" />
                <span>Indonesia</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onChangeLang('en');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-2.5 py-3 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FlagGB className="w-5 h-3.5" />
                <span>English</span>
              </button>
            </div>
          </div>

          {/* Section: Font Size */}
          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{t.menuFontTitle}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['sm', 'base', 'lg'] as FontSizeSetting[]).map((sizeKey) => {
                const label = getFontSizeDisplay(sizeKey);
                const isSelected = fontSize === sizeKey;
                return (
                  <button
                    key={sizeKey}
                    type="button"
                    onClick={() => onChangeFontSize(sizeKey)}
                    className={`py-2.5 px-2 rounded-xl border text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legal / Info Links on Mobile */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <button
              onClick={() => handleModalOpen('about')}
              className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t.footerAbout}
            </button>
            <button
              onClick={() => handleModalOpen('contact')}
              className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t.footerContact}
            </button>
            <button
              onClick={() => handleModalOpen('disclaimer')}
              className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t.footerDisclaimer}
            </button>
            <button
              onClick={() => handleModalOpen('privacy')}
              className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t.footerPrivacy}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
