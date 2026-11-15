import { useCallback, useEffect, useRef, useState } from 'react';

export type MusicStatus = 'idle' | 'playing' | 'paused' | 'unavailable';

/** Quản lý nhạc nền: một thẻ <audio> duy nhất tồn tại suốt vòng đời ứng dụng. */
export function useBackgroundMusic(src: string | string[]) {
  const sources = Array.isArray(src) ? src.filter(Boolean) : [src].filter(Boolean);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sourceIndexRef = useRef(0);
  const [status, setStatus] = useState<MusicStatus>('idle');
  const [volume, setVolumeState] = useState(0.6);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'none';
    audio.volume = 0.6;
    audio.src = sources[0] ?? '';
    audioRef.current = audio;

    const onPlay = () => setStatus('playing');
    const onPause = () => setStatus((s) => (s === 'unavailable' ? s : 'paused'));
    const onError = () => {
      const nextIndex = sourceIndexRef.current + 1;
      if (nextIndex < sources.length) {
        sourceIndexRef.current = nextIndex;
        audio.src = sources[nextIndex];
        audio.load();
        audio.play().catch(() => setStatus('paused'));
        return;
      }
      setStatus('unavailable');
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audioRef.current = null;
    };
  }, [sources]);

  /** Phải được gọi trong một thao tác của người dùng (click/tap). */
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || status === 'unavailable') return;
    audio.play().catch(() => {
      // File thiếu hoặc trình duyệt chặn – lỗi file sẽ được bắt bởi sự kiện "error"
      setStatus((s) => (s === 'unavailable' ? s : 'paused'));
    });
  }, [status]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) play();
    else audio.pause();
  }, [play]);

  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
    if (audioRef.current) audioRef.current.volume = value;
  }, []);

  return { status, volume, play, toggle, setVolume };
}
