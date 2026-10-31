import { useEffect, useState } from 'react';

// Decorative islands sit inside the element they decorate; Astro wraps them in
// <astro-island>/<astro-slot>, so step past those to reach the real host.
export function hostOf(element: Element | null): HTMLElement | null {
  let node = element?.parentElement ?? null;
  while (node && (node.tagName === 'ASTRO-ISLAND' || node.tagName === 'ASTRO-SLOT')) node = node.parentElement;
  return node;
}

function useMedia(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = matchMedia(query);
    setMatches(media.matches);
    const change = () => setMatches(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, [query]);
  return matches;
}

// Motion is off until hydration says otherwise, so the static HTML is the calm version.
export const useMotionAllowed = () => useMedia('(prefers-reduced-motion: no-preference)');
export const useFinePointer = () => useMedia('(hover: hover) and (pointer: fine)');
