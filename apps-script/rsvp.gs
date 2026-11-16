/**
 * Ghi xác nhận tham dự từ thiệp cưới vào Google Sheet (không cần database).
 * Cách dùng: xem HUONG-DAN-GOOGLE-SHEET.md ở thư mục gốc dự án.
 *
 * Dán file này vào Apps Script GẮN VỚI Google Sheet (Tiện ích mở rộng → Apps Script),
 * rồi Deploy → Web app (Execute as: Me, Who has access: Anyone).
 */

const SHEET_NAME = 'RSVP';
const HEADERS = ['Thời gian', 'Bên', 'Họ tên', 'Số điện thoại', 'Tham dự', 'Số người', 'Lời chúc', 'Mã gửi'];
// Cột dùng định dạng văn bản: giữ số 0 đầu của số điện thoại, nội dung không bị hiểu là công thức
const FORMATS = ['@', '@', '@', '@', '@', '0', '@', '@'];
const ID_COL = HEADERS.length;
const TIMEZONE = 'Asia/Ho_Chi_Minh';
const RECENT_ROWS = 300; // chỉ so mã gửi với 300 dòng gần nhất để chống ghi trùng

function doPost(e) {
  const lock = LockService.getScriptLock();
  let locked = false;
  try {
    lock.waitLock(15000);
    locked = true;

    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Ô bẫy chống bot: người thật không điền. Báo thành công giả và không ghi gì.
    if (data.website) return reply_({ ok: true });

    const name = clean_(data.name, 80);
    const attendance = data.attendance === 'yes' ? 'Có tham dự' : data.attendance === 'no' ? 'Không tham dự' : '';
    if (name.length < 2 || !attendance) return reply_({ ok: false, error: 'invalid' });

    const id = clean_(data.id, 64);
    const sheet = getSheet_();

    // Gửi lại cùng một mã (do mạng chập chờn) thì không ghi thêm dòng
    if (id && isDuplicate_(sheet, id)) return reply_({ ok: true, duplicate: true });

    const guests = data.attendance === 'yes' ? Math.min(Math.max(parseInt(data.guests, 10) || 1, 1), 20) : 0;
    const row = sheet.getLastRow() + 1;
    const range = sheet.getRange(row, 1, 1, HEADERS.length);
    range.setNumberFormats([FORMATS]); // đặt định dạng TRƯỚC khi ghi giá trị
    range.setValues([[
      Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss'),
      clean_(data.side, 20),
      name,
      clean_(data.phone, 24),
      attendance,
      guests,
      clean_(data.message, 500),
      id,
    ]]);

    return reply_({ ok: true });
  } catch (err) {
    return reply_({ ok: false, error: 'server' });
  } finally {
    if (locked) lock.releaseLock();
  }
}

/** Mở link /exec trên trình duyệt để kiểm tra nhanh Web app đang chạy. */
function doGet() {
  return reply_({ ok: true, service: 'wedding-rsvp' });
}

/** Chạy hàm này MỘT LẦN trong trình soạn thảo để cấp quyền và tạo sẵn trang tính. */
function setup() {
  getSheet_();
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function isDuplicate_(sheet, id) {
  const last = sheet.getLastRow();
  if (last < 2) return false;
  const count = Math.min(RECENT_ROWS, last - 1);
  const ids = sheet.getRange(last - count + 1, ID_COL, count, 1).getValues();
  return ids.some(function (r) {
    return r[0] === id;
  });
}

function clean_(value, max) {
  return String(value == null ? '' : value)
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .trim()
    .slice(0, max);
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
