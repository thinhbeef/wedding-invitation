import type { CSSProperties, ReactNode } from 'react';
import { motion, useReducedMotion, type TargetAndTransition } from 'framer-motion';
import { Sprig } from '../common/Botanical';

export const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, amount: 0.2 } as const;

interface TitleProps {
  script?: string;
  title: ReactNode;
  subtitle?: ReactNode;
}

/** Giữ chữ viết tay và nhành lá của thiết kế thiệp. */
export function SectionTitle({ script, title, subtitle }: TitleProps) {
  return (
    <div className="section-heading">
      {script && <WriteIn className="section-heading-script">{script}</WriteIn>}
      <Reveal>
        <h2>{title}</h2>
        <Sprig className="section-heading-sprig" />
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p className="section-heading-note">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}

type Effect = 'up' | 'left' | 'right' | 'scale' | 'blur';

const FROM: Record<Effect, TargetAndTransition> = {
  up: { opacity: 0, y: 28 },
  left: { opacity: 0, x: -36 },
  right: { opacity: 0, x: 36 },
  scale: { opacity: 0, scale: 0.94 },
  blur: { opacity: 0, y: 10 },
};
const TO: TargetAndTransition = { opacity: 1, x: 0, y: 0, scale: 1 };

interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  effect?: Effect;
  duration?: number;
}

/** Hiện ra khi cuộn tới (chỉ một lần). */
export function Reveal({ children, className, style, delay = 0, effect = 'up', duration = 0.65 }: RevealProps) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return <div className={className} style={style}>{children}</div>;
  return (
    <motion.div
      className={className}
      style={style}
      initial={FROM[effect]}
      whileInView={TO}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Chữ hiện ra như đang được viết từ trái sang phải. */
export function WriteIn({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return <p className={className}>{children}</p>;
  return (
    <motion.p
      className={className}
      initial={{ clipPath: 'inset(-20% 100% -20% 0)', opacity: 0.3 }}
      whileInView={{ clipPath: 'inset(-20% -5% -20% 0)', opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.4, delay, ease: [0.45, 0, 0.25, 1] }}
    >
      {children}
    </motion.p>
  );
}

/** Ảnh hé lộ như kéo rèm từ dưới lên, kèm zoom chậm. */
export function ImageReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={`overflow-hidden ${className ?? ''}`}
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
      viewport={VIEWPORT}
      transition={{ duration: 1.3, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        initial={{ scale: 1.18 }}
        whileInView={{ scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 2.2, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
