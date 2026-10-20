import React, { useEffect, useState } from 'react';

/**
 * Ultra-lightweight scroll progress bar along top of screen.
 * Hardware accelerated using CSS transform scaleX for 60fps performance without layout recalculation.
 */
export const ScrollProgressBar: React.FC = () => {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        const percent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setScrollPercent(percent);
      } else {
        setScrollPercent(0);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 transition-transform duration-75 ease-out shadow-[0_0_8px_rgba(59,130,246,0.6)]"
        style={{
          width: '100%',
          transformOrigin: '0% 50%',
          transform: `scaleX(${scrollPercent / 100})`,
        }}
      />
    </div>
  );
};
