# Nhận xác nhận tham dự bằng Google Sheet (không cần database)

Khách bấm **Gửi xác nhận** trên thiệp → thông tin được ghi thành một dòng trong Google Sheet của bạn.
Làm một lần, mất khoảng 5 phút. Chưa làm bước này thì thiệp vẫn chạy bình thường theo cách cũ (khách tự gửi qua Zalo / SMS).

## Bước 1. Tạo Sheet và dán script

1. Vào <https://sheets.google.com> → tạo bảng tính mới, đặt tên, ví dụ **RSVP Thiệp cưới**.
2. Menu **Tiện ích mở rộng** (Extensions) → **Apps Script**.
3. Xoá hết code mẫu, dán toàn bộ nội dung file `apps-script/rsvp.gs` của dự án → bấm **Lưu** (biểu tượng đĩa).

## Bước 2. Cấp quyền (một lần)

1. Trên thanh công cụ, chọn hàm **`setup`** rồi bấm **Chạy** (Run).
2. Khi hiện hộp thoại xin quyền: **Xem lại quyền** → chọn tài khoản Google của bạn.
3. Nếu thấy cảnh báo "Google chưa xác minh ứng dụng này" thì đây là bình thường vì script do chính bạn dán:
   bấm **Nâng cao** → **Đi tới … (không an toàn)** → **Cho phép**.
4. Quay lại Sheet sẽ thấy trang tính **RSVP** với hàng tiêu đề.

## Bước 3. Xuất bản thành Web app

1. Góc trên bên phải: **Triển khai** (Deploy) → **Lượt triển khai mới** (New deployment).
2. Bấm biểu tượng bánh răng → chọn loại **Ứng dụng web** (Web app).
3. Điền:
   - **Thực thi dưới dạng** (Execute as): **Tôi** (Me)
   - **Người có quyền truy cập** (Who has access): **Bất kỳ ai** (Anyone)
4. Bấm **Triển khai** → sao chép **URL ứng dụng web**, dạng `https://script.google.com/macros/s/.../exec`.

> "Bất kỳ ai" chỉ áp dụng cho đường link gửi dữ liệu. **Bảng tính vẫn riêng tư**, chỉ bạn (và người bạn chia sẻ) mới xem được.

## Bước 4. Dán link vào thiệp

Mở `src/data/weddingData.ts`, tìm mục `rsvp` và dán link vào `sheetUrl`:

```ts
export const rsvp = {
  // ...
  sheetUrl: 'https://script.google.com/macros/s/XXXXXXXX/exec',
  side: 'Nhà trai',
};
```

Sau đó commit và push (GitHub Pages) hoặc deploy lại (Vercel).

**Thiệp nhà gái:** dùng nhánh `nha-gai`, dán **cùng một link** và đặt `side: 'Nhà gái'`.
Hai bên sẽ ghi chung một Sheet, phân biệt bằng cột **Bên**.

## Bước 5. Kiểm tra

1. Mở link `/exec` trên trình duyệt: thấy `{"ok":true,"service":"wedding-rsvp"}` là Web app đang chạy.
2. Mở thiệp, gửi một xác nhận thử, **dùng số điện thoại bắt đầu bằng số 0**.
3. Kiểm tra trong Sheet: có dòng mới, số 0 đầu của số điện thoại còn nguyên.
4. Xoá dòng thử.

## Các cột trong Sheet

| Cột | Nội dung |
| --- | --- |
| Thời gian | Giờ Việt Nam lúc khách gửi |
| Bên | Nhà trai / Nhà gái |
| Họ tên, Số điện thoại | Khách nhập |
| Tham dự | Có tham dự / Không tham dự |
| Số người | Số khách đi cùng (kể cả người gửi); 0 nếu không tham dự |
| Lời chúc | Lời nhắn của khách |
| Mã gửi | Mã nội bộ để không ghi trùng khi khách bấm "Gửi lại". Đừng xoá cột này. |

## Khi cần sửa script

Sửa code xong: **Triển khai** → **Quản lý lượt triển khai** → biểu tượng bút chì → **Phiên bản: Phiên bản mới** → **Triển khai**.
Làm theo cách này thì link `/exec` **giữ nguyên**. Nếu bấm "Lượt triển khai mới" thì link đổi và phải dán lại vào thiệp.

## Lưu ý

- Link `/exec` nằm trong mã nguồn công khai trên GitHub nên ai có link đều có thể gửi dữ liệu lên. Script đã có ô bẫy chống bot,
  giới hạn độ dài và chống ghi trùng, nhưng **không có CAPTCHA**. Nếu bị gửi rác, hãy tạo lượt triển khai mới (link mới),
  xoá lượt cũ rồi dán link mới vào thiệp.
- Nếu Google lỗi hoặc khách mất mạng, thiệp sẽ báo lỗi và cho khách bấm **Gửi lại** hoặc gửi qua Zalo / tin nhắn.
- Tên và số điện thoại khách được lưu trong Google Sheet của bạn. Đừng chia sẻ Sheet công khai.
