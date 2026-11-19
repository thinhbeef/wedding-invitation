/**
 * =====================================================================
 *  FILE CẤU HÌNH TRUNG TÂM CỦA THIỆP CƯỚI
 * =====================================================================
 *  Toàn bộ nội dung website được lấy từ file này – không cần sửa component.
 *
 *  • Thay các giá trị trong dấu [ ... ] bằng thông tin thật.
 *  • Ảnh: chép vào `public/images/` rồi khai báo dạng "/images/ten-file.jpg"
 *    (hỗ trợ .jpg .jpeg .png .webp).
 *  • Nhạc: chép vào `public/music/` và sửa `musicSrc`.
 * =====================================================================
 */

import type { LucideIcon } from 'lucide-react';
import { BookHeart, CalendarHeart, House, Images, MailCheck } from 'lucide-react';
import { invitationVariant } from './invitationVariant';

/* ------------------------------------------------------------------ */
/*  KIỂU DỮ LIỆU                                                       */
/* ------------------------------------------------------------------ */

export interface Person {
  /** Tên hiển thị trên thiệp */
  name: string;
  /** Tên bố mẹ – để chuỗi rỗng "" nếu không muốn hiển thị */
  father: string;
  mother: string;
  /** Địa chỉ nhà (tuỳ chọn) */
  home: string;
}

export interface WeddingInfo {
  groom: Person;
  bride: Person;
  /** Ngày cưới: YYYY-MM-DD */
  date: string;
  /** Giờ đón khách: HH:mm (24h) – dùng cho đếm ngược và lịch */
  time: string;
  timezone: string;
  /** Độ lệch UTC của múi giờ trên (Việt Nam: +07:00) */
  utcOffset: string;
  /** Thời lượng sự kiện (giờ) khi thêm vào lịch */
  durationHours: number;
  venue: string;
  address: string;
  /** Link Google Maps – để trống thì website tự tìm theo địa chỉ */
  mapsUrl: string;
  phone: string;
  /** Link https://zalo.me/... hoặc số điện thoại Zalo */
  zalo: string;
}

export type ImageAspect = 'portrait' | 'landscape' | 'square' | 'tall';

export interface Photo {
  src: string;
  alt: string;
  caption: string;
  /** Vị trí lấy nét khi ảnh bị cắt, ví dụ "50% 30%" (tuỳ chọn) */
  focus?: string;
}

