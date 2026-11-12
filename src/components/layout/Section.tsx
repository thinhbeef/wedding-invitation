import type { CSSProperties, ReactNode } from 'react';
import { motion, type TargetAndTransition } from 'framer-motion';
import { Sprig } from '../common/Botanical';

export const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, amount: 0.2 } as const;

interface TitleProps {
  script: string;
  title: ReactNode;
  subtitle?: ReactNode;
}

/** Tiêu đề section: chữ viết tay "viết" ra từ trái sang, tiêu đề hiện dần, nhành lá tự vẽ. */
export function SectionTitle({ script, title, subtitle }: TitleProps) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <WriteIn className="font-script text-3xl leading-none text-olive sm:text-4xl">{script}</WriteIn>
      <Reveal delay={0.25}>
        <h2 className="mt-3 font-serif text-[1.8rem] leading-tight font-normal text-forest sm:text-[2.6rem]">{title}</h2>
      </Reveal>
      <Sprig className="mx-auto mt-4 h-5 w-24" animated delay={0.5} />
      {subtitle && (
        <Reveal delay={0.6}>
          <p className="mt-4 text-[0.95rem] text-forest/70">{subtitle}</p>
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
  blur: { opacity: 0, filter: 'blur(10px)', y: 10 },
};
const TO: TargetAndTransition = { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' };

interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  effect?: Effect;
  duration?: number;
}

/** Hiện ra khi cuộn tới (chỉ một lần). */
export function Reveal({ children, className, style, delay = 0, effect = 'up', duration = 0.9 }: RevealProps) {
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
