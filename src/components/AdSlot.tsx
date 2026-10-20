import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export type AdSlotType =
  | 'header-wide'       // Slot 5462390377 (responsive leaderboard)
  | 'below-input'       // Slot 1222928318 (responsive display, prime high-CTR)
  | 'high-ctr-result'   // Slot 1222928318 (responsive display)
  | 'result-mid'        // Slot 5462390377 (responsive display)
  | 'content-mid'       // Slot 1222928318 (responsive display)
  | 'between-sections'  // Slot 4228847445 (responsive display)
  | 'sidebar'           // Slot 1222928318 (responsive display)
  | 'sticky-sidebar'    // Slot 5462390377 (responsive display)
  | 'anchor-bottom';    // Slot 5462390377 (responsive display)

interface AdSlotProps {
  type: AdSlotType;
  className?: string;
  slotId?: string;
}

const getSlotId = (type: AdSlotType, customSlotId?: string): string => {
  if (customSlotId) return customSlotId;
  switch (type) {
    case 'header-wide':
    case 'result-mid':
    case 'sticky-sidebar':
    case 'anchor-bottom':
      return '5462390377';
    case 'between-sections':
      return '4228847445';
    case 'below-input':
    case 'high-ctr-result':
    case 'content-mid':
    case 'sidebar':
    default:
      return '1222928318';
  }
};

export const AdSlot: React.FC<AdSlotProps> = ({ type, className = '', slotId: propSlotId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  // If Google AdSense explicitly returns data-ad-status="unfilled", we hide the slot
  const [isUnfilled, setIsUnfilled] = useState(false);

  const slotId = getSlotId(type, propSlotId);

  // 1. Ensure Google AdSense script is in document head
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2212969526982215';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, []);

  // 2. Trigger adsbygoogle.push
  useEffect(() => {
    if (pushedRef.current) return;
    try {
      if (typeof window !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        pushedRef.current = true;
      }
    } catch {
      // Catch transient AdSense push exceptions
    }
  }, []);

  // 3. Monitor for Google AdSense unfilled status
  useEffect(() => {
    if (!insRef.current) return;

    const checkStatus = () => {
      const ins = insRef.current;
      if (!ins) return;

      if (ins.getAttribute('data-ad-status') === 'unfilled') {
        setIsUnfilled(true);
      }
    };

    checkStatus();

    const observer = new MutationObserver(() => {
      checkStatus();
    });

    observer.observe(insRef.current, {
      attributes: true,
      attributeFilter: ['data-ad-status'],
      childList: true,
    });

    return () => observer.disconnect();
  }, []);

  // Strictly disable anchor bottom ads
  if (type === 'anchor-bottom' || isUnfilled) {
    return null;
  }

  return (
    // Pure responsive slot: NO card border, NO card background, NO padding wrapping the ad
    <div
      ref={containerRef}
      className={`w-full max-w-full my-3 sm:my-4 flex items-center justify-center overflow-visible transition-all duration-300 ${className}`}
      aria-label="Advertising Placement"
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '100%',
          textAlign: 'center',
        }}
        data-ad-client="ca-pub-2212969526982215"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
