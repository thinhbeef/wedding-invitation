import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BookHeart, Heart, LoaderCircle, RefreshCw, X } from 'lucide-react';
import { displayCouple } from '../../data/weddingData';
import { fetchWishesFromSheet, type GuestWish } from '../../utils/rsvpSheet';
import { Button } from '../common/Button';
import '../../styles/guestbook.css';

export function Guestbook() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <div className="guestbook-invitation">
        <BookHeart className="guestbook-invitation-icon" strokeWidth={1.2} aria-hidden="true" />
        <h3>Sổ lưu bút</h3>
        <p>Những lời thương gửi đến {displayCouple[0].name} &amp; {displayCouple[1].name}.</p>
        <Button
          variant="outline"
          className="mt-5"
          icon={<Heart className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />}
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
        >
          Xem lời chúc
        </Button>
      </div>
      {open && <GuestbookDialog onClose={close} />}
    </>
  );
}

function GuestbookDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const [wishes, setWishes] = useState<GuestWish[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async (cursor: number | null = null) => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);
    setError(false);
    try {
      const page = await fetchWishesFromSheet(cursor, controller.signal);
      if (controller.signal.aborted) return;
      setWishes((previous) => {
        if (cursor === null) return page.wishes;
        const ids = new Set(previous.map((wish) => wish.id));
        return [...previous, ...page.wishes.filter((wish) => !ids.has(wish.id))];
      });
      setNextCursor(page.nextCursor);
      setLoaded(true);
    } catch {
      if (!controller.signal.aborted) setError(true);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    titleRef.current?.focus({ preventScroll: true });
    void load();

    return () => {
      requestRef.current?.abort();
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
    };
  }, [load]);

  return createPortal(
    <dialog
      ref={dialogRef}
      className="guestbook-dialog"
      aria-labelledby="guestbook-title"
      aria-describedby="guestbook-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const controls = event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex="0"]');
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === titleRef.current)) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
    >
      <div className="guestbook-content">
        <header className="guestbook-header">
          <button type="button" className="guestbook-close" aria-label="Đóng sổ lưu bút" onClick={onClose}>
            <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
          <BookHeart className="mx-auto h-7 w-7 text-olive" strokeWidth={1.2} aria-hidden="true" />
          <h3 id="guestbook-title" ref={titleRef} tabIndex={-1}>Sổ lưu bút</h3>
          <p id="guestbook-description">Một lời chúc, một niềm vui trong ngày chung đôi.</p>
        </header>

        <div className="guestbook-scroll" role="region" aria-label="Nội dung lời chúc" tabIndex={0} aria-busy={loading}>
          {wishes.length > 0 && (
            <ol className="guestbook-list" aria-label="Những lời chúc, mới nhất trước">
              {wishes.map((wish) => (
                <li key={wish.id} className="guestbook-wish">
                  <Heart className="guestbook-wish-heart" strokeWidth={1.3} aria-hidden="true" />
                  <p className="guestbook-wish-name">{wish.name}</p>
                  <p className="guestbook-wish-message">{wish.message}</p>
                </li>
              ))}
            </ol>
          )}

          {loading && (
            <div className="guestbook-state" role="status">
              <LoaderCircle className="mx-auto mb-3 h-6 w-6 animate-spin text-olive" aria-hidden="true" />
              <p>Đang mở những lời thương…</p>
            </div>
          )}

          {error && (
            <div className="guestbook-state">
              <p role="alert">Chưa tải được lời chúc. Bạn thử lại sau một chút nhé.</p>
              <Button
                variant="outline"
                className="mt-4"
                icon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
                onClick={() => void load(loaded ? nextCursor : null)}
              >
                Thử lại
              </Button>
            </div>
          )}

          {loaded && !loading && !error && wishes.length === 0 && (
            <div className="guestbook-state" role="status">
              <Heart className="mx-auto mb-4 h-8 w-8 text-olive" strokeWidth={1.1} aria-hidden="true" />
              <p className="guestbook-empty-title">Lời chúc đầu tiên đang chờ bạn</p>
              <p>Hãy gửi lời chúc đến cô dâu và chú rể qua biểu mẫu xác nhận nhé.</p>
              <Button variant="outline" className="mt-5" onClick={onClose}>Viết lời chúc</Button>
            </div>
          )}

          {!loading && !error && nextCursor !== null && (
            <div className="guestbook-more">
              <Button variant="outline" onClick={() => void load(nextCursor)}>Xem thêm lời chúc</Button>
            </div>
          )}
        </div>

        <footer className="guestbook-footer">
          Cảm ơn bạn đã góp thêm yêu thương cho ngày vui của chúng mình.
        </footer>
      </div>
    </dialog>,
    document.body,
  );
}
