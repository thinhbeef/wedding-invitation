import { useMemo, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Heart, MessageCircle, Minus, Plus, Send, X } from 'lucide-react';
import { sessions } from '../../data/weddingData';
import { useClipboard } from '../../hooks/useClipboard';
import {
  buildRsvpMessage,
  copyAndOpenZalo,
  getSmsUrl,
  type Attendance,
  type RsvpPayload,
} from '../../utils/messaging';
import { Button, LinkButton } from '../common/Button';

type Errors = Partial<Record<'name' | 'phone' | 'attendance' | 'session', string>>;

function validate(data: Omit<RsvpPayload, 'attendance'> & { attendance: Attendance | null }): Errors {
  const errors: Errors = {};
  if (data.name.trim().length < 2) errors.name = 'Vui lòng nhập họ tên của bạn.';
  if (data.phone.trim() && !/^[+\d][\d\s.-]{7,15}$/.test(data.phone.trim())) errors.phone = 'Số điện thoại chưa hợp lệ.';
  if (!data.attendance) errors.attendance = 'Bạn vui lòng chọn một lựa chọn.';
  if (data.attendance === 'yes' && !data.session) errors.session = 'Bạn vui lòng chọn cữ tiệc.';
  return errors;
}

/**
 * Form xác nhận tham dự. Website KHÔNG lưu dữ liệu –
 * thông tin được soạn thành tin nhắn để khách tự gửi qua Zalo / SMS.
 */
export function RSVPForm({ maxGuests }: { maxGuests: number }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [guests, setGuests] = useState(1);
  const [session, setSession] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [prepared, setPrepared] = useState<string | null>(null);
  const [zaloNote, setZaloNote] = useState<string | null>(null);
  const { copied, copy, flash } = useClipboard();

  const smsUrl = useMemo(() => (prepared ? getSmsUrl(prepared) : null), [prepared]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validate({ name, phone, attendance, guests, session, message });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !attendance) return;
    setZaloNote(null);
    setPrepared(buildRsvpMessage({ name, phone, attendance, guests, session, message }));
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
        {!prepared ? (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-medium tracking-[0.18em] text-olive-deep uppercase">Họ và tên *</span>
                <input
                  className="field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  autoComplete="name"
                  maxLength={60}
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <span className="mt-1.5 block text-xs text-[#9b5b4b]">{errors.name}</span>}
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-medium tracking-[0.18em] text-olive-deep uppercase">Số điện thoại</span>
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
                {errors.phone && <span className="mt-1.5 block text-xs text-[#9b5b4b]">{errors.phone}</span>}
              </label>
            </div>

            <fieldset>
              <legend className="mb-2 block text-xs font-medium tracking-[0.18em] text-olive-deep uppercase">Bạn sẽ đến chứ? *</legend>
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
              {errors.attendance && <span className="mt-1.5 block text-xs text-[#9b5b4b]">{errors.attendance}</span>}
            </fieldset>

            <AnimatePresence initial={false}>
              {attendance === 'yes' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mb-5">
                    <span className="mb-2 block text-xs font-medium tracking-[0.18em] text-olive-deep uppercase">Bạn đi cữ nào? *</span>
                    <div className="grid grid-cols-2 gap-3">
                      {sessions.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSession(s.id)}
                          aria-pressed={session === s.id}
                          className={`min-h-12 border px-3 py-2.5 text-sm transition-all duration-300 ${
                            session === s.id
                              ? 'border-olive-deep bg-olive-deep text-warm'
                              : 'border-olive/25 bg-transparent text-forest/75 hover:border-olive/60'
                          }`}
                        >
                          {s.title} · {s.time}
                        </button>
                      ))}
                    </div>
                    {errors.session && <span className="mt-1.5 block text-xs text-[#9b5b4b]">{errors.session}</span>}
                  </div>
                  <span className="mb-2 block text-xs font-medium tracking-[0.18em] text-olive-deep uppercase">Số người tham dự</span>
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
                    <span className="text-sm text-forest/55">người (kể cả bạn)</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <label className="block">
              <span className="mb-2 block text-xs font-medium tracking-[0.18em] text-olive-deep uppercase">Lời chúc</span>
              <textarea
                className="field min-h-24 resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Gửi đôi lời chúc tới cô dâu chú rể…"
                maxLength={400}
                rows={3}
              />
            </label>

            <Button type="submit" size="lg" className="w-full sm:w-auto" icon={<Send className="h-4 w-4" strokeWidth={1.5} />}>
              Soạn tin xác nhận
            </Button>
          </motion.form>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">Bước cuối · Gửi tin nhắn</p>
            <p className="mt-2 text-sm leading-relaxed text-forest/70">
              Tin nhắn xác nhận đã được soạn sẵn. Website không lưu thông tin của bạn – hãy gửi tin nhắn này cho cô dâu chú rể để hoàn tất.
            </p>
            <pre className="mt-4 max-h-56 overflow-auto border border-olive/20 bg-ivory p-4 font-sans text-[0.85rem] leading-relaxed whitespace-pre-wrap text-forest/85">
              {prepared}
            </pre>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                onClick={handleZalo}
                icon={<MessageCircle className="h-4 w-4" strokeWidth={1.5} />}
                title="Sao chép tin nhắn và mở Zalo"
              >
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
