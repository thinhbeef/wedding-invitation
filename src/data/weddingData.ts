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

export interface Session {
  id: string;
  time: string;
  title: string;
  description: string;
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
  date: '2026-12-05',
  // [Giờ tổ chức] – 11:00 là GIỜ MẪU, hãy thay bằng giờ thật
  time: '11:00',
  timezone: 'Asia/Ho_Chi_Minh',
  utcOffset: '+07:00',
  durationHours: 3,
  venue: 'Tư gia nhà gái',
  address: '08, Lê Quý Đôn, Xã Hòa Bình, Tỉnh Cà Mau',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=9.281496770535636,105.63045193963549',
  phone: '[Số điện thoại]',
  zalo: '[Link hoặc số Zalo]',
};

/** Nhạc nền – ưu tiên link bài hát mà khách mời gửi. */
export const musicSrc = 'https://www.nhaccuatui.com/song/sGs5nzTHv6jP';
export const onlineMusicSrc = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';
export const musicSources = [musicSrc, onlineMusicSrc];

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
  lead: 'Tới dự bữa tiệc thân mật tại tư gia cùng gia đình chúng tôi',
  message: 'Gia đình xin đón tiếp quý khách vào một trong hai cữ tiệc. Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi.',
};

/* ------------------------------------------------------------------ */
/*  03 · CÂU CHUYỆN (placeholder – hãy viết lại bằng lời của bạn)       */
/* ------------------------------------------------------------------ */

export const story: { intro: string; photos: Photo[] } = {
  intro:
    'Giữa rất nhiều người đi qua đời nhau, chúng mình lại tìm thấy nhau. Không ồn ào, không vội vã, chỉ là những ngày bình thường bên nhau, rồi từ từ, những ngày ấy đã trở thành những điều rất đặc biệt. Và vào ngày 05.12 này, chúng mình sẽ cùng bước tiếp quãng đường phía trước, tay trong tay, với niềm tin rằng tình yêu sẽ đi qua mọi mùa. Nếu có thể, chúng mình rất muốn bạn ở đó, cùng chia sẻ niềm hạnh phúc đầu tiên của cả hai.',
  photos: [
    { src: '/images/couple-01-opt.jpg', alt: 'Cô dâu chú rể', caption: 'Bắt đầu từ đây' },
    { src: '/images/couple-02-opt.jpg', alt: 'Cô dâu chú rể', caption: 'Những ngày có nhau' },
    { src: '/images/couple-03-opt.jpg', alt: 'Cô dâu chú rể', caption: 'Một nhà, một đời' },
  ],
};

/* ------------------------------------------------------------------ */
/*  05 · HAI CỮ TIỆC TẠI TƯ GIA                                        */
/* ------------------------------------------------------------------ */

export const sessions: Session[] = [
  { id: 'lunch', time: '11:00', title: 'Cữ trưa', description: 'Đón khách và dùng bữa trưa thân mật cùng gia đình.' },
  { id: 'dinner', time: '16:00', title: 'Cữ chiều', description: 'Đón khách và dùng bữa chiều thân mật cùng gia đình.' },
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
/*  07 · ALBUM – ảnh đầu tiên là ảnh lớn                               */
/* ------------------------------------------------------------------ */

export const gallery: GalleryImage[] = [
  { id: 'gallery-01', src: '/images/couple-01-opt.jpg', caption: 'Chúng mình của hôm nay', alt: 'Cô dâu chú rể trong trang phục cưới', aspectRatio: 'tall' },
  { id: 'gallery-02', src: '/images/couple-02-opt.jpg', caption: 'Nụ cười của em', alt: 'Cô dâu chú rể trong trang phục cưới', aspectRatio: 'tall' },
  { id: 'gallery-03', src: '/images/couple-03-opt.jpg', caption: 'Bình yên bên anh', alt: 'Cô dâu chú rể trong trang phục cưới', aspectRatio: 'tall' },
  { id: 'gallery-04', src: '/images/gallery-04-opt.jpg', caption: 'Chung một lối đi', alt: 'Khung ảnh cưới đang chờ ảnh', aspectRatio: 'portrait' },
  { id: 'gallery-05', src: '/images/gallery-05-opt.jpg', caption: 'Nắm tay thật chặt', alt: 'Khung ảnh cưới đang chờ ảnh', aspectRatio: 'landscape' },
  { id: 'gallery-06', src: '/images/gallery-06-opt.jpg', caption: 'Hẹn bạn ngày 05.12', alt: 'Khung ảnh cưới đang chờ ảnh', aspectRatio: 'square' },
  { id: 'gallery-07', src: '/images/gallery-07-opt.jpg', caption: '', alt: 'Khung ảnh cưới đang chờ ảnh', aspectRatio: 'tall' },
  { id: 'gallery-08', src: '/images/gallery-08-opt.jpg', caption: '', alt: 'Khung ảnh cưới đang chờ ảnh', aspectRatio: 'portrait' },
];

/* ------------------------------------------------------------------ */
/*  08 · RSVP                                                          */
/* ------------------------------------------------------------------ */

export const rsvp = {
  title: 'Gửi lời chúc đến cô dâu chú rể',
  note: 'Website không lưu thông tin. Lời chúc sẽ được soạn thành tin nhắn để bạn gửi qua Zalo.',
  maxGuests: 10,
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
