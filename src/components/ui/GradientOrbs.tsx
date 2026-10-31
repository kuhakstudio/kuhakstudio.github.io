// Adapted from Aceternity UI Background Gradient Animation (Manu Arora).
// https://ui.aceternity.com/components/background-gradient-animation
// Floating blurred circles in the KUHAK palette (leaf ember, moonlight, river teal, lamp amber,
// crimson). Motion replaces the Tailwind keyframes; soft radial gradients replace the SVG goo
// filter, which is too heavy for budget phones. A moonlight glow follows the mouse on desktop.
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect } from 'react';
import { useFinePointer, useMotionAllowed } from './host';

const orbs = [
  { // ember, top left, like the lit leaves
    className: 'top-[-28vmax] left-[-22vmax] size-[68vmax] bg-[radial-gradient(circle_at_center,rgba(240,79,6,.24)_0%,rgba(240,79,6,.08)_38%,rgba(240,79,6,0)_68%)]',
    animate: { y: ['-10%', '12%', '-10%'], x: ['0%', '6%', '0%'] }, duration: 28,
  },
  { // moonlight, top right
    className: 'top-[-24vmax] right-[-20vmax] size-[62vmax] origin-[35%_65%] bg-[radial-gradient(circle_at_center,rgba(252,238,210,.13)_0%,rgba(252,238,210,.04)_40%,rgba(252,238,210,0)_68%)]',
    animate: { rotate: [0, 360] }, duration: 70, linear: true,
  },
  { // river teal, left middle
    className: 'top-[18%] left-[-38vmax] size-[78vmax] origin-[78%_42%] bg-[radial-gradient(circle_at_center,rgba(28,104,118,.34)_0%,rgba(28,104,118,.1)_42%,rgba(28,104,118,0)_68%)]',
    animate: { rotate: [360, 0] }, duration: 54, linear: true,
  },
  { // lamp amber, bottom right
    className: 'hidden md:block bottom-[-30vmax] right-[-24vmax] size-[64vmax] bg-[radial-gradient(circle_at_center,rgba(202,131,61,.2)_0%,rgba(202,131,61,.06)_40%,rgba(202,131,61,0)_68%)]',
    animate: { x: ['-14%', '14%', '-14%'], y: ['-6%', '6%', '-6%'] }, duration: 40,
  },
  { // crimson, bottom left
    className: 'hidden md:block bottom-[-26vmax] left-[8%] size-[56vmax] origin-[22%_22%] bg-[radial-gradient(circle_at_center,rgba(156,34,10,.22)_0%,rgba(156,34,10,.07)_40%,rgba(156,34,10,0)_68%)]',
    animate: { rotate: [0, 360] }, duration: 48, linear: true,
  },
];

export default function GradientOrbs() {
  const moving = useMotionAllowed();
  const fine = useFinePointer();
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const sx = useSpring(x, { stiffness: 40, damping: 20 });
  const sy = useSpring(y, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (!moving || !fine) return;
    const move = (event: PointerEvent) => { x.set(event.clientX); y.set(event.clientY); };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [moving, fine, x, y]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden [[data-theme=light]_&]:opacity-90" aria-hidden="true">
      {orbs.map((orb, index) => (
        <motion.span
          key={index}
          className={`absolute block rounded-full will-change-transform ${orb.className}`}
          animate={moving ? orb.animate : undefined}
          transition={{ duration: orb.duration, repeat: Infinity, ease: orb.linear ? 'linear' : 'easeInOut' }}
        />
      ))}
      {moving && fine && (
        <motion.span
          className="absolute top-0 left-0 block size-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(252,238,210,.07)_0%,rgba(240,120,60,.04)_35%,rgba(0,0,0,0)_68%)]"
          style={{ x: sx, y: sy }}
        />
      )}
    </div>
  );
}
