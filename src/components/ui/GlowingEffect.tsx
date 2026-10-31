// Adapted from Aceternity UI Glowing Effect (Manu Arora).
// https://ui.aceternity.com/components/glowing-effect
// A border glow in ember, lamp amber, moonlight and river teal that follows the mouse round
// its host card (`relative`, rounded). Mouse only; touch screens keep the plain border.
import { animate } from 'motion/react';
import { memo, useCallback, useEffect, useRef, type CSSProperties } from 'react';
import { useFinePointer, useMotionAllowed } from './host';

const gradient = `radial-gradient(circle, #f04f06 10%, #f04f0600 20%),
  radial-gradient(circle at 40% 40%, #ca833d 5%, #ca833d00 15%),
  radial-gradient(circle at 60% 60%, #fceed2 10%, #fceed200 20%),
  radial-gradient(circle at 40% 60%, #2a7d8a 10%, #2a7d8a00 20%),
  repeating-conic-gradient(from 236.84deg at 50% 50%,
    #f04f06 0%, #ca833d calc(25% / var(--repeating-conic-gradient-times)),
    #fceed2 calc(50% / var(--repeating-conic-gradient-times)), #2a7d8a calc(75% / var(--repeating-conic-gradient-times)),
    #f04f06 calc(100% / var(--repeating-conic-gradient-times)))`;

function GlowingEffect({ spread = 40, proximity = 64, inactiveZone = 0.01, borderWidth = 2, movementDuration = 2 }: {
  spread?: number; proximity?: number; inactiveZone?: number; borderWidth?: number; movementDuration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const last = useRef({ x: 0, y: 0 });
  const frame = useRef(0);
  const fine = useFinePointer();
  const allowed = useMotionAllowed();
  const enabled = fine && allowed;

  const handleMove = useCallback((event?: { x: number; y: number }) => {
    if (!ref.current) return;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const element = ref.current;
      if (!element) return;
      const { left, top, width, height } = element.getBoundingClientRect();
      const mouseX = event?.x ?? last.current.x;
      const mouseY = event?.y ?? last.current.y;
      if (event) last.current = { x: mouseX, y: mouseY };
      const center = [left + width * 0.5, top + height * 0.5];
      if (Math.hypot(mouseX - center[0], mouseY - center[1]) < 0.5 * Math.min(width, height) * inactiveZone) {
        element.style.setProperty('--active', '0');
        return;
      }
      const active = mouseX > left - proximity && mouseX < left + width + proximity && mouseY > top - proximity && mouseY < top + height + proximity;
      element.style.setProperty('--active', active ? '1' : '0');
      if (!active) return;
      const current = parseFloat(element.style.getPropertyValue('--start')) || 0;
      const target = (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) / Math.PI + 90;
      animate(current, current + (((target - current + 180) % 360) - 180), {
        duration: movementDuration, ease: [0.16, 1, 0.3, 1],
        onUpdate: value => element.style.setProperty('--start', String(value)),
      });
    });
  }, [inactiveZone, proximity, movementDuration]);

  useEffect(() => {
    if (!enabled) return;
    const scroll = () => handleMove();
    const pointer = (event: PointerEvent) => handleMove(event);
    window.addEventListener('scroll', scroll, { passive: true });
    document.body.addEventListener('pointermove', pointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener('scroll', scroll);
      document.body.removeEventListener('pointermove', pointer);
    };
  }, [handleMove, enabled]);

  if (!enabled) return null;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        '--spread': spread, '--start': '0', '--active': '0', '--glowingeffect-border-width': `${borderWidth}px`,
        '--repeating-conic-gradient-times': '5', '--gradient': gradient,
      } as CSSProperties}
      className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
    >
      <div className={[
        'rounded-[inherit]',
        'after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))] after:rounded-[inherit] after:content-[""]',
        'after:[border:var(--glowingeffect-border-width)_solid_transparent]',
        'after:[background:var(--gradient)] after:[background-attachment:fixed]',
        'after:opacity-[var(--active)] after:transition-opacity after:duration-300',
        'after:[mask-clip:padding-box,border-box] after:[mask-composite:intersect]',
        'after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]',
      ].join(' ')} />
    </div>
  );
}

export default memo(GlowingEffect);
