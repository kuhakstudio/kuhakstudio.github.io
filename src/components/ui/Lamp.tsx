// Adapted from Aceternity UI Lamp Effect (Manu Arora).
// https://ui.aceternity.com/components/lamp-effect
// A hurricane-lantern glow: a bright amber line with two cones of light falling from it. The
// cones fade with masks instead of the original's solid cover blocks, so any background shows
// through. They open when scrolled into view.
import { motion } from 'motion/react';
import { useMotionAllowed } from './host';

export default function Lamp({ className = '' }: { className?: string }) {
  const allowed = useMotionAllowed();
  const open = (from: string, to: string) => allowed
    ? { initial: { opacity: 0.5, width: from }, whileInView: { opacity: 1, width: to }, viewport: { once: true }, transition: { delay: 0.3, duration: 0.8, ease: 'easeInOut' as const } }
    : { initial: { opacity: 1, width: to } };
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 flex h-80 justify-center overflow-hidden ${className}`} aria-hidden="true">
      <motion.div {...open('min(15rem,40vw)', 'min(30rem,48vw)')}
        className="absolute top-0 right-1/2 h-64 bg-[conic-gradient(from_70deg_at_center_top,#f59a3c_0deg,transparent_180deg,transparent_360deg)] [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,black_15%,transparent_95%),linear-gradient(to_left,black_45%,transparent)]" />
      <motion.div {...open('min(15rem,40vw)', 'min(30rem,48vw)')}
        className="absolute top-0 left-1/2 h-64 bg-[conic-gradient(from_290deg_at_center_top,transparent_0deg,transparent_180deg,#f59a3c_360deg)] [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,black_15%,transparent_95%),linear-gradient(to_right,black_45%,transparent)]" />
      <div className="absolute top-0 h-36 w-[min(28rem,80vw)] -translate-y-1/2 rounded-full bg-[#f59a3c] opacity-40 blur-3xl" />
      <motion.div {...open('min(8rem,30vw)', 'min(16rem,50vw)')} className="absolute top-0 h-28 -translate-y-1/2 rounded-full bg-[#ffb35c] opacity-60 blur-2xl" />
      <motion.div {...open('min(15rem,40vw)', 'min(30rem,80vw)')} className="absolute top-0 h-0.5 bg-linear-to-r from-transparent via-[#ffd9a3] to-transparent" />
    </div>
  );
}
