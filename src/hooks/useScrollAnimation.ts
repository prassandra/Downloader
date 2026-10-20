import { useEffect } from 'react';

/**
 * Ultra-lightweight scroll animation hook.
 * Uses native IntersectionObserver to reveal elements smoothly as the user scrolls the page.
 * Highly performant: unobserves elements once revealed, passive listeners, 60fps/120fps.
 */
export function useScrollAnimation() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08,
      }
    );

    const elements = document.querySelectorAll('.scroll-reveal:not(.is-visible)');
    elements.forEach((el) => {
      if (prefersReducedMotion) {
        el.classList.add('is-visible');
      } else {
        observer.observe(el);
      }
    });

    // Observer for dynamically added elements (e.g. MediaResultCard)
    const mutationObserver = new MutationObserver(() => {
      const newElements = document.querySelectorAll('.scroll-reveal:not(.is-visible)');
      newElements.forEach((el) => {
        if (prefersReducedMotion) {
          el.classList.add('is-visible');
        } else {
          observer.observe(el);
        }
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
