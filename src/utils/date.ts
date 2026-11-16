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

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

/** "Nhằm ngày 28 tháng 10 năm Bính Ngọ (Âm lịch)" – null nếu trình duyệt không hỗ trợ. */
export function getLunarDateText(): string | null {
  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-chinese', {
      timeZone: weddingInfo.timezone,
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).formatToParts(new Date(getWeddingTimestamp()));
    const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
    const day = parseInt(get('day'), 10);
    const monthRaw = get('month');
    const month = parseInt(monthRaw, 10);
    const year = parseInt(get('relatedYear'), 10);
    if (!day || !month || !year) return null;
    const leap = /bis/i.test(monthRaw) ? ' nhuận' : '';
    return `Nhằm ngày ${day} tháng ${month}${leap} năm ${CAN[(year + 6) % 10]} ${CHI[(year + 8) % 12]} (Âm lịch)`;
  } catch {
    return null;
  }
}
