import { MotionConfig, useReducedMotion } from 'motion/react';
import { BackgroundBeams } from './background-beams';

export default function StudioBeams() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;
  return <MotionConfig reducedMotion="user"><BackgroundBeams className="pointer-events-none opacity-70" /></MotionConfig>;
}
