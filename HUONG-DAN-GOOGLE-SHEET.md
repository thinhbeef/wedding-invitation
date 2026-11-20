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

> "Bất kỳ ai" áp dụng cho Web app gửi xác nhận và đọc lời chúc. **Bảng tính vẫn riêng tư**; sổ lưu bút công khai chỉ trả tên và lời chúc, không trả số điện thoại hay thông tin tham dự.

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

## Bật sổ lưu bút khi đã nối Google Sheet trước đó

Danh sách **Lời chúc yêu thương** tự hiển thị ngay dưới biểu mẫu xác nhận, với lời chúc mới nhất trước; bấm **Xem thêm lời chúc** để đọc tiếp khi có nhiều hơn 20 lời chúc. Các lời chúc cũ trong Sheet cũng được hiển thị, kể cả lời chúc của khách không tham dự. Dòng không có lời chúc được bỏ qua.

**Cần cập nhật Apps Script một lần** vì bản trước chỉ nhận xác nhận, chưa có API đọc lời chúc:

1. Mở **chính Google Sheet đang nhận xác nhận** → **Tiện ích mở rộng → Apps Script**.
2. Thay code bằng toàn bộ nội dung mới trong [`apps-script/rsvp.gs`](apps-script/rsvp.gs), rồi **Lưu**. Giữ nguyên trang tính **RSVP** và dữ liệu hiện có; không cần chạy lại `setup`.
3. Chọn **Triển khai → Quản lý lượt triển khai → bút chì → Phiên bản mới → Triển khai**. Giữ quyền **Thực thi: Tôi**, **Truy cập: Bất kỳ ai**. Link `/exec` giữ nguyên nên không cần sửa `sheetUrl`.
4. Mở link hiện tại và thêm `?action=wishes` ở cuối. Kết quả đúng có dạng `{"ok":true,"wishes":[{"id":"wish-2","name":"Tên khách","message":"Lời chúc"}],"nextCursor":null}`. Nếu Sheet chưa có lời chúc, `wishes` là `[]`.
5. Khi bạn muốn đưa tính năng lên online, cập nhật bản website có phần sổ lưu bút. Cuộn đến **Lời chúc yêu thương** trên điện thoại hoặc một trình duyệt khác để đối chiếu với Sheet.

Chỉ lưu code Apps Script mà chưa tạo **Phiên bản mới** thì Web app vẫn chạy bản cũ và sổ lưu bút sẽ báo chưa tải được lời chúc. Nếu kết quả ở bước 4 chỉ có `service: "wedding-rsvp"`, lượt triển khai vẫn dùng script cũ.

Tham khảo [hướng dẫn cập nhật lượt triển khai của Google](https://developers.google.com/apps-script/concepts/deployments#edit_a_versioned_deployment) để đổi phiên bản mà giữ nguyên URL.

Danh sách tải trực tiếp từ Sheet khi mở trang, không dùng bộ nhớ trình duyệt làm nguồn lưu lời chúc. Sau khi gửi lời chúc thành công, danh sách tự tải lại để hiển thị lời vừa gửi. Nếu hai thiệp nhà trai và nhà gái dùng chung Sheet thì hai bên cùng xem chung sổ lưu bút.

API công khai chỉ trả khóa dòng `id`, `name`, `message` và `nextCursor` để tải thêm từng 20 lời chúc. Số điện thoại, trạng thái tham dự, số người, bên nhà trai/nhà gái và mã gửi không được trả ra. Muốn gỡ một lời chúc, xoá nội dung ô **Lời chúc** của dòng đó trong Sheet; các thông tin xác nhận vẫn được giữ lại và lần mở sổ tiếp theo sẽ không thấy lời chúc ấy.

## Lưu ý

- Link `/exec` nằm trong mã nguồn công khai trên GitHub nên ai có link đều có thể gửi dữ liệu lên. Script đã có ô bẫy chống bot,
  giới hạn độ dài và chống ghi trùng, nhưng **không có CAPTCHA**. Nếu bị gửi rác, hãy tạo lượt triển khai mới (link mới),
  xoá lượt cũ rồi dán link mới vào thiệp.
- Nếu Google lỗi hoặc khách mất mạng, thiệp sẽ báo lỗi và cho khách bấm **Gửi lại** hoặc gửi qua Zalo / tin nhắn.
- Tên và số điện thoại khách được lưu trong Google Sheet của bạn. Đừng chia sẻ Sheet công khai.
