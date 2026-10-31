// Adapted from Aceternity UI Meteors (Manu Arora).
// https://ui.aceternity.com/components/meteors
// Falling sparks with moonlit tails across the host (`relative overflow-hidden`). Motion
// replaces the Tailwind keyframes; nothing is drawn under reduced motion.
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { useMotionAllowed } from './host';

// rotate(215deg) translateX(-500px) in the original = this screen-space path.
const travel = { x: 410, y: 287 };

export default function Meteors({ number = 14 }: { number?: number }) {
  const allowed = useMotionAllowed();
  const meteors = useMemo(() => Array.from({ length: number }, (_, index) => ({
    left: `${(index / number) * 110 - 15}%`,
    delay: Math.random() * 6,
    duration: 4 + Math.random() * 5,
  })), [number]);
  if (!allowed) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
      {meteors.map((meteor, index) => (
        <motion.span
          key={index}
          className="absolute top-[-40px] block h-0.5 w-0.5 rounded-full bg-[#fceed2] shadow-[0_0_0_1px_#ffffff10] before:absolute before:top-1/2 before:h-px before:w-[60px] before:-translate-y-1/2 before:bg-linear-to-r before:from-[#f59a3c] before:to-transparent before:content-['']"
          style={{ left: meteor.left, rotate: 215 }}
          animate={{ x: [0, travel.x], y: [0, travel.y], opacity: [1, 1, 0] }}
          transition={{ duration: meteor.duration, delay: meteor.delay, repeat: Infinity, ease: 'linear', times: [0, 0.7, 1] }}
        />
      ))}
    </div>
  );
}
