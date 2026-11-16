import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Music2, Volume2, VolumeX } from 'lucide-react';
import type { MusicStatus } from '../../hooks/useBackgroundMusic';

interface Props {
  status: MusicStatus;
  volume: number;
  onToggle: () => void;
  onVolumeChange: (value: number) => void;
}

function Bars({ active }: { active: boolean }) {
  return (
    <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
      {[0.55, 1, 0.7, 0.85].map((h, i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full bg-current"
          initial={false}
          animate={active ? { height: ['30%', `${h * 100}%`, '45%', `${h * 80}%`, '30%'] } : { height: '25%' }}
          transition={active ? { duration: 1.1 + i * 0.15, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
        />
      ))}
    </span>
  );
}

/** Nút nhạc nổi góc phải – giữ trạng thái khi chuyển màn hình vì nằm ngoài các screen. */
export function MusicPlayer({ status, volume, onToggle, onVolumeChange }: Props) {
  const [showVolume, setShowVolume] = useState(false);
  const [hintDone, setHintDone] = useState(false);
  const playing = status === 'playing';
  const unavailable = status === 'unavailable';
  // Gợi ý nhỏ khi trình duyệt chưa cho tự phát: biến mất khi nhạc chạy hoặc sau vài giây
  const showHint = status === 'idle' && !hintDone;

  useEffect(() => {
    const timer = window.setTimeout(() => setHintDone(true), 10000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed top-[max(env(safe-area-inset-top),1rem)] right-4 z-40 flex items-center gap-2 md:right-6"
      onMouseEnter={() => setShowVolume(true)}
      onMouseLeave={() => setShowVolume(false)}
    >
      <AnimatePresence>
        {showHint && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 2 } }}
            exit={{ opacity: 0, transition: { delay: 0 } }}
            className="rounded-full border border-olive/15 bg-warm/85 px-3 py-1.5 text-xs text-olive-deep backdrop-blur-md"
          >
            Chạm để bật nhạc
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVolume && !unavailable && (
          <motion.label
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="hidden items-center gap-2 rounded-full border border-olive/15 bg-warm/80 px-3 py-2 text-olive backdrop-blur-md md:flex"
          >
            {volume === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            <span className="sr-only">Âm lượng</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="h-1 w-20 cursor-pointer accent-olive"
            />
          </motion.label>
        )}
      </AnimatePresence>

      <button
        type="button"
        data-music-toggle
        onClick={onToggle}
        disabled={unavailable}
        title={unavailable ? 'Chưa có nhạc nền' : playing ? 'Tạm dừng nhạc' : 'Phát nhạc'}
        aria-label={unavailable ? 'Chưa có nhạc nền' : playing ? 'Tạm dừng nhạc' : 'Phát nhạc'}
        aria-pressed={playing}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-olive/20 bg-warm/80 text-olive shadow-[0_8px_24px_-14px_rgb(52_59_48/0.5)] backdrop-blur-md transition hover:border-olive/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {playing && (
          <motion.span
            className="absolute inset-0 rounded-full border border-olive/30"
            animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        {unavailable ? <Music2 className="h-4 w-4 opacity-60" /> : <Bars active={playing} />}
      </button>
    </div>
  );
}
