// Adapted from Aceternity UI Card Hover Effect (Manu Arora).
// https://ui.aceternity.com/components/card-hover-effect
// A soft lit panel that glides to whichever child of the host (`relative` grid) the mouse is
// over, instead of re-rendering the cards in React (they keep their translated text).
import { motion, useAnimate } from 'motion/react';
import { useEffect } from 'react';
import { hostOf, useFinePointer, useMotionAllowed } from './host';

export default function HoverHighlight() {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const fine = useFinePointer();
  const allowed = useMotionAllowed();

  useEffect(() => {
    const host = hostOf(scope.current);
    if (!host || !fine) return;
    const cards = [...host.children].filter((child): child is HTMLElement => child instanceof HTMLElement && !child.matches('astro-island'));
    const duration = allowed ? 0.35 : 0;
    const enter = (card: HTMLElement) => () => animate(scope.current, {
      x: card.offsetLeft, y: card.offsetTop, width: card.offsetWidth, height: card.offsetHeight, opacity: 1,
    }, { duration, ease: [0.22, 1, 0.36, 1] });
    const leave = () => animate(scope.current, { opacity: 0 }, { duration: allowed ? 0.25 : 0 });
    const handlers = cards.map(card => { const handler = enter(card); card.addEventListener('pointerenter', handler); return handler; });
    host.addEventListener('pointerleave', leave);
    return () => {
      cards.forEach((card, index) => card.removeEventListener('pointerenter', handlers[index]));
      host.removeEventListener('pointerleave', leave);
    };
  }, [fine, allowed, animate, scope]);

  return (
    <motion.span
      ref={scope}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      className="pointer-events-none absolute top-0 left-0 -z-10 block rounded-2xl border border-[#f0773a]/25 bg-linear-to-br from-(--line)/[.07] via-[#f04f06]/[.05] to-[#1c6876]/[.08] shadow-[0_0_40px_-12px_#f04f06]"
    />
  );
}
