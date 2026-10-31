// Adapted from Aceternity UI Background Gradient Animation (Manu Arora).
// https://ui.aceternity.com/components/background-gradient-animation
// Behind the whole site: five large blobs that drift and merge (goo filter + blur, blend mode)
// and one that follows the mouse. Colours are theme tokens on <html> (--g-start/--g-end base,
// --g1..--g5 and --g-pointer as "r,g,b", --g-blend, --g-alpha; see lib/theme.ts), so dark and
// light each have their own palette. Motion replays the original keyframes (same durations and
// easing) because the site keeps no custom CSS. Phones and Safari take the component's own
// lighter path (plain blur, no goo filter, three blobs, no mouse blob); reduced motion: still.
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';
import { useFinePointer, useMotionAllowed } from './host';

const ease = [0.25, 0.1, 0.25, 1] as const; // CSS "ease"
const blob = 'absolute top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] size-(--size) [mix-blend-mode:var(--g-blend)] will-change-transform';
const blobs = [
  { // first: moveVertical 30s ease
    className: '[background:radial-gradient(circle_at_center,rgba(var(--g1),.8)_0,rgba(var(--g1),0)_50%)_no-repeat] origin-center',
    animate: { y: ['-50%', '50%', '-50%'] }, transition: { duration: 30, ease },
  },
  { // second: moveInCircle 20s reverse
    className: '[background:radial-gradient(circle_at_center,rgba(var(--g2),.8)_0,rgba(var(--g2),0)_50%)_no-repeat] origin-[calc(50%-400px)]',
    animate: { rotate: [360, 180, 0] }, transition: { duration: 20, ease },
  },
  { // third: moveInCircle 40s linear
    className: '[background:radial-gradient(circle_at_center,rgba(var(--g3),.8)_0,rgba(var(--g3),0)_50%)_no-repeat] origin-[calc(50%+400px)]',
    animate: { rotate: [0, 180, 360] }, transition: { duration: 40, ease: 'linear' as const },
  },
  { // fourth: moveHorizontal 40s ease (desktop only)
    className: 'hidden md:block opacity-70 [background:radial-gradient(circle_at_center,rgba(var(--g4),.8)_0,rgba(var(--g4),0)_50%)_no-repeat] origin-[calc(50%-200px)]',
    animate: { x: ['-50%', '50%', '-50%'], y: ['-10%', '10%', '-10%'] }, transition: { duration: 40, ease },
  },
  { // fifth: moveInCircle 20s ease (desktop only)
    className: 'hidden md:block [background:radial-gradient(circle_at_center,rgba(var(--g5),.8)_0,rgba(var(--g5),0)_50%)_no-repeat] origin-[calc(50%-800px)_calc(50%+800px)]',
    animate: { rotate: [0, 180, 360] }, transition: { duration: 20, ease },
  },
];

export default function BackgroundGradientAnimation() {
  const moving = useMotionAllowed();
  const fine = useFinePointer();
  const [safari, setSafari] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 22 });
  const sy = useSpring(y, { stiffness: 60, damping: 22 });

  useEffect(() => { setSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent)); }, []);
  useEffect(() => {
    if (!moving || !fine) return;
    x.set(innerWidth / 2); y.set(innerHeight / 2);
    const move = (event: PointerEvent) => { x.set(event.clientX); y.set(event.clientY); };
    addEventListener('pointermove', move, { passive: true });
    return () => removeEventListener('pointermove', move);
  }, [moving, fine, x, y]);

  const goo = fine && !safari;
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[linear-gradient(40deg,var(--g-start),var(--g-end))] [--size:80%]" aria-hidden="true">
      <svg className="hidden">
        <defs>
          <filter id="kuhak-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className={`size-full opacity-(--g-alpha) ${goo ? '[filter:url(#kuhak-goo)_blur(40px)]' : 'blur-2xl'}`}>
        {blobs.map((item, index) => (
          <motion.div key={index} className={`${blob} ${item.className}`}
            animate={moving ? item.animate : undefined}
            transition={{ ...item.transition, repeat: Infinity }} />
        ))}
        {moving && fine && (
          <motion.div
            className="absolute -top-1/2 -left-1/2 size-full opacity-70 [background:radial-gradient(circle_at_center,rgba(var(--g-pointer),.8)_0,rgba(var(--g-pointer),0)_50%)_no-repeat] [mix-blend-mode:var(--g-blend)]"
            style={{ x: sx, y: sy }} />
        )}
      </div>
    </div>
  );
}
