# Thiệp cưới online – Minimal Botanical Wedding

Thiệp cưới dạng **một trang cuộn dọc**: ảnh bìa → thiệp mời → câu chuyện → đếm ngược → lịch trình → (dress code) → album ảnh → gửi lời chúc / xác nhận tham dự → lời cảm ơn.

React · TypeScript · Vite · Tailwind CSS · Framer Motion · Lucide React.
Không backend, không database – toàn bộ ảnh và nhạc nằm trong dự án.

## 1. Cài đặt & chạy

Yêu cầu Node.js 20+.

```bash
npm install
npm run dev
```

Mở `http://localhost:5173`. Xem trên điện thoại cùng Wi-Fi: `npm run dev -- --host` rồi mở địa chỉ `Network` hiện trong terminal.

## 2. Chỉnh thông tin

Mọi nội dung nằm trong **`src/data/weddingData.ts`**:

| Mục | Biến |
| --- | --- |
| Tên cô dâu chú rể, bố mẹ, địa chỉ nhà | `weddingInfo.groom`, `weddingInfo.bride` |
| Ngày cưới (YYYY-MM-DD), giờ làm lễ (HH:mm) | `weddingInfo.date`, `weddingInfo.time` |
| Địa điểm, địa chỉ, Google Maps | `weddingInfo.venue`, `address`, `mapsUrl` |
| Số điện thoại, Zalo | `weddingInfo.phone`, `weddingInfo.zalo` |
| Ảnh bìa, dòng chữ trên ảnh bìa | `hero` |
| Lời mời | `invitation` |
| Câu chuyện + 3 ảnh polaroid | `story` |
| Lịch trình | `schedule` |
| Dress code (đặt `enabled: true` để hiện) | `dressCode` |
| Album ảnh | `gallery` |
| Tiêu đề / số khách tối đa của form | `rsvp` |
| Lời cảm ơn | `thankYou` |

Giá trị trong `[ ... ]` là chỗ cần điền. Giờ trong lịch trình hiện là **giờ mẫu**.
Đếm ngược luôn tính theo giờ Việt Nam (`Asia/Ho_Chi_Minh`).

## 3. Thay ảnh

Chép ảnh vào `public/images/` (JPG, JPEG, PNG, WEBP):

```
cover.jpg            ảnh bìa gốc
cover-web.jpg        bản nén của ảnh bìa (website đang dùng file này)
couple-01..03.jpg    3 ảnh cưới gốc
couple-01..03-opt.jpg bản tối ưu đang dùng ở Chuyện tình và album
gallery-04..08-opt.jpg 5 ảnh tối ưu của album
thankyou.jpg         ảnh lời cảm ơn
```

Các bản gốc được giữ nguyên trên máy; website và bản deploy dùng hậu tố `-opt` để tải ảnh nhẹ hơn. Ảnh studio gốc bị ignore để không đưa file nặng vào Git/Vercel. File chưa có sẽ hiện khung “Ảnh sẽ được cập nhật” kèm tên file khi chạy dev.

**Nên nén ảnh trước khi đưa lên** (cạnh dài ~2000px, < 500KB) – ảnh gốc từ máy ảnh thường 10–25MB, khách mở bằng 4G sẽ rất chậm. Có thể dùng <https://squoosh.app>.

### Thêm ảnh vào album

Album có sẵn năm khung trống. Chép ảnh gốc vào `public/images/`, tạo bản nén theo tên `gallery-04-opt.jpg` đến `gallery-08-opt.jpg`; mỗi khung sẽ tự hiện ảnh, không cần sửa code. Giữ ảnh gốc ở riêng tên file nếu muốn.

Để thêm nhiều hơn tám ảnh, chép ảnh gốc vào `public/images/`, tạo bản nén `ten-anh-opt.jpg` (cạnh dài khoảng 2000px), rồi thêm một mục mới vào `gallery`:

```ts
{ id: 'gallery-09', src: '/images/gallery-09-opt.jpg', caption: 'Chú thích ảnh', alt: 'Cô dâu chú rể', aspectRatio: 'tall' },
```

`aspectRatio`: `portrait` (4:5) · `landscape` (3:2) · `square` · `tall` (2:3) – nên khớp hướng ảnh thật.
Có thể thêm `focus: '50% 30%'` để chọn vùng giữ lại khi ảnh bị cắt.

## 4. Nhạc nền

Chép file vào `public/music/wedding-music.mp3`. Nhạc phát khi khách bấm “Mở thiệp” hoặc nút nhạc góc phải. Thiếu file thì nút nhạc tự mờ đi, website vẫn chạy bình thường. Chỉ dùng nhạc bạn có quyền sử dụng.

## 5. Gửi lời chúc / xác nhận tham dự

Website **không lưu** dữ liệu. Khi khách bấm gửi, nội dung được soạn thành tin nhắn:

- **Gửi qua Zalo**: sao chép tin nhắn rồi mở Zalo đã cấu hình để khách dán và gửi (Zalo không hỗ trợ điền sẵn nội dung qua link).
- **Gửi SMS** (khi có số điện thoại): mở ứng dụng tin nhắn với nội dung điền sẵn.
- **Sao chép**: gửi qua kênh bất kỳ.

## 6. Build & deploy

```bash
npm run build      # kết quả trong dist/
npm run preview    # xem thử bản build
```

> Không chỉnh sửa hay chép ảnh vào `dist/` – thư mục này bị xoá và tạo lại mỗi lần build.

### GitHub Pages

Repository này đã có workflow tự build và deploy khi push lên nhánh `main`.

1. Trên GitHub mở **Settings → Pages**.
2. Trong **Build and deployment**, chọn **Source: GitHub Actions**.
3. Push code lên `main`; theo dõi tiến trình tại tab **Actions**.
4. Khi workflow thành công, trang sẽ ở: <https://thinhbeef.github.io/wedding-invitation/>.

Workflow tự đặt base path `/wedding-invitation/`; ảnh, nhạc và favicon sẽ hoạt động dưới project URL này. Chạy `npm run dev` ở máy vẫn dùng đường dẫn local bình thường.

**Vercel**: đẩy code lên GitHub → vercel.com → *Add New Project* → chọn repo → Framework *Vite* → *Deploy*.

**Netlify**: app.netlify.com → *Import an existing project* → Build command `npm run build`, Publish directory `dist`. Hoặc kéo-thả thư mục `dist/` vào *Netlify Drop*.

## Cấu trúc

```
src/
  data/weddingData.ts     ← chỉnh nội dung ở đây
  sections/               Hero, Invitation, Story, Countdown, Schedule, DressCode, Gallery, RSVP, ThankYou
  components/
    common/               Button, ImageWithFallback, MusicPlayer, Botanical
    layout/Section.tsx    tiêu đề section + hiệu ứng hiện dần
    navigation/BottomNav  thanh điều hướng
    gallery/              GalleryLightbox
    forms/RSVPForm
  hooks/  utils/  styles/globals.css
public/images  public/music
```
