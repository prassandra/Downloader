import React from 'react';
import { X, ShieldCheck, FileText, AlertTriangle, Mail } from 'lucide-react';
import { LanguageSetting } from '../types';

export type ModalType = 'about' | 'contact' | 'disclaimer' | 'privacy' | null;

interface InfoModalsProps {
  activeModal: ModalType;
  onClose: () => void;
  lang: LanguageSetting;
}

export const InfoModals: React.FC<InfoModalsProps> = ({
  activeModal,
  onClose,
  lang,
}) => {
  if (!activeModal) return null;

  const isId = lang === 'id';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {activeModal === 'about' && <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            {activeModal === 'contact' && <Mail className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
            {activeModal === 'disclaimer' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
            {activeModal === 'privacy' && <ShieldCheck className="w-5 h-5 text-emerald-500" />}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white capitalize">
              {activeModal === 'about' && (isId ? 'Tentang Situs DriaSave' : 'About DriaSave')}
              {activeModal === 'contact' && (isId ? 'Hubungi Kami (Driacom)' : 'Contact Us (Driacom)')}
              {activeModal === 'disclaimer' && (isId ? 'Disclaimer & Hak Cipta' : 'Disclaimer & Copyright')}
              {activeModal === 'privacy' && (isId ? 'Kebijakan Privasi' : 'Privacy Policy')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-3 font-normal">
          {activeModal === 'about' && (
            <>
              <p>
                <strong>DriaSave</strong> {isId ? 'adalah situs pengunduh video dan audio yang dibuat oleh' : 'is a multimedia downloader tool created by'}{' '}
                <a href="https://driacom.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-bold underline">
                  Driacom
                </a>
                .
              </p>
              <p>
                {isId
                  ? 'Kami merancang situs ini agar kamu bisa dengan mudah mengunduh video favorit, reels, musik MP3, serta kumpulan foto slide / carousel dari TikTok, Instagram, YouTube, Facebook, dan Twitter/X dalam kualitas terbaik tanpa watermark.'
                  : 'We built this tool so you can effortlessly download favorite videos, reels, MP3 tracks, and photo carousel sets from TikTok, Instagram, YouTube, Facebook, and Twitter/X in original quality without watermarks.'}
              </p>
              <p>
                {isId
                  ? 'Situs DriaSave dibuat ringan, cepat, responsif di semua perangkat (HP, tablet, dan PC), serta bebas dari iklan yang mengganggu.'
                  : 'DriaSave is designed to be lightweight, super fast, and responsive across all your mobile phones and computers.'}
              </p>
            </>
          )}

          {activeModal === 'contact' && (
            <>
              <p>
                {isId
                  ? 'Punya pertanyaan, kritik, atau saran untuk pengembangan DriaSave? Silakan hubungi tim kami:'
                  : 'Have questions, feedback, or suggestions? Reach out to the Driacom team:'}
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">Email:</span>
                  <a href="mailto:driacom.id@gmail.com" className="text-blue-600 dark:text-blue-400 font-mono">
                    driacom.id@gmail.com
                  </a>
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">Website Resmi:</span>
                  <a href="https://driacom.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">
                    https://driacom.com
                  </a>
                </div>
              </div>
            </>
          )}

          {activeModal === 'disclaimer' && (
            <>
              <p>
                {isId
                  ? 'DriaSave adalah alat bantu independen dan tidak memiliki hubungan kerja sama resmi dengan TikTok, Instagram, Meta, YouTube, Google, Twitter/X, atau platform lainnya. Semua hak cipta, merek, dan materi video/audio adalah milik sah pemilik konten masing-masing.'
                  : 'DriaSave is an independent tool and is not officially affiliated with TikTok, Instagram, Meta, YouTube, Google, or Twitter/X. All media copyrights remain the property of their respective owners.'}
              </p>
              <p>
                {isId
                  ? 'Layanan ini hanya diperuntukkan untuk penggunaan pribadi, cadangan arsip mandiri, dan keperluan wajar (fair use). Pengguna bertanggung jawab penuh atas konten yang diunduh.'
                  : 'This service is intended strictly for personal archival and fair-use educational backup. Users are solely responsible for honoring applicable copyright rules.'}
              </p>
            </>
          )}

          {activeModal === 'privacy' && (
            <>
              <p>
                {isId
                  ? 'Privasi kamu sangat penting bagi kami di DriaSave:'
                  : 'Your privacy is paramount at DriaSave:'}
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>
                  {isId
                    ? 'Kami TIDAK menyimpan video, audio, atau data pribadi kamu di server kami.'
                    : 'We DO NOT store downloaded media files or personal logs on external servers.'}
                </li>
                <li>
                  {isId
                    ? 'Tautan diunduh langsung dari server media asli ke browser perangkatmu.'
                    : 'Files are downloaded directly from the content source to your browser.'}
                </li>
                <li>
                  {isId
                    ? 'Pengaturan seperti ukuran font dan mode gelap hanya tersimpan di browser lokalmu.'
                    : 'Preferences such as theme mode and font scale are saved strictly in your local device storage.'}
                </li>
              </ul>
            </>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
          >
            {isId ? 'Tutup' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
