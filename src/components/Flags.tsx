import React from 'react';

interface FlagProps {
  className?: string;
}

export const FlagID: React.FC<FlagProps> = ({ className = 'w-4 h-3' }) => (
  <svg
    viewBox="0 0 640 480"
    className={`inline-block rounded-xs overflow-hidden shadow-2xs shrink-0 border border-slate-300/80 dark:border-slate-700/80 ${className}`}
    aria-label="Bendera Indonesia"
    role="img"
  >
    <path fill="#e70011" d="M0 0h640v240H0z" />
    <path fill="#ffffff" d="M0 240h640v240H0z" />
  </svg>
);

export const FlagGB: React.FC<FlagProps> = ({ className = 'w-4 h-3' }) => (
  <svg
    viewBox="0 0 60 30"
    className={`inline-block rounded-xs overflow-hidden shadow-2xs shrink-0 border border-slate-300/80 dark:border-slate-700/80 ${className}`}
    aria-label="English / UK Flag"
    role="img"
  >
    <defs>
      <clipPath id="uk-flag-clip-s">
        <path d="M0 0v30h60V0z" />
      </clipPath>
      <clipPath id="uk-flag-clip-t">
        <path d="M30 15h30v15zv15H30zh-30v-15zv-15h30z" />
      </clipPath>
    </defs>
    <g clipPath="url(#uk-flag-clip-s)">
      <path d="M0 0v30h60V0z" fill="#012169" />
      <path d="M0 0l60 30M60 0L0 30" stroke="#ffffff" strokeWidth="6" />
      <path d="M0 0l60 30M60 0L0 30" clipPath="url(#uk-flag-clip-t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0v30M0 15h60" stroke="#ffffff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);
