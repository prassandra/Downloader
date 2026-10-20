import React, { useEffect, useRef, useState } from 'react';

interface AdSlot300x250Props {
  className?: string;
  slotId?: string;
}

export const AdSlot300x250: React.FC<AdSlot300x250Props> = ({
  className = '',
  slotId = '1116459861',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);
  const [isUnfilled, setIsUnfilled] = useState(false);

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
      // Ignored
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

  if (isUnfilled) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`w-[300px] h-[250px] min-w-[300px] min-h-[250px] flex items-center justify-center overflow-hidden shrink-0 mx-auto ${className}`}
      aria-label="Advertising Placement 300x250"
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'inline-block', width: '300px', height: '250px' }}
        data-ad-client="ca-pub-2212969526982215"
        data-ad-slot={slotId}
      />
    </div>
  );
};
