import { useCallback, useEffect, useRef, useState } from 'react';
import { BookHeart, Heart, LoaderCircle, RefreshCw } from 'lucide-react';
import { displayCouple } from '../../data/weddingData';
import { fetchWishesFromSheet, type GuestWish } from '../../utils/rsvpSheet';
import { Button } from '../common/Button';
import '../../styles/guestbook.css';

export function Guestbook({ refreshVersion = 0 }: { refreshVersion?: number }) {
  const requestRef = useRef<AbortController | null>(null);
  const retryCursorRef = useRef<number | null>(null);
  const [wishes, setWishes] = useState<GuestWish[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async (cursor: number | null = null) => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    retryCursorRef.current = cursor;
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
    void load();
    return () => requestRef.current?.abort();
  }, [load, refreshVersion]);

  return (
    <section id="loi-chuc" className="guestbook" aria-labelledby="guestbook-title">
      <header className="guestbook-header">
        <BookHeart className="guestbook-header-icon" strokeWidth={1.2} aria-hidden="true" />
        <h3 id="guestbook-title">Lời chúc yêu thương</h3>
        <p>Những lời thương gửi đến {displayCouple[0].name} &amp; {displayCouple[1].name}.</p>
      </header>

      <div className="guestbook-body" aria-busy={loading}>
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
            <p>Đang tải những lời thương…</p>
          </div>
        )}

        {error && (
          <div className="guestbook-state">
            <p role="alert">Chưa tải được lời chúc. Bạn thử lại sau một chút nhé.</p>
            <Button
              variant="outline"
              className="mt-4"
              icon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
              onClick={() => void load(retryCursorRef.current)}
            >
              Thử lại
            </Button>
          </div>
        )}

        {loaded && !loading && !error && wishes.length === 0 && (
          <div className="guestbook-state" role="status">
            <Heart className="mx-auto mb-4 h-8 w-8 text-olive" strokeWidth={1.1} aria-hidden="true" />
            <p className="guestbook-empty-title">Lời chúc đầu tiên đang chờ bạn</p>
            <p>Hãy gửi lời chúc đến cô dâu và chú rể qua biểu mẫu phía trên nhé.</p>
          </div>
        )}

        {!loading && !error && nextCursor !== null && (
          <div className="guestbook-more">
            <Button variant="outline" onClick={() => void load(nextCursor)}>Xem thêm lời chúc</Button>
          </div>
        )}
      </div>

      <p className="guestbook-footer">
        Cảm ơn bạn đã góp thêm yêu thương cho ngày vui của chúng mình.
      </p>
    </section>
  );
}
