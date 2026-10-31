// Adapted from Aceternity UI Spotlight (new) (Manu Arora).
// https://ui.aceternity.com/components/spotlight-new
// Two soft beams of moonlight sweeping from the top corners. Static under reduced motion.
import { motion } from 'motion/react';
import { useMotionAllowed } from './host';

const first = 'radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(40, 90%, 88%, .10) 0, hsla(35, 80%, 60%, .03) 50%, hsla(30, 70%, 45%, 0) 80%)';
const second = 'radial-gradient(50% 50% at 50% 50%, hsla(40, 90%, 88%, .07) 0, hsla(35, 80%, 60%, .02) 80%, transparent 100%)';
const third = 'radial-gradient(50% 50% at 50% 50%, hsla(40, 90%, 88%, .05) 0, hsla(30, 70%, 45%, .02) 80%, transparent 100%)';

function Beams({ side, sweep }: { side: 'left' | 'right'; sweep: number }) {
  const moving = useMotionAllowed();
  const sign = side === 'left' ? -1 : 1;
  const edge = side === 'left' ? 'left-0' : 'right-0';
  const corner = side === 'left' ? 'left-0 origin-top-left' : 'right-0 origin-top-right';
  return (
    <motion.div
      animate={moving ? { x: [0, sweep, 0] } : undefined}
      transition={{ duration: 9, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      className={`absolute top-0 h-full w-full ${edge}`}
    >
      <div className={`absolute top-0 h-[1380px] w-[560px] ${edge}`} style={{ transform: `translateY(-350px) rotate(${sign * 45}deg)`, background: first }} />
      <div className={`absolute top-0 h-[1380px] w-[240px] ${corner}`} style={{ transform: `rotate(${sign * 45}deg) translate(${-sign * 5}%, -50%)`, background: second }} />
      <div className={`absolute top-0 h-[1380px] w-[240px] ${corner}`} style={{ transform: `rotate(${sign * 45}deg) translate(${sign * 180}%, -70%)`, background: third }} />
    </motion.div>
  );
}

export default function Spotlight({ className = '' }: { className?: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <Beams side="left" sweep={100} />
      <Beams side="right" sweep={-100} />
    </motion.div>
  );
}
