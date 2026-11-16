import { useCallback, useEffect, useRef, useState } from 'react';

export type MusicStatus = 'idle' | 'playing' | 'paused' | 'unavailable';

/** Các thao tác được trình duyệt tính là "người dùng đã tương tác" (cuộn trang thì KHÔNG tính). */
const GESTURES = ['pointerup', 'touchend', 'click', 'keydown'] as const;

/**
 * Quản lý nhạc nền: một thẻ <audio> duy nhất tồn tại suốt vòng đời ứng dụng.
 *
 * Trình duyệt (Chrome, Safari, trình duyệt trong Zalo/Facebook…) chặn âm thanh tự phát
 * khi khách chưa tương tác, nên hook làm theo thứ tự:
 *  1) thử phát ngay khi mở trang (thành công nếu trình duyệt cho phép);
 *  2) nếu bị chặn, phát ở lần chạm / bấm phím đầu tiên của khách (kể cả nút "Mở thiệp").
 * Khách đã chủ động tạm dừng thì không tự phát lại.
 * autoStart = false: chờ thao tác mở phong bì gọi play() trước khi phát nhạc.
 */
export function useBackgroundMusic(src: string, autoStart = true) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userPausedRef = useRef(false);
  const [status, setStatus] = useState<MusicStatus>('idle');
  const [volume, setVolumeState] = useState(0.6);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'metadata';
    audio.volume = 0.6;
    audio.src = src;
    audioRef.current = audio;

    const stopWaiting = () => GESTURES.forEach((name) => window.removeEventListener(name, onGesture, true));

    function onGesture(e: Event) {
      if (userPausedRef.current) return stopWaiting();
      // Chạm đúng nút nhạc: để nút tự bật/tắt, tránh bật rồi tắt ngay trong một lần chạm
      if (e.target instanceof Element && e.target.closest('[data-music-toggle]')) return;
      audio.play().then(stopWaiting).catch(() => {
        // Chưa được phép (ví dụ vừa cuộn trang) – chờ lần tương tác kế tiếp
      });
    }

    const onPlay = () => setStatus('playing');
    const onPause = () => setStatus((s) => (s === 'unavailable' ? s : 'paused'));
    const onError = () => {
      setStatus('unavailable');
      stopWaiting();
    };
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    if (autoStart) {
      GESTURES.forEach((name) => window.addEventListener(name, onGesture, true));
      audio.play().then(stopWaiting).catch(() => {
        // Bị chặn tự phát: đã đăng ký sẵn lắng nghe lần tương tác đầu tiên ở trên
      });
    }

    return () => {
      stopWaiting();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
    };
  }, [src, autoStart]);

  /** Gọi trong một thao tác của người dùng (click/tap). */
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || status === 'unavailable') return;
    userPausedRef.current = false;
    audio.play().catch(() => {
      // File thiếu hoặc trình duyệt chặn – lỗi file sẽ được bắt bởi sự kiện "error"
      setStatus((s) => (s === 'unavailable' ? s : 'paused'));
    });
  }, [status]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) play();
    else {
      userPausedRef.current = true;
      audio.pause();
    }
  }, [play]);

  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
    if (audioRef.current) audioRef.current.volume = value;
  }, []);

  return { status, volume, play, toggle, setVolume };
}
