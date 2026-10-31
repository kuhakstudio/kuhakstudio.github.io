// Adapted from Aceternity UI Hover Border Gradient (Manu Arora).
// https://ui.aceternity.com/components/hover-border-gradient
// The moving light only: place it inside a `relative rounded-full p-px` link whose content
// sits above it on a solid background. Moonlight circles the border; hovering turns it ember.
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { hostOf, useMotionAllowed } from './host';

type Direction = 'TOP' | 'LEFT' | 'BOTTOM' | 'RIGHT';
const order: Direction[] = ['TOP', 'LEFT', 'BOTTOM', 'RIGHT'];
const light = 'hsl(40, 90%, 90%)';
const moving: Record<Direction, string> = {
  TOP: `radial-gradient(20.7% 50% at 50% 0%, ${light} 0%, rgba(255, 255, 255, 0) 100%)`,
  LEFT: `radial-gradient(16.6% 43.1% at 0% 50%, ${light} 0%, rgba(255, 255, 255, 0) 100%)`,
  BOTTOM: `radial-gradient(20.7% 50% at 50% 100%, ${light} 0%, rgba(255, 255, 255, 0) 100%)`,
  RIGHT: `radial-gradient(16.2% 41.2% at 100% 50%, ${light} 0%, rgba(255, 255, 255, 0) 100%)`,
};
const highlight = 'radial-gradient(75% 181.16% at 50% 50%, #f04f06 0%, rgba(255, 255, 255, 0) 100%)';

export default function BorderGlow({ duration = 1 }: { duration?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const allowed = useMotionAllowed();
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<Direction>('TOP');

  useEffect(() => {
    const host = hostOf(ref.current);
    if (!host) return;
    const enter = () => setHovered(true);
    const leave = () => setHovered(false);
    host.addEventListener('pointerenter', enter);
    host.addEventListener('pointerleave', leave);
    host.addEventListener('focus', enter);
    host.addEventListener('blur', leave);
    return () => {
      host.removeEventListener('pointerenter', enter); host.removeEventListener('pointerleave', leave);
      host.removeEventListener('focus', enter); host.removeEventListener('blur', leave);
    };
  }, []);

  useEffect(() => {
    if (hovered || !allowed) return;
    const timer = setInterval(() => setDirection(d => order[(order.indexOf(d) + order.length - 1) % order.length]), duration * 1000);
    return () => clearInterval(timer);
  }, [hovered, allowed, duration]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit] blur-[2px]"
      initial={{ background: moving[direction] }}
      animate={{ background: hovered ? [moving[direction], highlight] : moving[direction] }}
      transition={{ ease: 'linear', duration }}
    />
  );
}
