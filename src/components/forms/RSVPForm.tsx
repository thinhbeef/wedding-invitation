import { useCallback, useMemo, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Heart, MessageCircle, Minus, Plus, Send, X } from 'lucide-react';
import { useClipboard } from '../../hooks/useClipboard';
import {
  buildRsvpMessage,
  copyAndOpenZalo,
  getSmsUrl,
  type Attendance,
  type RsvpPayload,
} from '../../utils/messaging';
import { createSubmissionId, isSheetConfigured, submitRsvpToSheet } from '../../utils/rsvpSheet';
import { Button, LinkButton } from '../common/Button';
import { displayCouple } from '../../data/weddingData';
import { invitationVariant, type SessionId } from '../../data/invitationVariant';

type Errors = Partial<Record<'name' | 'phone' | 'attendance' | 'sessionId', string>>;

const LABEL = 'mb-2 block text-xs font-medium tracking-[0.18em] text-olive-deep uppercase';
const ERROR_TEXT = 'mt-1.5 block text-xs text-[#9b5b4b]';
const PANEL_MOTION = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
} as const;

function validate(data: Omit<RsvpPayload, 'attendance'> & { attendance: Attendance | null }): Errors {
  const errors: Errors = {};
  if (data.name.trim().length < 2) errors.name = 'Vui lòng nhập họ và tên.';
  if (data.phone.trim() && !/^[+\d][\d\s.-]{7,15}$/.test(data.phone.trim())) errors.phone = 'Số điện thoại chưa hợp lệ.';
  if (!data.attendance) errors.attendance = 'Vui lòng cho biết quý khách có thể tham dự hay không.';
  if (invitationVariant.isBride && data.attendance === 'yes'
    && !invitationVariant.sessions.some((session) => session.id === data.sessionId)) {
    errors.sessionId = 'Vui lòng chọn cữ tiệc quý khách sẽ tham dự.';
  }
  return errors;
}

/**
 * Form xác nhận tham dự. Khi `rsvp.sheetUrl` đã được cấu hình, thông tin được gửi thẳng vào Google Sheet
 * (qua Apps Script, không cần database). Nếu chưa cấu hình hoặc gửi lỗi, khách có thể dùng cách dự phòng:
 * soạn thành tin nhắn để tự gửi qua Zalo / SMS.
 */
