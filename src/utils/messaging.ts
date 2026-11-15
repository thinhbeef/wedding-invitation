import { sessions, weddingInfo } from '../data/weddingData';

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value.trim());
const digitsOf = (value: string) => value.replace(/[^\d+]/g, '');
const isPhoneLike = (value: string) => /^\+?\d{8,15}$/.test(digitsOf(value));

/** Trả về link Zalo hợp lệ hoặc null nếu chưa cấu hình. */
export function getZaloUrl(): string | null {
  const value = weddingInfo.zalo.trim();
  if (isHttpUrl(value)) return value;
  if (isPhoneLike(value)) return `https://zalo.me/${digitsOf(value).replace(/^\+84/, '0')}`;
  return null;
}

export function getPhone(): string | null {
  return isPhoneLike(weddingInfo.phone) ? digitsOf(weddingInfo.phone) : null;
}

/** Link Google Maps: ưu tiên link cấu hình, nếu chưa có thì tìm theo địa chỉ. */
export function getMapsUrl(): string {
  if (isHttpUrl(weddingInfo.mapsUrl)) return weddingInfo.mapsUrl.trim();
  const query = `${weddingInfo.venue} ${weddingInfo.address}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Link SMS có sẵn nội dung (hoạt động trên iOS & Android). */
export function getSmsUrl(body: string): string | null {
  const phone = getPhone();
  if (!phone) return null;
  return `sms:${phone}?&body=${encodeURIComponent(body)}`;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Chuyển sang cách dự phòng bên dưới
  }
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

/**
 * Zalo không hỗ trợ điền sẵn nội dung qua đường link,
 * nên tin nhắn được sao chép vào bộ nhớ tạm trước rồi mới mở Zalo để khách dán vào.
 */
export async function copyAndOpenZalo(message: string): Promise<{ copied: boolean; opened: boolean }> {
  // Gọi copy và mở cửa sổ ngay trong cùng thao tác bấm để tránh bị chặn popup.
  const copyPromise = copyText(message);
  const url = getZaloUrl();
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
  return { copied: await copyPromise, opened: Boolean(url) };
}

export type Attendance = 'yes' | 'no';

export interface RsvpPayload {
  name: string;
  phone: string;
  attendance: Attendance;
  guests: number;
  session: string;
  message: string;
}

export function buildRsvpMessage(data: RsvpPayload): string {
  const couple = `${weddingInfo.bride.name} & ${weddingInfo.groom.name}`;
  const picked = sessions.find((s) => s.id === data.session);
  const lines = [
    `XÁC NHẬN THAM DỰ – Đám cưới ${couple}`,
    '',
    `Họ tên: ${data.name.trim()}`,
    data.phone.trim() ? `Số điện thoại: ${data.phone.trim()}` : null,
    `Tham dự: ${data.attendance === 'yes' ? 'Có, mình sẽ đến' : 'Rất tiếc, mình không thể đến'}`,
    data.attendance === 'yes' && picked ? `Cữ tham dự: ${picked.title} (${picked.time})` : null,
    data.attendance === 'yes' ? `Số người: ${data.guests}` : null,
    data.message.trim() ? `\nLời chúc: ${data.message.trim()}` : null,
  ];
  return lines.filter((line) => line !== null).join('\n');
}

export function buildWishMessage(name: string, wish: string): string {
  const couple = `${weddingInfo.bride.name} & ${weddingInfo.groom.name}`;
  return `Gửi ${couple} 💐\n\n${wish.trim()}\n\n— ${name.trim()}`;
}
