import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';

type Point = [number, number];

function bezier(t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
}

function tangentAngle(t: number, p0: Point, p1: Point, p2: Point, p3: Point): number {
  const a = bezier(Math.max(0, t - 0.01), p0, p1, p2, p3);
  const b = bezier(Math.min(1, t + 0.01), p0, p1, p2, p3);
  return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
}

const LEAF = 'M0 0 C 5 -6.5, 15 -7.5, 24 0 C 15 7.5, 5 6.5, 0 0 Z';

interface BranchProps {
  className?: string;
  style?: CSSProperties;
  leafColor?: string;
  stemColor?: string;
  leaves?: number;
  /** Vẽ nét (line-art) thay vì tô màu */
  outline?: boolean;
}

/** Cành lá vẽ bằng SVG – nhẹ, sắc nét ở mọi kích thước. */
export function BotanicalBranch({
  className,
  style,
  leafColor = 'var(--color-sage)',
  stemColor = 'var(--color-olive)',
  leaves = 9,
  outline = false,
}: BranchProps) {
  const p0: Point = [8, 192];
  const p1: Point = [50, 150];
  const p2: Point = [90, 70];
  const p3: Point = [188, 14];

  const items = Array.from({ length: leaves }, (_, i) => {
    const t = 0.1 + (i / leaves) * 0.88;
    const [x, y] = bezier(t, p0, p1, p2, p3);
    const angle = tangentAngle(t, p0, p1, p2, p3);
    const side = i % 2 === 0 ? -1 : 1;
    const scale = 0.75 + (1 - t) * 0.55;
    return { x, y, rotate: angle + side * 48, scale, key: i };
  });
  const [tx, ty] = p3;

  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden="true" fill="none">
      <path
        d={`M${p0} C${p1} ${p2} ${p3}`}
        stroke={stemColor}
        strokeWidth={1.1}
        strokeLinecap="round"
        opacity={0.75}
      />
      {items.map((leaf) => (
        <g key={leaf.key} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rotate}) scale(${leaf.scale})`}>
          <path
            d={LEAF}
            fill={outline ? 'none' : leafColor}
            stroke={outline ? stemColor : 'none'}
            strokeWidth={outline ? 0.9 : 0}
            opacity={outline ? 0.8 : 0.55 + (leaf.key % 3) * 0.12}
          />
          <path d="M1 0 L20 0" stroke={stemColor} strokeWidth={0.5} opacity={0.35} />
        </g>
      ))}
      <g transform={`translate(${tx} ${ty}) rotate(-30)`}>
        <path d={LEAF} fill={outline ? 'none' : leafColor} stroke={outline ? stemColor : 'none'} strokeWidth={0.9} opacity={0.7} />
      </g>
    </svg>
  );
}

/** Hoa nhỏ 5 cánh làm điểm nhấn. */
export function Blossom({ className, color = 'var(--color-champagne)' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <ellipse key={i} cx="20" cy="11" rx="5.5" ry="9" fill={color} opacity={0.75} transform={`rotate(${i * 72} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="3.2" fill="var(--color-olive)" opacity={0.7} />
    </svg>
  );
}

/** Dải trang trí mảnh: — ✦ — */
export function Ornament({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className ?? ''}`} aria-hidden="true">
      <span className="h-px w-10 bg-linear-to-r from-transparent to-olive/50" />
      <svg viewBox="0 0 24 24" className="h-3 w-3 text-champagne">
        <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill="currentColor" />
      </svg>
      <span className="h-px w-10 bg-linear-to-l from-transparent to-olive/50" />
    </div>
  );
}

/** Nhành lá nằm ngang, nét mảnh – dùng làm đường phân cách. `animated`: tự vẽ khi cuộn tới. */
export function Sprig({ className, animated = false, delay = 0 }: { className?: string; animated?: boolean; delay?: number }) {
  const leaves = [18, 30, 42, 54, 66, 78];
  const view = animated ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.5 } } : {};
  return (
    <motion.svg viewBox="0 0 120 24" className={className} fill="none" aria-hidden="true" {...view}>
      <motion.path
        d="M6 12 C 40 10, 80 14, 114 12"
        stroke="var(--color-olive)"
        strokeWidth="0.8"
        strokeLinecap="round"
        variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 1.2, delay, ease: 'easeInOut' } } }}
      />
      {leaves.map((x, i) => (
        <motion.path
          key={x}
          d={i % 2 === 0 ? `M${x} 12 C ${x + 2} 6, ${x + 8} 4, ${x + 11} 5 C ${x + 9} 9, ${x + 5} 12, ${x} 12 Z` : `M${x} 12 C ${x + 2} 18, ${x + 8} 20, ${x + 11} 19 C ${x + 9} 15, ${x + 5} 12, ${x} 12 Z`}
          fill="var(--color-sage)"
          stroke="var(--color-olive)"
          strokeWidth="0.5"
          style={{ transformOrigin: `${x}px 12px` }}
          variants={{ hidden: { scale: 0, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { duration: 0.5, delay: delay + 0.3 + i * 0.12 } } }}
        />
      ))}
      <motion.circle
        cx="114"
        cy="12"
        r="1.6"
        fill="var(--color-champagne)"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: delay + 1.1 } } }}
      />
    </motion.svg>
  );
}

const FALLING = [
  { left: '8%', size: 14, duration: 15, delay: 0, drift: 40 },
  { left: '24%', size: 10, duration: 19, delay: 5, drift: -30 },
  { left: '46%', size: 12, duration: 17, delay: 9, drift: 50 },
  { left: '68%', size: 9, duration: 21, delay: 2, drift: -40 },
  { left: '86%', size: 13, duration: 16, delay: 7, drift: 30 },
];

/** Vài chiếc lá rơi rất chậm phía sau nội dung. */
export function FallingLeaves({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {FALLING.map((leaf) => (
        <motion.svg
          key={leaf.left}
          viewBox="0 0 24 12"
          className="absolute -top-6"
          style={{ left: leaf.left, width: leaf.size * 1.6, height: leaf.size }}
          animate={{ y: ['0vh', '110vh'], x: [0, leaf.drift, 0], rotate: [0, 180, 360], opacity: [0, 0.7, 0.7, 0] }}
          transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: 'linear' }}
        >
          <path d="M0 6 C 5 -0.5, 15 -1.5, 24 6 C 15 13.5, 5 12.5, 0 6 Z" fill="var(--color-sage)" />
        </motion.svg>
      ))}
    </div>
  );
}
