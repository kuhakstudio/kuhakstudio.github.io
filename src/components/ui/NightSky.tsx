// Adapted from Aceternity UI Stars Background + Shooting Stars (Manu Arora).
// https://ui.aceternity.com/components/shooting-stars-and-stars-background
// Moon-cream twinkling stars on a canvas and an occasional ember shooting star, sized to the
// host section (not the window). Drawing stops while the sky is off screen or the tab is hidden;
// with reduced motion the stars are drawn once and nothing moves.
import { useEffect, useId, useRef, useState } from 'react';
import { useMotionAllowed } from './host';

type Star = { x: number; y: number; r: number; o: number; speed: number | null };
type Shooting = { id: number; x: number; y: number; angle: number; speed: number; distance: number };

export default function NightSky({ density = 0.00016, className = '' }: { density?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const moving = useMotionAllowed();
  const [shooting, setShooting] = useState<Shooting | null>(null);
  const visible = useRef(true);
  const gradient = useId().replace(/:/g, '');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let stars: Star[] = [];
    let frame = 0;
    const build = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width; canvas.height = height;
      stars = Array.from({ length: Math.floor(width * height * density) }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        r: Math.random() * 0.55 + 0.45, o: Math.random() * 0.5 + 0.5,
        speed: Math.random() < 0.75 ? 0.5 + Math.random() * 0.8 : null,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() * 0.001;
      for (const star of stars) {
        if (moving && star.speed !== null) star.o = 0.45 + Math.abs(Math.sin(t / star.speed) * 0.55);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(252, 238, 210, ${star.o})`;
        ctx.fill();
      }
    };
    const loop = () => { if (visible.current && !document.hidden) draw(); frame = requestAnimationFrame(loop); };
    build(); draw();
    const resize = new ResizeObserver(() => { build(); draw(); });
    resize.observe(canvas);
    const seen = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; });
    seen.observe(canvas);
    if (moving) frame = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); seen.disconnect(); };
  }, [density, moving]);

  // One shooting star at a time, every few seconds, from the top or a side edge.
  useEffect(() => {
    if (!moving) return;
    let timer = 0;
    const launch = () => {
      const box = boxRef.current?.getBoundingClientRect();
      if (box && visible.current && !document.hidden) {
        const fromTop = Math.random() < 0.6;
        setShooting({
          id: Date.now(),
          x: fromTop ? Math.random() * box.width * 0.8 : 0,
          y: fromTop ? 0 : Math.random() * box.height * 0.4,
          angle: 20 + Math.random() * 25, speed: 9 + Math.random() * 12, distance: 0,
        });
      }
      timer = window.setTimeout(launch, 2600 + Math.random() * 4200);
    };
    timer = window.setTimeout(launch, 1200);
    return () => clearTimeout(timer);
  }, [moving]);

  useEffect(() => {
    if (!shooting) return;
    const frame = requestAnimationFrame(() => setShooting(previous => {
      if (!previous) return null;
      const box = boxRef.current?.getBoundingClientRect();
      const x = previous.x + previous.speed * Math.cos((previous.angle * Math.PI) / 180);
      const y = previous.y + previous.speed * Math.sin((previous.angle * Math.PI) / 180);
      if (!box || x > box.width + 20 || y > box.height + 20) return null;
      return { ...previous, x, y, distance: previous.distance + previous.speed };
    }));
    return () => cancelAnimationFrame(frame);
  }, [shooting]);

  const length = shooting ? 14 * (1 + shooting.distance / 90) : 0;
  return (
    <div ref={boxRef} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
      <svg className="absolute inset-0 size-full">
        <defs>
          <linearGradient id={gradient} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f04f06" stopOpacity="0" />
            <stop offset="70%" stopColor="#f59a3c" stopOpacity=".7" />
            <stop offset="100%" stopColor="#fff6e2" stopOpacity="1" />
          </linearGradient>
        </defs>
        {shooting && (
          <rect key={shooting.id} x={shooting.x - length} y={shooting.y} width={length} height={1.4} rx={0.7}
            fill={`url(#${gradient})`} transform={`rotate(${shooting.angle}, ${shooting.x}, ${shooting.y})`} />
        )}
      </svg>
    </div>
  );
}
