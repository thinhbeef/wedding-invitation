import { rsvp } from '../data/weddingData';
import type { RsvpPayload } from './messaging';

export const hasRsvpEndpoint = Boolean(rsvp.endpoint.trim());

/**
 * Gửi xác nhận tới Google Apps Script (ghi vào Google Sheet của cô dâu chú rể).
 * Apps Script không trả CORS nên dùng no-cors: không đọc được phản hồi, chỉ biết yêu cầu đã đi được hay chưa.
 */
export async function submitRsvp(data: RsvpPayload): Promise<boolean> {
  const url = rsvp.endpoint.trim();
  if (!url) return false;
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...data, sentAt: new Date().toISOString() }),
    });
    return true;
  } catch {
    return false;
  }
}
