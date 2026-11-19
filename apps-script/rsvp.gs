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
const WISHES_PAGE_SIZE = 20;
const WISHES_SCAN_SIZE = 200;

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

/** /exec kiểm tra kết nối; /exec?action=wishes đọc sổ lưu bút công khai. */
function doGet(e) {
  const params = (e && e.parameter) || {};
  if (!params.action) return reply_({ ok: true, service: 'wedding-rsvp' });
  if (params.action !== 'wishes') return reply_({ ok: false, error: 'invalid' });

  try {
    const cursor = params.cursor == null ? null : Number(params.cursor);
    if (cursor !== null && (!Number.isSafeInteger(cursor) || cursor < 2)) {
      return reply_({ ok: false, error: 'invalid' });
    }

    // Chỉ đọc: không tạo hay thay đổi Sheet khi khách mở sổ lưu bút.
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet || sheet.getLastRow() < 2) return reply_({ ok: true, wishes: [], nextCursor: null });

    let nextRow = Math.min(cursor === null ? sheet.getLastRow() : cursor, sheet.getLastRow());
    const wishes = [];

    // Duyệt ngược để lời chúc mới nhất đứng đầu. Bỏ qua các xác nhận không có lời chúc.
    // Cursor là số dòng, nên các lời chúc mới không làm dịch trang đang xem.
    while (nextRow >= 2 && wishes.length < WISHES_PAGE_SIZE) {
      const firstRow = Math.max(2, nextRow - WISHES_SCAN_SIZE + 1);
      const rows = sheet.getRange(firstRow, 3, nextRow - firstRow + 1, 5).getDisplayValues();
      for (let i = rows.length - 1; i >= 0 && wishes.length < WISHES_PAGE_SIZE; i--) {
        const rowNumber = firstRow + i;
        nextRow = rowNumber - 1;
        const name = clean_(rows[i][0], 80);
        const message = publicWish_(rows[i][4]);
        if (!name || !message) continue;

        // Danh sách công khai chỉ có tên, lời chúc và khóa dòng để hiển thị.
        // Tuyệt đối không trả số điện thoại, tham dự, số người hay mã gửi.
        wishes.push({ id: 'wish-' + rowNumber, name: name, message: message });
      }
    }

    return reply_({ ok: true, wishes: wishes, nextCursor: nextRow >= 2 ? nextRow : null });
  } catch (err) {
    return reply_({ ok: false, error: 'server' });
  }
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

/** Bản nhà gái cũ ghi cữ tiệc vào đầu ô lời chúc; thông tin này không thuộc sổ công khai. */
function publicWish_(value) {
  return clean_(value, 500)
    .replace(/^\[(?:Cữ tiệc|Thiệp mời): Cữ (?:trưa|chiều) (?:10:30|16:00) \| \d{2}\/\d{2}\/\d{4}\]\s*/, '')
    .trim();
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
