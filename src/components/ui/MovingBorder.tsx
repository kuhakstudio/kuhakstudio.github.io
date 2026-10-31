// Adapted from Aceternity UI Moving Border (Manu Arora).
// https://ui.aceternity.com/components/moving-border
// An ember spark that travels round the border of its host (`relative overflow-hidden p-px`,
// content above it on a solid background). Hidden under reduced motion.
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useMotionAllowed } from './host';

export default function MovingBorder({ duration = 4200, rx = '50%', ry = '50%' }: { duration?: number; rx?: string; ry?: string }) {
  const path = useRef<SVGRectElement>(null);
  const progress = useMotionValue(0);
  const allowed = useMotionAllowed();

  useAnimationFrame(time => {
    const length = path.current?.getTotalLength();
    if (length && allowed) progress.set((time * (length / duration)) % length);
  });
  const x = useTransform(progress, value => path.current?.getPointAtLength(value).x ?? 0);
  const y = useTransform(progress, value => path.current?.getPointAtLength(value).y ?? 0);
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="absolute size-full" width="100%" height="100%">
        <rect fill="none" width="100%" height="100%" rx={rx} ry={ry} ref={path} />
      </svg>
      {allowed && (
        <motion.div className="absolute top-0 left-0 inline-block" style={{ transform }}>
          <div className="size-16 bg-[radial-gradient(#ff8a3d_35%,transparent_62%)] opacity-90" />
        </motion.div>
      )}
    </div>
  );
}