export function RSVPForm({ maxGuests }: { maxGuests: number }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState('');
  const [sessionId, setSessionId] = useState<SessionId | null>(invitationVariant.session?.id ?? null);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<'rejected' | 'unconfirmed' | null>(null);
  const [sent, setSent] = useState<{ name: string; attendance: Attendance; hasWish: boolean } | null>(null);
  const [prepared, setPrepared] = useState<string | null>(null);
  const [zaloNote, setZaloNote] = useState<string | null>(null);
  const { copied, copy, flash } = useClipboard();
  const submitting = useRef(false);
  const lastAttempt = useRef<{ payload: string; id: string } | null>(null);

  const sheetReady = isSheetConfigured();
  const smsUrl = useMemo(() => (prepared ? getSmsUrl(prepared) : null), [prepared]);
  const focusConfirmation = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    node.focus({ preventScroll: true });
    node.scrollIntoView({
      block: 'center',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }, []);

  const openFallback = () => {
    if (!attendance) return;
    setZaloNote(null);
    setPrepared(buildRsvpMessage({ name, phone, attendance, guests, message, sessionId }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    const nextErrors = validate({ name, phone, attendance, guests, message, sessionId });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !attendance) return;

    // Chưa cấu hình Google Sheet: giữ cách cũ (soạn tin nhắn để khách tự gửi)
    if (!sheetReady) {
      openFallback();
      return;
    }

    const data: RsvpPayload = {
      name: name.trim(),
      phone: phone.trim(),
      attendance,
      guests: attendance === 'yes' ? guests : 0,
      message: message.trim(),
      sessionId,
    };
    const payload = JSON.stringify(data);
    // Retry identical data with the same ID. Edited data must not be mistaken for an old submission.
    if (lastAttempt.current?.payload !== payload) {
      lastAttempt.current = { payload, id: createSubmissionId() };
    }

    submitting.current = true;
    setSending(true);
    setSendError(null);
    try {
      const result = await submitRsvpToSheet(data, lastAttempt.current.id, honeypot);
      if (result.status === 'saved') setSent({ name: data.name, attendance: data.attendance, hasWish: Boolean(data.message) });
      else setSendError(result.status);
    } catch {
      setSendError('unconfirmed');
    } finally {
      submitting.current = false;
      setSending(false);
    }
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setAttendance(null);
    setGuests(1);
    setMessage('');
    setSessionId(invitationVariant.session?.id ?? null);
    setErrors({});
    setSendError(null);
    setSent(null);
    setPrepared(null);
    setHoneypot('');
    setZaloNote(null);
    lastAttempt.current = null;
  };

  const handleZalo = async () => {
    if (!prepared) return;
    const { copied: ok, opened } = await copyAndOpenZalo(prepared);
    flash(ok);
    setZaloNote(
      opened
        ? ok
          ? 'Tin nhắn đã được sao chép. Hãy dán (Paste) vào khung chat Zalo vừa mở và bấm Gửi.'
          : 'Đã mở Zalo. Trình duyệt không cho phép sao chép tự động – hãy dùng nút "Sao chép" bên dưới.'
        : 'Tin nhắn đã được sao chép. Bạn hãy dán và gửi cho cô dâu chú rể qua Zalo hoặc tin nhắn nhé.',
    );
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="sent" ref={focusConfirmation} tabIndex={-1} {...PANEL_MOTION} className="py-4 text-center outline-none" role="status">
            <Heart className="mx-auto h-8 w-8 text-olive" strokeWidth={1.2} fill={sent.attendance === 'yes' ? 'currentColor' : 'none'} />
            <p className="mt-4 font-serif text-2xl">
              {sent.attendance === 'yes' ? 'Cảm ơn quý khách đã xác nhận!' : 'Cảm ơn quý khách đã phản hồi!'}
            </p>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-forest/75">
              {sent.attendance === 'yes'
                ? `Gia đình đã nhận được xác nhận của ${sent.name}. Rất mong được đón tiếp quý khách trong ngày vui!`
                : `Gia đình đã nhận được phản hồi của ${sent.name}. Cảm ơn quý khách đã dành tình cảm cho cô dâu và chú rể. Mong có dịp gặp lại quý khách!`}
            </p>
            {sent.hasWish && (
              <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-olive-deep">
                Lời chúc của bạn đã được lưu. Bấm “Xem lời chúc” bên dưới để mở sổ lưu bút nhé.
              </p>
            )}
            <Button variant="ghost" className="mt-6" onClick={resetForm}>
              Gửi xác nhận khác
            </Button>
          </motion.div>
        ) : !prepared ? (
          <motion.form key="form" onSubmit={handleSubmit} noValidate {...PANEL_MOTION} aria-busy={sending}>
            <fieldset disabled={sending} className="min-w-0 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className={LABEL}>Họ và tên *</span>
                  <input
                    className="field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    autoComplete="name"
                    maxLength={60}
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && <span className={ERROR_TEXT}>{errors.name}</span>}
                </label>
                <label className="block">
                  <span className={LABEL}>Số điện thoại</span>
                  <input
                    className="field"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09xx xxx xxx"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={18}
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone && <span className={ERROR_TEXT}>{errors.phone}</span>}
                </label>
              </div>

              <fieldset>
                <legend className={LABEL}>Quý khách có thể tham dự không? *</legend>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { value: 'yes', label: 'Sẽ tham dự', icon: Heart },
                      { value: 'no', label: 'Không thể đến', icon: X },
                    ] as const
                  ).map(({ value, label, icon: Icon }) => {
                    const active = attendance === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setAttendance(value)}
                        aria-pressed={active}
                        className={`flex min-h-12 items-center justify-center gap-2 border px-3 py-2.5 text-sm transition-all duration-300 ${
                          active
                            ? 'border-olive-deep bg-olive-deep text-warm'
                            : 'border-olive/25 bg-transparent text-forest/75 hover:border-olive/60'
                        }`}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.5} fill={active && value === 'yes' ? 'currentColor' : 'none'} />
                        {label}
                      </button>
                    );
                  })}
                </div>
                {errors.attendance && <span className={ERROR_TEXT}>{errors.attendance}</span>}
              </fieldset>

              <AnimatePresence initial={false}>
                {attendance === 'yes' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <span className={LABEL}>Số người tham dự</span>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        disabled={guests <= 1}
                        aria-label="Giảm số người"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-olive/25 text-olive transition hover:bg-olive hover:text-warm disabled:opacity-30"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <output className="w-10 text-center font-serif text-3xl tabular-nums" aria-live="polite">
                        {guests}
                      </output>
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
                        disabled={guests >= maxGuests}
                        aria-label="Tăng số người"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-olive/25 text-olive transition hover:bg-olive hover:text-warm disabled:opacity-30"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <span className="text-sm text-forest/55">người (bao gồm quý khách)</span>
                    </div>
                    {invitationVariant.isBride && (
                      <fieldset className="mt-5">
                        <legend className={LABEL}>Cữ tiệc tham dự *</legend>
                        <div className="flex flex-wrap gap-3">
                          {invitationVariant.sessions.map((session) => (
                            <button
                              key={session.id}
                              type="button"
                              aria-pressed={sessionId === session.id}
                              onClick={() => setSessionId(session.id)}
                              className={`min-h-11 border px-4 py-2 text-sm ${sessionId === session.id ? 'border-olive-deep bg-olive-deep text-warm' : 'border-olive/25 text-forest'}`}
                            >
                              {session.displayTime}
                            </button>
                          ))}
                        </div>
                        {errors.sessionId && <span className={ERROR_TEXT}>{errors.sessionId}</span>}
                      </fieldset>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <label className="block">
                <span className={LABEL}>Lời chúc</span>
                <textarea
                  className="field min-h-24 resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Gửi lời chúc đến ${displayCouple[0].name} và ${displayCouple[1].name}…`}
                  maxLength={400}
                  rows={3}
                  aria-describedby={sheetReady ? 'wish-visibility-note' : undefined}
                />
                {sheetReady && (
                  <span id="wish-visibility-note" className="mt-2 block text-xs leading-relaxed text-forest/60">
                    Tên và lời chúc của bạn sẽ xuất hiện trong sổ lưu bút để mọi người cùng đọc.
                  </span>
                )}
              </label>

              {/* Ô bẫy chống bot: người thật không thấy và không điền */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              {sendError && (
                <p role="alert" className="rounded-xl bg-[#9b5b4b]/10 px-4 py-3 text-sm leading-relaxed text-forest/85">
                  {sendError === 'unconfirmed'
                    ? 'Chưa biết xác nhận đã gửi thành công hay chưa. Bạn bấm “Gửi lại” nhé, không cần điền lại thông tin.'
                    : 'Chưa lưu được xác nhận. Bạn vui lòng thử lại sau một chút.'}{' '}
                  Bạn cũng có thể{' '}
                  <button type="button" onClick={openFallback} className="underline underline-offset-4">
                    gửi qua Zalo / tin nhắn
                  </button>{' '}
                  nhé.
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto"
                disabled={sending}
                icon={<Send className="h-4 w-4" strokeWidth={1.5} />}
              >
                {sending ? 'Đang gửi…' : sendError ? 'Gửi lại' : sheetReady ? 'Gửi xác nhận' : 'Soạn tin xác nhận'}
              </Button>
            </fieldset>
          </motion.form>
        ) : (
          <motion.div key="preview" {...PANEL_MOTION}>
            <p className="eyebrow">Bước cuối · Gửi tin nhắn</p>
            <p className="mt-2 text-sm leading-relaxed text-forest/70">
              Tin nhắn xác nhận đã được soạn sẵn. Bạn hãy gửi tin nhắn này cho cô dâu chú rể để hoàn tất.
            </p>
            <pre className="mt-4 max-h-56 overflow-auto border border-olive/20 bg-ivory p-4 font-sans text-[0.85rem] leading-relaxed whitespace-pre-wrap text-forest/85">
              {prepared}
            </pre>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={handleZalo} icon={<MessageCircle className="h-4 w-4" strokeWidth={1.5} />} title="Sao chép tin nhắn và mở Zalo">
                Gửi qua Zalo
              </Button>
              {smsUrl && (
                <LinkButton href={smsUrl} variant="outline" icon={<Send className="h-4 w-4" strokeWidth={1.5} />}>
                  Gửi SMS
                </LinkButton>
              )}
              <Button
                variant="outline"
                onClick={() => copy(prepared)}
                icon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" strokeWidth={1.5} />}
              >
                {copied === null ? 'Sao chép' : copied ? 'Đã sao chép' : 'Không sao chép được'}
              </Button>
              <Button variant="ghost" onClick={() => setPrepared(null)}>
                Chỉnh sửa
              </Button>
            </div>

            <AnimatePresence>
              {zaloNote && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 rounded-xl bg-sage/15 px-4 py-3 text-sm leading-relaxed text-forest/80"
                  role="status"
                >
                  {zaloNote}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
