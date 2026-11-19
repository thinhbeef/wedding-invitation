import { weddingInfo, displayCouple } from '../data/weddingData';
import { invitationVariant } from '../data/invitationVariant';
import { getWeddingTimestamp } from './date';
import { getMapsUrl } from './messaging';

function toIcsUtc(ms: number): string {
  return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/** Tạo nội dung file .ics (chuẩn iCalendar) hoàn toàn ở phía trình duyệt. */
export function buildIcs(time: string = weddingInfo.time): string {
  const start = getWeddingTimestamp(time);
  const end = start + weddingInfo.durationHours * 60 * 60 * 1000;
  const { venue, address } = weddingInfo;
  const title = `Tiệc mừng ${invitationVariant.ceremony.toLocaleLowerCase('vi-VN')} ${displayCouple[0].name} & ${displayCouple[1].name}`;
  const description = `Trân trọng kính mời quý khách đến chung vui cùng ${displayCouple[0].name} & ${displayCouple[1].name}.\nBản đồ: ${getMapsUrl()}`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//VI',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:wedding-${weddingInfo.date}-${start}@invitation.local`,
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
    'END:VCALENDAR',
  ];
  return lines.join('\r\n');
}

export function downloadIcs(time: string = weddingInfo.time): void {
  const blob = new Blob([buildIcs(time)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `dam-cuoi-${weddingInfo.date}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
