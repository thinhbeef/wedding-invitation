import { useCallback, useEffect, useRef, useState } from 'react';
import { copyText } from '../utils/messaging';

/** Sao chép văn bản và hiển thị trạng thái "đã sao chép" trong vài giây. */
export function useClipboard(resetMs = 2200) {
  const [copied, setCopied] = useState<boolean | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flash = useCallback(
    (ok: boolean) => {
      setCopied(ok);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(null), resetMs);
    },
    [resetMs],
  );

  const copy = useCallback(
    async (text: string) => {
      const ok = await copyText(text);
      flash(ok);
      return ok;
    },
    [flash],
  );

  return { copied, copy, flash };
}
