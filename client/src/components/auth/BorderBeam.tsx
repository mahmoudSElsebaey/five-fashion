import { motion } from 'framer-motion';

/** Subtle light beam that travels the card border (21st Sign-In Card inspired). */
export function BorderBeam({
  size = 120,
  duration = 8,
  delay = 0,
}: {
  size?: number;
  duration?: number;
  delay?: number;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <motion.div
        className="absolute top-0 aspect-square"
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          opacity: 0.85,
          offsetRotate: '0deg',
        }}
        initial={{ offsetDistance: '0%' }}
        animate={{ offsetDistance: '100%' }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute top-0 aspect-square"
        style={{
          width: size * 0.7,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 55%, white) 0%, transparent 72%)',
          opacity: 0.55,
          offsetRotate: '0deg',
        }}
        initial={{ offsetDistance: '50%' }}
        animate={{ offsetDistance: '150%' }}
        transition={{
          duration: duration * 1.15,
          delay: delay + 0.4,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}
