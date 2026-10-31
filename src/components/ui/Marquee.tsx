// Adapted from Aceternity UI Infinite Moving Cards (Manu Arora).
// https://ui.aceternity.com/components/infinite-moving-cards
// Scrolls the host's [data-marquee] track forever and pauses on hover. The track holds its
// items twice (written out in Astro, so the second copy is translated too).
import { animate, type AnimationPlaybackControls } from 'motion/react';
import { useEffect, useRef } from 'react';
import { hostOf, useMotionAllowed } from './host';

export default function Marquee({ seconds = 40, reverse = false }: { seconds?: number; reverse?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const allowed = useMotionAllowed();
  useEffect(() => {
    const host = hostOf(ref.current);
    const track = host?.querySelector<HTMLElement>('[data-marquee]');
    if (!host || !track || !allowed) return;
    const controls: AnimationPlaybackControls = animate(track, { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }, { duration: seconds, repeat: Infinity, ease: 'linear' });
    const pause = () => controls.pause();
    const play = () => controls.play();
    host.addEventListener('pointerenter', pause);
    host.addEventListener('pointerleave', play);
    const visibility = () => (document.hidden ? controls.pause() : controls.play());
    document.addEventListener('visibilitychange', visibility);
    return () => {
      controls.stop();
      host.removeEventListener('pointerenter', pause); host.removeEventListener('pointerleave', play);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [allowed, seconds, reverse]);
  return <span ref={ref} hidden />;
}
