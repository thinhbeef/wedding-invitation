import { rsvp } from '../data/weddingData';
import type { RsvpPayload } from './messaging';

const SHEET_URL_PATTERN = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/;
const TIMEOUT_MS = 25000;

export type RsvpSubmissionResult =
  | { status: 'saved' }
  | { status: 'rejected' }
  | { status: 'unconfirmed' };

/** Đã dán link Apps Script hợp lệ vào `rsvp.sheetUrl` chưa. */
export function isSheetConfigured(): boolean {
  return SHEET_URL_PATTERN.test(rsvp.sheetUrl.trim());
}

/** Mã riêng cho mỗi lần gửi: gửi lại cùng mã thì Sheet không ghi trùng. */
export function createSubmissionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

async function withTimeout<T>(run: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await run(controller.signal);
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * Gửi xác nhận tham dự vào Google Sheet qua Apps Script Web App.
 *
 * - Dùng Content-Type text/plain để là "simple request" (Apps Script không xử lý preflight).
 * - Chỉ báo đã lưu khi đọc được phản hồi ok: true. Phản hồi không đọc được hoặc hết thời gian chờ
 *   là chưa xác nhận, vì máy chủ có thể đã ghi. Khách thử lại với cùng mã để không ghi trùng.
 */
export async function submitRsvpToSheet(data: RsvpPayload, submissionId: string, honeypot = ''): Promise<RsvpSubmissionResult> {
  const url = rsvp.sheetUrl.trim();
  if (!isSheetConfigured() || honeypot) return { status: 'rejected' };

  const init = {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      id: submissionId,
      side: rsvp.side,
      name: data.name.trim(),
      phone: data.phone.trim(),
      attendance: data.attendance,
      guests: data.attendance === 'yes' ? data.guests : 0,
      message: data.message.trim(),
      website: honeypot,
    }),
  } satisfies RequestInit;

  try {
    return await withTimeout(async (signal) => {
      const response = await fetch(url, { ...init, mode: 'cors', credentials: 'omit', redirect: 'follow', signal });
      // Keep the timeout active while reading the response body, too.
      const result: unknown = await response.json();
      if (!response.ok || !result || typeof result !== 'object' || !('ok' in result)) {
        return { status: 'unconfirmed' };
      }
      if (result.ok === true) return { status: 'saved' };
      return { status: result.ok === false ? 'rejected' : 'unconfirmed' };
    });
  } catch {
    return { status: 'unconfirmed' };
  }
}