export interface GalleryImage extends Photo {
  id: string;
  /** Ảnh thu nhỏ (tuỳ chọn) để tải nhanh */
  thumbnail?: string;
  aspectRatio: ImageAspect;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  icon: 'arrival' | 'ceremony' | 'reception' | 'other';
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface DressCode {
  /** false = ẩn mục Dress code */
  enabled: boolean;
  name: string;
  note: string;
  recommended: ColorSwatch[];
  avoid: ColorSwatch[];
}

export type SectionId = 'home' | 'story' | 'wedding' | 'gallery' | 'rsvp';

export interface NavItem {
  id: SectionId;
  label: string;
  icon: LucideIcon;
}

/* ------------------------------------------------------------------ */
/*  THÔNG TIN CHÍNH                                                    */
/* ------------------------------------------------------------------ */

export const weddingInfo: WeddingInfo = {
  groom: {
    name: 'Ngọc Thịnh',
    father: 'Phan Ngọc Hưng',
    mother: 'Võ Thanh Thúy',
    home: 'Phường Vĩnh Trạch, Tỉnh Cà Mau',
  },
  bride: {
    name: 'Như Ý',
    father: 'Trần Thanh Xuân',
    mother: 'La Bích Thủy',
    home: 'Xã Hòa Bình, Tỉnh Cà Mau',
  },
  date: invitationVariant.isBride ? '2026-12-05' : '2026-12-06',
  // Đón khách lúc 11:00, khai tiệc lúc 11:30.
  time: invitationVariant.isBride ? invitationVariant.session?.time ?? '10:30' : '11:00',
  timezone: 'Asia/Ho_Chi_Minh',
  utcOffset: '+07:00',
  durationHours: 3,
  venue: invitationVariant.isBride ? 'Tư gia nhà gái' : 'Nhà Hàng - Khách Sạn Diamond Bạc Liêu',
  address: invitationVariant.isBride ? '08 Lê Quý Đôn, Xã Hòa Bình, Tỉnh Cà Mau' : '36 Trần Huỳnh, Phường Bạc Liêu, Tỉnh Cà Mau',
  mapsUrl: invitationVariant.isBride ? 'https://www.google.com/maps/dir/?api=1&destination=9.281501038003864,105.63046603874042' : '[Link Google Maps]',
  phone: '[Số điện thoại]',
  zalo: '[Link hoặc số Zalo]',
};

export const displayCouple = invitationVariant.isBride
  ? [weddingInfo.bride, weddingInfo.groom] as const
  : [weddingInfo.groom, weddingInfo.bride] as const;

/** Nhạc nền – chỉ dùng nhạc bạn có quyền sử dụng. */
export const musicSrc = `${import.meta.env.BASE_URL}music/A%20Thousand%20Years.mp3`;

/* ------------------------------------------------------------------ */
/*  01 · ẢNH BÌA                                                       */
/* ------------------------------------------------------------------ */

export const hero = {
  // cover-web.jpg là bản nén (2000px) của cover.jpg để trang tải nhanh
  image: '/images/cover-web.jpg?v=129fddee59c6',
  focus: '50% 38%',
  tagline: invitationVariant.ceremony,
};

/* ------------------------------------------------------------------ */
/*  02 · THIỆP MỜI                                                     */
/* ------------------------------------------------------------------ */

export const invitation = {
  greeting: 'Trân trọng kính mời',
  lead: `Đến dự tiệc mừng ${invitationVariant.ceremony.toLocaleLowerCase('vi-VN')} của`,
  message: 'Sự hiện diện của quý khách là niềm vinh hạnh của gia đình và niềm vui trọn vẹn của đôi uyên ương.',
};

/* ------------------------------------------------------------------ */
/*  03 · LỜI NHẮN CỦA CÔ DÂU CHÚ RỂ                                   */
/* ------------------------------------------------------------------ */

export const story: { intro: string; photos: Photo[] } = {
  intro:
    `Ngày ${invitationVariant.isBride ? '5' : '6'} tháng 12, ${displayCouple[0].name} và ${displayCouple[1].name} sẽ cùng nhau bước sang một chặng đường mới. Chúng mình mong được đón những người thân yêu đến chung vui, gửi trao lời chúc và lưu lại những khoảnh khắc đẹp trong ngày hạnh phúc.`,
  // Ba file story-* chỉ dùng ở phần này; thay ảnh tại đây không đổi album.
  photos: [
    { src: '/images/story-01-opt.jpg?v=8911e0145a42', alt: 'Cô dâu chú rể', caption: 'Thịnh & Ý' },
    { src: '/images/story-02-opt.jpg?v=4046ba4bf68c', alt: 'Cô dâu chú rể', caption: 'Ngày mình có nhau' },
    { src: '/images/story-03-opt.jpg?v=51ea2c371c98', alt: 'Cô dâu chú rể', caption: invitationVariant.isBride ? '05.12.2026' : '06.12.2026' },
  ],
};

/* ------------------------------------------------------------------ */
/*  05 · LỊCH TRÌNH NHÀ TRAI                                           */
/* ------------------------------------------------------------------ */

export const schedule: ScheduleItem[] = [
  { id: 'arrival', time: '11:00', title: 'Đón khách', description: 'Chào đón quý khách và chụp ảnh lưu niệm.', icon: 'arrival' },
  { id: 'reception', time: '11:30', title: 'Khai tiệc', description: 'Kính mời quý khách dùng tiệc và chung vui cùng gia đình.', icon: 'reception' },
];

/* ------------------------------------------------------------------ */
/*  06 · DRESS CODE – đặt enabled: true khi đã có thông tin            */
/* ------------------------------------------------------------------ */

export const dressCode: DressCode = {
  enabled: false,
  name: '[Tên dress code]',
  note: '[Ghi chú về trang phục]',
  recommended: [
    { name: '[Màu 1]', hex: '#E8EBDD' },
    { name: '[Màu 2]', hex: '#B8C3AA' },
  ],
  avoid: [],
};

/* ------------------------------------------------------------------ */
/*  07 · ALBUM – giữ tỷ lệ ảnh gốc                                     */
/* ------------------------------------------------------------------ */

export const gallery: GalleryImage[] = [
  { id: 'gallery-03', src: '/images/couple-03-opt.jpg?v=8911e0145a42', caption: '', alt: 'Cô dâu chú rể trong trang phục cưới', aspectRatio: 'tall' },
  { id: 'gallery-01', src: '/images/couple-01-opt.jpg?v=51ea2c371c98', caption: '', alt: 'Cô dâu chú rể trong trang phục cưới', aspectRatio: 'tall' },
  { id: 'gallery-06', src: '/images/gallery-06-opt.jpg?v=4b1e032f4b9e', caption: '', alt: 'Cô dâu và chú rể bên nhau trong khu vườn', aspectRatio: 'tall' },
  { id: 'gallery-04', src: '/images/gallery-center-opt.jpg?v=784e579d0b49', caption: '', alt: 'Cô dâu và chú rể bên nhau giữa núi đồi', aspectRatio: 'tall' },
  { id: 'gallery-02', src: '/images/couple-02-opt.jpg?v=f0a538fe8fcc', caption: '', alt: 'Cô dâu chú rể trong trang phục cưới', aspectRatio: 'tall' },
  { id: 'gallery-07', src: '/images/gallery-07-opt.jpg?v=28272e8cbd23', caption: '', alt: 'Cô dâu và chú rể dưới khăn voan giữa núi đồi', aspectRatio: 'tall' },
];

/* ------------------------------------------------------------------ */
/*  08 · RSVP                                                          */
/* ------------------------------------------------------------------ */

export const rsvp = {
  title: 'Xác nhận tham dự',
  /** Hiện khi đã cấu hình `sheetUrl` */
  note: 'Kính mong quý khách xác nhận tham dự và số người đi cùng để gia đình chuẩn bị đón tiếp chu đáo.',
  /** Hiện khi CHƯA cấu hình `sheetUrl` (khách tự gửi qua Zalo / tin nhắn) */
  noteFallback: 'Quý khách vui lòng điền thông tin bên dưới để soạn tin xác nhận và gửi đến gia đình qua Zalo hoặc tin nhắn.',
  maxGuests: 10,
  /**
   * Link Google Apps Script Web App (kết thúc bằng /exec) ghi xác nhận vào Google Sheet.
   * Hướng dẫn tạo: HUONG-DAN-GOOGLE-SHEET.md. Để chuỗi rỗng '' thì form dùng cách cũ (gửi qua Zalo / SMS).
   */
  sheetUrl: 'https://script.google.com/macros/s/AKfycbwdpLltXBS1rJrkFcIz_jn2_9HtHFeSNLTqb-ebuhkD-eAxHKJA0sQgKym5sRqYSobyqQ/exec',
  /** Ghi vào cột "Bên" của Sheet – thiệp chính thuộc nhà trai */
  side: invitationVariant.isBride ? 'Nhà gái' : 'Nhà trai',
};

/* ------------------------------------------------------------------ */
/*  09 · LỜI CẢM ƠN                                                    */
/* ------------------------------------------------------------------ */

export const thankYou = {
  image: '/images/thankyou.jpg',
  title: 'Thank you',
  message: `Cảm ơn quý khách đã dành tình cảm và những lời chúc tốt đẹp cho ${displayCouple[0].name} và ${displayCouple[1].name}. Gia đình rất mong được đón tiếp quý khách trong ngày vui.`,
};

/* ------------------------------------------------------------------ */
/*  THANH ĐIỀU HƯỚNG                                                   */
/* ------------------------------------------------------------------ */

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'story', label: 'Story', icon: BookHeart },
  { id: 'wedding', label: 'Wedding', icon: CalendarHeart },
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'rsvp', label: 'RSVP', icon: MailCheck },
];
