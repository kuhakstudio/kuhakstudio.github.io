// Adapted from Aceternity UI Tracing Beam (Manu Arora).
// https://ui.aceternity.com/components/tracing-beam
// A rail down the left of its host (`relative`, with left padding for it) that lights up in
// ember and moonlight as the reader scrolls through. It measures the host instead of wrapping
// the content, so the text it sits beside is never re-rendered.
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useEffect, useId, useRef, useState } from 'react';
import { hostOf } from './host';
import { cn } from '../../lib/utils';

export default function TracingBeam({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, '');
  const [height, setHeight] = useState(0);
  const progress = useMotionValue(0);

  useEffect(() => {
    const host = hostOf(ref.current);
    if (!host) return;
    const measure = () => setHeight(host.offsetHeight);
    const scroll = () => {
      const box = host.getBoundingClientRect();
      progress.set(Math.min(1, Math.max(0, (innerHeight * 0.55 - box.top) / box.height)));
    };
    measure(); scroll();
    const resize = new ResizeObserver(() => { measure(); scroll(); });
    resize.observe(host);
    addEventListener('scroll', scroll, { passive: true });
    return () => { resize.disconnect(); removeEventListener('scroll', scroll); };
  }, [progress]);

  const y1 = useSpring(useTransform(progress, [0, 0.8], [50, height]), { stiffness: 500, damping: 90 });
  const y2 = useSpring(useTransform(progress, [0, 1], [50, Math.max(60, height - 200)]), { stiffness: 500, damping: 90 });
  const started = useTransform(progress, value => (value > 0 ? '#fceed2' : '#f04f06'));

  return (
    <div ref={ref} className={cn('pointer-events-none absolute top-3 left-0', className)} aria-hidden="true">
      <div className="ml-[3px] flex size-4 items-center justify-center rounded-full border border-(--line)/25 bg-(--night) shadow-[0_0_12px_#f04f0655]">
        <motion.div className="size-2 rounded-full" style={{ backgroundColor: started }} />
      </div>
      {height > 0 && (
        <svg viewBox={`0 0 20 ${height}`} width="20" height={height} className="-mt-1 block">
          <path d={`M 1 0V -36 l 18 24 V ${height * 0.8} l -18 24V ${height}`} fill="none" stroke="currentColor" strokeOpacity="0.14" className="text-(--line)" />
          <path d={`M 1 0V -36 l 18 24 V ${height * 0.8} l -18 24V ${height}`} fill="none" stroke={`url(#${id})`} strokeWidth="1.5" className="motion-reduce:hidden" />
          <defs>
            <motion.linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={y1} y2={y2}>
              <stop stopColor="#f04f06" stopOpacity="0" />
              <stop stopColor="#f04f06" />
              <stop offset="0.4" stopColor="#f59a3c" />
              <stop offset="1" stopColor="#fceed2" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>
      )}
    </div>
  );
}
