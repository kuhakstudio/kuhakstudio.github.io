// Adapted from Aceternity UI 3D Card Effect (Manu Arora).
// https://ui.aceternity.com/components/3d-card-effect
// Tilts its host card towards the mouse; children marked data-tilt-z="40" lift towards the
// viewer while hovered. The host needs `[transform-style:preserve-3d]` and a parent with
// `[perspective:1000px]`. Mouse only, and off under reduced motion.
import { useEffect, useRef } from 'react';
import { hostOf, useFinePointer, useMotionAllowed } from './host';

export default function TiltCard() {
  const ref = useRef<HTMLSpanElement>(null);
  const allowed = useMotionAllowed();
  const fine = useFinePointer();

  useEffect(() => {
    const host = hostOf(ref.current);
    if (!host || !allowed || !fine) return;
    const items = [...host.querySelectorAll<HTMLElement>('[data-tilt-z]')];
    const move = (event: PointerEvent) => {
      const { left, top, width, height } = host.getBoundingClientRect();
      host.style.transform = `rotateY(${(event.clientX - left - width / 2) / 25}deg) rotateX(${(event.clientY - top - height / 2) / 25}deg)`;
    };
    const enter = () => items.forEach(item => { item.style.transform = `translateZ(${item.dataset.tiltZ}px)`; });
    const leave = () => {
      host.style.transform = 'rotateY(0deg) rotateX(0deg)';
      items.forEach(item => { item.style.transform = 'translateZ(0px)'; });
    };
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerenter', enter);
    host.addEventListener('pointerleave', leave);
    return () => {
      host.removeEventListener('pointermove', move); host.removeEventListener('pointerenter', enter);
      host.removeEventListener('pointerleave', leave); leave();
    };
  }, [allowed, fine]);

  return <span ref={ref} hidden />;
}
