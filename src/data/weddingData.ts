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
  /** Giờ làm lễ: HH:mm (24h) – dùng cho đếm ngược và lịch */
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
  date: '2026-12-06',
  // [Giờ tổ chức] – 11:00 là GIỜ MẪU, hãy thay bằng giờ thật
  time: '11:00',
  timezone: 'Asia/Ho_Chi_Minh',
  utcOffset: '+07:00',
  durationHours: 3,
  venue: 'Nhà Hàng - Khách Sạn Diamond Bạc Liêu',
  address: '36 Trần Huỳnh, Phường Bạc Liêu, Tỉnh Cà Mau',
  mapsUrl: '[Link Google Maps]',
  phone: '[Số điện thoại]',
  zalo: '[Link hoặc số Zalo]',
};

/** Nhạc nền – chỉ dùng nhạc bạn có quyền sử dụng. */
export const musicSrc = `${import.meta.env.BASE_URL}music/A%20Thousand%20Years.mp3`;

/* ------------------------------------------------------------------ */
/*  01 · ẢNH BÌA                                                       */
/* ------------------------------------------------------------------ */

export const hero = {
  // cover-web.jpg là bản nén (2000px) của cover.jpg để trang tải nhanh
  image: '/images/cover-web.jpg',
  focus: '50% 38%',
  tagline: "We're getting married",
};

/* ------------------------------------------------------------------ */
/*  02 · THIỆP MỜI                                                     */
/* ------------------------------------------------------------------ */

export const invitation = {
  greeting: 'Trân trọng kính mời',
  lead: 'Tới dự buổi tiệc chung vui cùng gia đình chúng tôi',
  message: 'Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi.',
};

/* ------------------------------------------------------------------ */
/*  03 · CÂU CHUYỆN (placeholder – hãy viết lại bằng lời của bạn)       */
/* ------------------------------------------------------------------ */

export const story: { intro: string; photos: Photo[] } = {
  intro:
    'Giữa bao nhiêu người đi qua đời nhau, chúng mình đã tìm thấy nhau. Không ồn ào, chỉ là những ngày bình thường có nhau, rồi chính những ngày ấy hóa thành điều đặc biệt nhất. Ngày 06.12 này, chúng mình chính thức bước tiếp quãng đường còn lại bằng một cái nắm tay, và thật vui nếu có bạn ở đó.',
  photos: [
    { src: '/images/couple-01-opt.jpg', alt: 'Cô dâu chú rể', caption: 'Bắt đầu từ đây' },
    { src: '/images/couple-02-opt.jpg', alt: 'Cô dâu chú rể', caption: 'Những ngày có nhau' },
    { src: '/images/couple-03-opt.jpg', alt: 'Cô dâu chú rể', caption: 'Một nhà, một đời' },
  ],
};

/* ------------------------------------------------------------------ */
/*  05 · LỊCH TRÌNH (giờ là GIỜ MẪU)                                   */
/* ------------------------------------------------------------------ */

export const schedule: ScheduleItem[] = [
  { id: 'arrival', time: '10:30', title: 'Đón khách', description: 'Chào đón quý khách và chụp ảnh lưu niệm.', icon: 'arrival' },
  { id: 'ceremony', time: '11:00', title: 'Lễ cưới', description: 'Nghi lễ thành hôn của cô dâu và chú rể.', icon: 'ceremony' },
  { id: 'reception', time: '11:30', title: 'Khai tiệc', description: 'Cùng nâng ly và chung vui bữa tiệc.', icon: 'reception' },
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
  { id: 'gallery-01', src: '/images/couple-01-opt.jpg', caption: 'Chúng mình của hôm nay', alt: 'Cô dâu chú rể trong trang phục cưới', aspectRatio: 'tall' },
  { id: 'gallery-02', src: '/images/couple-02-opt.jpg', caption: 'Nụ cười của em', alt: 'Cô dâu chú rể trong trang phục cưới', aspectRatio: 'tall' },
  { id: 'gallery-03', src: '/images/couple-03-opt.jpg', caption: 'Bình yên bên anh', alt: 'Cô dâu chú rể trong trang phục cưới', aspectRatio: 'tall' },
  { id: 'gallery-04', src: '/images/gallery-04-opt.jpg', caption: 'Chung một lối đi', alt: 'Cô dâu chú rể bên đài phun nước', aspectRatio: 'landscape' },
  { id: 'gallery-05', src: '/images/gallery-05-opt.jpg', caption: 'Nắm tay thật chặt', alt: 'Cô dâu chú rể trên bậc thềm', aspectRatio: 'landscape' },
  { id: 'gallery-06', src: '/images/gallery-06-opt.jpg', caption: 'Hẹn bạn ngày 06.12', alt: 'Cô dâu chú rể giữa khung cảnh núi đồi', aspectRatio: 'tall' },
  { id: 'gallery-07', src: '/images/gallery-07-opt.jpg', caption: '', alt: 'Cô dâu chú rể dưới tán thông', aspectRatio: 'tall' },
];

/* ------------------------------------------------------------------ */
/*  08 · RSVP                                                          */
/* ------------------------------------------------------------------ */

export const rsvp = {
  title: 'Xác nhận tham dự & gửi lời chúc',
  /** Hiện khi đã cấu hình `sheetUrl` */
  note: 'Bạn điền thông tin và bấm “Gửi xác nhận”. Chúng mình sẽ nhận được đăng ký và lời chúc của bạn.',
  /** Hiện khi CHƯA cấu hình `sheetUrl` (khách tự gửi qua Zalo / tin nhắn) */
  noteFallback: 'Lời chúc sẽ được soạn thành tin nhắn để bạn gửi qua Zalo.',
  maxGuests: 10,
  /**
   * Link Google Apps Script Web App (kết thúc bằng /exec) ghi xác nhận vào Google Sheet.
   * Hướng dẫn tạo: HUONG-DAN-GOOGLE-SHEET.md. Để chuỗi rỗng '' thì form dùng cách cũ (gửi qua Zalo / SMS).
   */
  sheetUrl: 'https://script.google.com/macros/s/AKfycbwdpLltXBS1rJrkFcIz_jn2_9HtHFeSNLTqb-ebuhkD-eAxHKJA0sQgKym5sRqYSobyqQ/exec',
  /** Ghi vào cột "Bên" của Sheet – bản nhà gái đặt 'Nhà gái' */
  side: 'Nhà trai',
};

/* ------------------------------------------------------------------ */
/*  09 · LỜI CẢM ƠN                                                    */
/* ------------------------------------------------------------------ */

export const thankYou = {
  image: '/images/thankyou.jpg',
  title: 'Thank you',
  message: 'Cảm ơn bạn đã dành thời gian cho thiệp mời của chúng mình. Sự hiện diện của bạn là món quà ý nghĩa nhất.',
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
