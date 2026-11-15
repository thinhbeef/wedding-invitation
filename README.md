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
| Hai cữ tiệc (giờ, tiêu đề) | `sessions` |
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

Chép file mp3 vào `public/music/wedding-music.mp3` (nên dưới 5MB, khoảng 128kbps) rồi commit cùng code. File nằm trong dự án nên phát được trên Vercel, GitHub Pages hay bất kỳ domain nào (đường dẫn tự thích ứng với `/wedding-invitation/` của GitHub Pages).

- Nhạc phát khi khách bấm “Mở thiệp” hoặc nút nhạc góc phải (trình duyệt chỉ cho phát sau khi khách chạm vào trang).
- **Không dùng link trang nghe nhạc** (nhaccuatui, YouTube, Zing…) – đó là trang web, không phải file âm thanh nên không phát được.
- Thiếu file thì website dùng bản nhạc dự phòng (`onlineMusicSrc` trong `weddingData.ts`); xoá nó khỏi `musicSources` nếu không muốn.
- Chỉ dùng nhạc bạn có quyền sử dụng.

## 5. Xác nhận tham dự / lời chúc

Có hai chế độ, tuỳ `rsvp.endpoint` trong `weddingData.ts`:

**A. Ghi vào Google Sheet (khuyến nghị – không cần database)**
Khách bấm gửi là thông tin vào thẳng một Google Sheet của bạn (họ tên, SĐT, có đến không, cữ nào, số người, lời chúc), có thể kèm email báo mỗi khi có người xác nhận.

1. Vào <https://sheets.new>, tạo Sheet mới, đặt tên “Khách mời”.
2. Menu **Tiện ích mở rộng → Apps Script**, xoá code mẫu, dán toàn bộ nội dung file `apps-script/rsvp.gs`. (Muốn nhận email thì điền `NOTIFY_EMAIL`.)
3. Bấm **Triển khai → Tùy chọn triển khai mới → loại “Ứng dụng web”**: *Thực thi bằng: Tôi*, *Người có quyền truy cập: Bất kỳ ai* → **Triển khai** và cấp quyền khi Google hỏi.
4. Sao chép **URL ứng dụng web** (kết thúc bằng `/exec`), dán vào `rsvp.endpoint` trong `src/data/weddingData.ts`, commit và push.
5. Thử gửi một xác nhận trên thiệp: một dòng mới xuất hiện trong tab `RSVP` của Sheet.

Sau này sửa code Apps Script thì phải **Triển khai → Quản lý triển khai → Chỉnh sửa → Phiên bản mới** thì mới có hiệu lực.

**B. Chỉ soạn tin nhắn (để `endpoint: ''`)**
Website không lưu gì; nội dung được soạn thành tin nhắn để khách tự gửi qua Zalo / SMS / sao chép. Cách này phụ thuộc khách nhớ bấm gửi.

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
