import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { weddingInfo } from '../../data/weddingData';
import { getWeddingDateParts } from '../../utils/date';

const WEEKDAYS = [
  { label: 'T2', full: 'Thứ Hai' },
  { label: 'T3', full: 'Thứ Ba' },
  { label: 'T4', full: 'Thứ Tư' },
  { label: 'T5', full: 'Thứ Năm' },
  { label: 'T6', full: 'Thứ Sáu' },
  { label: 'T7', full: 'Thứ Bảy' },
  { label: 'CN', full: 'Chủ Nhật', isWeekend: true },
];

export function WeddingCalendar() {
  const [yearStr, monthStr, dayStr] = weddingInfo.date.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const targetDay = parseInt(dayStr, 10);

  const { weekday, monthName } = getWeddingDateParts();

  // Số ngày trong tháng
  const totalDays = new Date(year, month, 0).getDate();

  // Thứ của ngày mùng 1 (0 = CN, 1 = T2, ..., 6 = T7)
  const firstDay = new Date(year, month - 1, 1).getDay();
  // Đổi để T2 là 0, CN là 6
  const startOffset = (firstDay + 6) % 7;

  const totalCells = Math.ceil((startOffset + totalDays) / 7) * 7;

  return (
    <div className="relative mx-auto mt-10 max-w-sm overflow-hidden rounded-2xl border border-olive/20 bg-warm/95 p-6 text-center shadow-[0_12px_32px_-16px_rgb(52_59_48/0.25)] sm:p-7">
      {/* Tiêu đề lịch tháng */}
      <div className="flex items-center justify-between border-b border-olive/15 pb-4">
        <span className="font-sans text-xs font-medium tracking-[0.2em] text-olive-deep uppercase">
          {monthName} · {year}
        </span>
        <span className="inline-flex items-center gap-1 font-serif text-sm text-forest/70 italic">
          <Heart className="h-3.5 w-3.5 fill-olive text-olive" /> Save our Date
        </span>
      </div>

      {/* Hàng thứ trong tuần */}
      <div className="mt-4 grid grid-cols-7 text-center font-sans text-xs font-semibold tracking-wider text-forest/65 uppercase">
        {WEEKDAYS.map((w) => (
          <div key={w.label} className={w.isWeekend ? 'text-olive-deep font-bold' : ''}>
            {w.label}
          </div>
        ))}
      </div>

      {/* Lưới ngày */}
      <div className="mt-3 grid grid-cols-7 gap-y-2 text-center">
        {Array.from({ length: totalCells }).map((_, index) => {
          const dayNumber = index - startOffset + 1;
          const isValidDay = dayNumber >= 1 && dayNumber <= totalDays;
          const isTarget = isValidDay && dayNumber === targetDay;
          const isSunday = index % 7 === 6;

          if (!isValidDay) {
            return <div key={`empty-${index}`} className="h-9 w-9" />;
          }

          if (isTarget) {
            return (
              <div key={dayNumber} className="relative flex items-center justify-center">
                {/* Vòng sáng nhẹ quanh ngày cưới */}
                <span className="absolute -inset-1 animate-ping rounded-full bg-olive/20 opacity-75" />
                <motion.div
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="relative flex h-9 w-9 flex-col items-center justify-center rounded-full bg-olive text-warm shadow-md ring-2 ring-champagne"
                >
                  <span className="font-serif text-base font-bold leading-none sm:text-lg">
                    {String(dayNumber).padStart(2, '0')}
                  </span>
                  <Heart className="absolute -top-1.5 -right-1 h-3 w-3 fill-champagne text-champagne" />
                </motion.div>
              </div>
            );
          }

          return (
            <div
              key={dayNumber}
              className={`flex h-9 w-9 items-center justify-center mx-auto font-serif text-base sm:text-lg transition-colors ${
                isSunday ? 'text-olive/80 font-medium' : 'text-forest/75'
              }`}
            >
              {String(dayNumber).padStart(2, '0')}
            </div>
          );
        })}
      </div>

      {/* Chú thích ngày cưới */}
      <div className="mt-5 rounded-xl border border-dashed border-olive/30 bg-ivory/60 px-4 py-2.5 text-center">
        <p className="font-sans text-xs font-medium tracking-[0.12em] text-forest uppercase">
          {weekday}, ngày {String(targetDay).padStart(2, '0')} tháng {String(month).padStart(2, '0')} năm {year}
        </p>
        <p className="mt-0.5 font-serif text-base text-olive-deep italic">
          Hai cữ tiệc tại tư gia · 11:00 và 16:00
        </p>
      </div>
    </div>
  );
}
