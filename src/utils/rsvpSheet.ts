import { rsvp } from '../data/weddingData';
import { buildSheetMessage, type RsvpPayload } from './messaging';

const SHEET_URL_PATTERN = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/;
const TIMEOUT_MS = 25000;

export type RsvpSubmissionResult =
  | { status: 'saved' }
  | { status: 'rejected' }
  | { status: 'unconfirmed' };

export interface GuestWish {
  id: string;
  name: string;
  message: string;
}

export interface WishesPage {
  wishes: GuestWish[];
  nextCursor: number | null;
}

/** Đã dán link Apps Script hợp lệ vào `rsvp.sheetUrl` chưa. */
export function isSheetConfigured(): boolean {
  return SHEET_URL_PATTERN.test(rsvp.sheetUrl.trim());
}

/** Mã riêng cho mỗi lần gửi: gửi lại cùng mã thì Sheet không ghi trùng. */
export function createSubmissionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

async function withTimeout<T>(run: (signal: AbortSignal) => Promise<T>, externalSignal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  externalSignal?.addEventListener('abort', cancel, { once: true });
  if (externalSignal?.aborted) cancel();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await run(controller.signal);
  } finally {
    window.clearTimeout(timer);
    externalSignal?.removeEventListener('abort', cancel);
  }
}

/** Đọc lời chúc đã lưu từ cùng Web App, dùng được trên mọi thiết bị. */
export async function fetchWishesFromSheet(cursor: number | null = null, signal?: AbortSignal): Promise<WishesPage> {
  if (!isSheetConfigured()) throw new Error('sheet-not-configured');
  const url = new URL(rsvp.sheetUrl.trim());
  url.searchParams.set('action', 'wishes');
  if (cursor !== null) url.searchParams.set('cursor', String(cursor));

  return withTimeout(async (requestSignal) => {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
      redirect: 'follow',
      cache: 'no-store',
      signal: requestSignal,
    });
    const result: unknown = await response.json();
    // Script cũ chỉ trả health check: không được hiểu nhầm là sổ lưu bút trống.
    if (!response.ok || !result || typeof result !== 'object'
      || !('ok' in result) || result.ok !== true
      || !('wishes' in result) || !Array.isArray(result.wishes)
      || !('nextCursor' in result)
      || !(result.nextCursor === null || (typeof result.nextCursor === 'number'
        && Number.isSafeInteger(result.nextCursor) && result.nextCursor >= 2
        && (cursor === null || result.nextCursor < cursor)))) {
      throw new Error('invalid-wishes-response');
    }

    const wishes = result.wishes.map((wish: unknown): GuestWish => {
      if (!wish || typeof wish !== 'object'
        || !('id' in wish) || typeof wish.id !== 'string' || !wish.id.trim()
        || !('name' in wish) || typeof wish.name !== 'string' || !wish.name.trim()
        || !('message' in wish) || typeof wish.message !== 'string' || !wish.message.trim()) {
        throw new Error('invalid-wish');
      }
      return { id: wish.id, name: wish.name, message: wish.message };
    });

    return { wishes, nextCursor: result.nextCursor };
  }, signal);
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
      message: buildSheetMessage(data),
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
