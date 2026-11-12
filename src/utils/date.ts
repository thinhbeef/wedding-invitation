import { weddingInfo } from '../data/weddingData';

/** Thời điểm cưới (epoch ms) – tính theo múi giờ cấu hình, không phụ thuộc giờ máy khách. */
export function getWeddingTimestamp(time: string = weddingInfo.time): number {
  return Date.parse(`${weddingInfo.date}T${time}:00${weddingInfo.utcOffset}`);
}

export function getWeddingDateParts() {
  const date = new Date(getWeddingTimestamp());
  const tz = weddingInfo.timezone;
  const fmt = (options: Intl.DateTimeFormatOptions, locale = 'vi-VN') =>
    new Intl.DateTimeFormat(locale, { timeZone: tz, ...options }).format(date);

  return {
    day: fmt({ day: '2-digit' }),
    month: fmt({ month: '2-digit' }),
    year: fmt({ year: 'numeric' }),
    weekday: fmt({ weekday: 'long' }),
    monthName: fmt({ month: 'long' }),
    monthNameEn: fmt({ month: 'long' }, 'en-US'),
    weekdayEn: fmt({ weekday: 'long' }, 'en-US'),
  };
}

export function formatDotDate(): string {
  const { day, month, year } = getWeddingDateParts();
  return `${day} · ${month} · ${year}`;
}
