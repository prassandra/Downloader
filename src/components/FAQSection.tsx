import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { LanguageSetting } from '../types';

interface FAQSectionProps {
  lang: LanguageSetting;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ lang }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isId = lang === 'id';

  const faqs = isId
    ? [
        {
          q: 'Bagaimana cara download foto slide / carousel TikTok dan Instagram?',
          a: 'Cukup salin link postingan dari aplikasi TikTok atau Instagram, lalu tempel di kotak input DriaSave. Sistem kami otomatis mendeteksi bahwa tautan tersebut berisi slide foto dan menampilkan seluruh foto dengan opsi download satu per satu atau langsung semua dalam arsip ZIP otomatis.',
        },
        {
          q: 'Apakah saya bisa memilih kualitas video seperti 1080p Full HD atau 720p?',
          a: 'Bisa banget! Pilih resolusi yang kamu mau pada menu pilihan resolusi atau langsung pilih pada tabel format yang muncul. Rekomendasi format akan langsung menyesuaikan pilihanmu secara otomatis.',
        },
        {
          q: 'Bagaimana cara download musik atau suara MP3-nya saja?',
          a: 'Setelah link diproses, klik tab Audio / Musik (MP3). Kamu bisa langsung download lagunya dengan kualitas jernih hingga 320 kbps tanpa harus download videonya.',
        },
        {
          q: 'Apakah DriaSave gratis dan aman dari watermark?',
          a: 'DriaSave 100% gratis digunakan kapan saja tanpa perlu login. Video dan foto yang kamu download dijamin bersih dengan kualitas asli tanpa watermark tambahan.',
        },
      ]
    : [
        {
          q: 'How do I download TikTok and Instagram photo carousel slides?',
          a: 'Simply copy the post link from the TikTok or Instagram app and paste it into DriaSave. Our system automatically detects that the link contains photo slides and displays all images with options to download individually or bundled directly in a ZIP file.',
        },
        {
          q: 'Can I choose specific resolutions like 1080p Full HD or 720p?',
          a: 'Absolutely! Pick your desired resolution from the resolution dropdown or directly on the formats table. Recommendations adapt to your choice in real time.',
        },
        {
          q: 'Can I extract the audio or background music as MP3?',
          a: 'Yes. Switch to the Audio / Music (MP3) tab in the result card. You can download crystal-clear MP3 tracks up to 320 kbps without saving the video.',
        },
        {
          q: 'Is DriaSave free and watermark-free?',
          a: 'DriaSave is 100% free with no account required. All downloaded media files are delivered in clean original quality without any added watermark.',
        },
      ];

  return (
    <section id="faq" className="scroll-reveal scroll-mt-24 py-10 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isId ? 'Pertanyaan yang Sering Diajukan' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                    <p className="mt-3.5 font-normal">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
