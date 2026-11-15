import { sessions, weddingInfo } from '../data/weddingData';
import { getWeddingTimestamp } from './date';
import { getMapsUrl } from './messaging';

function toIcsUtc(ms: number): string {
  return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/** Tạo nội dung file .ics (chuẩn iCalendar) – mỗi cữ tiệc là một sự kiện. */
export function buildIcs(): string {
  const { groom, bride, venue, address } = weddingInfo;
  const description = `Trân trọng kính mời bạn đến chung vui cùng ${bride.name} & ${groom.name}.\nBản đồ: ${getMapsUrl()}`;

  const events = sessions.flatMap((item) => {
    const start = getWeddingTimestamp(item.time);
    const end = start + weddingInfo.durationHours * 60 * 60 * 1000;
    const title = `${item.title} – Tiệc cưới ${bride.name} & ${groom.name}`;
    return [
      'BEGIN:VEVENT',
      `UID:wedding-${weddingInfo.date}-${item.id}@invitation.local`,
      `DTSTAMP:${toIcsUtc(Date.now())}`,
      `DTSTART:${toIcsUtc(start)}`,
      `DTEND:${toIcsUtc(end)}`,
      `SUMMARY:${escapeIcs(title)}`,
      `LOCATION:${escapeIcs(`${venue}, ${address}`)}`,
      `DESCRIPTION:${escapeIcs(description)}`,
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeIcs(title)}`,
      'END:VALARM',
      'END:VEVENT',
    ];
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//VI',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadIcs(): void {
  const blob = new Blob([buildIcs()], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `dam-cuoi-${weddingInfo.date}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
