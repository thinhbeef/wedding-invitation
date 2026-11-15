/**
 * Nhận xác nhận tham dự từ thiệp cưới và ghi vào Google Sheet.
 * Cách dùng: xem README mục 5.
 */
const SHEET_NAME = 'RSVP';
const NOTIFY_EMAIL = ''; // điền email để nhận thông báo mỗi khi có người xác nhận (để trống = không gửi)

const SESSIONS = { lunch: 'Cữ trưa 11:00', dinner: 'Cữ chiều 16:00' };

function clean(value, max) {
  return String(value == null ? '' : value).slice(0, max || 500);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Thời gian', 'Họ tên', 'Số điện thoại', 'Tham dự', 'Cữ', 'Số người', 'Lời chúc']);
      sheet.setFrozenRows(1);
    }
    const yes = d.attendance === 'yes';
    const phone = clean(d.phone, 20);
    sheet.appendRow([
      new Date(),
      clean(d.name, 60),
      phone ? "'" + phone : '', // giữ số 0 đầu
      yes ? 'Có' : 'Không',
      yes ? SESSIONS[d.session] || clean(d.session, 20) : '',
      yes ? Math.min(Number(d.guests) || 1, 20) : '',
      clean(d.message, 400),
    ]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        (yes ? '[Thiệp cưới] Sẽ tham dự: ' : '[Thiệp cưới] Không thể đến: ') + clean(d.name, 60),
        'Họ tên: ' + clean(d.name, 60) +
          '\nSĐT: ' + phone +
          '\nCữ: ' + (yes ? SESSIONS[d.session] || '' : '-') +
          '\nSố người: ' + (yes ? d.guests : '-') +
          '\nLời chúc: ' + clean(d.message, 400)
      );
    }
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error');
  } finally {
    lock.releaseLock();
  }
}
