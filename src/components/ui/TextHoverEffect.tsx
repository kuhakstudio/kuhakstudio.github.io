// Adapted from Aceternity UI Text Hover Effect (Manu Arora).
// https://ui.aceternity.com/components/text-hover-effect
// The footer wordmark in Cinzel: an ivory outline that draws itself, and an ember-to-moonlight
// gradient revealed around the mouse.
import { motion } from 'motion/react';
import { useId, useRef, useState } from 'react';
import { useMotionAllowed } from './host';

export default function TextHoverEffect({ text }: { text: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const id = useId().replace(/:/g, '');
  const allowed = useMotionAllowed();
  const [hovered, setHovered] = useState(false);
  const [mask, setMask] = useState({ cx: '50%', cy: '50%' });
  const textProps = {
    x: '50%', y: '54%', textAnchor: 'middle' as const, dominantBaseline: 'middle' as const,
    textLength: 960, lengthAdjust: 'spacingAndGlyphs' as const, strokeWidth: 1,
    className: "fill-transparent font-['Cinzel'] text-[132px] font-semibold",
  };
  return (
    <svg
      ref={svg}
      viewBox="0 0 1000 170"
      xmlns="http://www.w3.org/2000/svg"
      className="block h-auto w-full select-none"
      aria-hidden="true"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerMove={event => {
        const box = svg.current?.getBoundingClientRect();
        if (box) setMask({ cx: `${((event.clientX - box.left) / box.width) * 100}%`, cy: `${((event.clientY - box.top) / box.height) * 100}%` });
      }}
    >
      <defs>
        <linearGradient id={`${id}-text`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0">
          <stop offset="0%" stopColor="#f04f06" />
          <stop offset="30%" stopColor="#f59a3c" />
          <stop offset="55%" stopColor="#fceed2" />
          <stop offset="80%" stopColor="#ca833d" />
          <stop offset="100%" stopColor="#2a7d8a" />
        </linearGradient>
        <motion.radialGradient id={`${id}-reveal`} gradientUnits="userSpaceOnUse" r="22%" initial={{ cx: '50%', cy: '50%' }} animate={mask} transition={{ duration: 0.12, ease: 'easeOut' }}>
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id={`${id}-mask`}><rect x="0" y="0" width="100%" height="100%" fill={`url(#${id}-reveal)`} /></mask>
      </defs>
      <text {...textProps} className={`${textProps.className} stroke-(--line)/25 transition-opacity`} style={{ opacity: hovered ? 0.7 : 0 }}>{text}</text>
      <motion.text {...textProps} className={`${textProps.className} stroke-(--line)/20`}
        initial={allowed ? { strokeDashoffset: 1000, strokeDasharray: 1000 } : false}
        whileInView={{ strokeDashoffset: 0, strokeDasharray: 1000 }} viewport={{ once: true }}
        transition={{ duration: 4, ease: 'easeInOut' }}>{text}</motion.text>
      <text {...textProps} stroke={`url(#${id}-text)`} mask={`url(#${id}-mask)`} className={textProps.className}>{text}</text>
    </svg>
  );
}
