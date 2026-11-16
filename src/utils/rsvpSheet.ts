import { rsvp } from '../data/weddingData';
import type { RsvpPayload } from './messaging';

const SHEET_URL_PATTERN = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/;
const TIMEOUT_MS = 15000;

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
 * Gửi xác nhận tham dự vào Google Sheet qua Apps Script Web App. Trả về true nếu đã gửi được.
 *
 * - Dùng Content-Type text/plain để là "simple request" (Apps Script không xử lý preflight).
 * - Ưu tiên đọc phản hồi để biết chắc Sheet đã ghi. Nếu trình duyệt không cho đọc (CORS / trình duyệt
 *   trong ứng dụng), gửi lại ở chế độ no-cors; mã gửi giúp Sheet bỏ qua nếu dòng đã được ghi.
 */
export async function submitRsvpToSheet(data: RsvpPayload, submissionId: string, honeypot = ''): Promise<boolean> {
  const url = rsvp.sheetUrl.trim();
  if (!isSheetConfigured()) return false;

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

  let response: Response;
  try {
    response = await withTimeout((signal) => fetch(url, { ...init, signal }));
  } catch {
    try {
      await withTimeout((signal) => fetch(url, { ...init, mode: 'no-cors', signal }));
      return true;
    } catch {
      return false;
    }
  }

  try {
    const result = (await response.json()) as { ok?: boolean };
    return result.ok === true;
  } catch {
    return false;
  }
}
