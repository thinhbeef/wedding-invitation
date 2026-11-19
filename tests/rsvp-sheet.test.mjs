import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';
import vm from 'node:vm';

const scriptSource = await readFile(new URL('../apps-script/rsvp.gs', import.meta.url), 'utf8');
const headers = ['Thời gian', 'Bên', 'Họ tên', 'Số điện thoại', 'Tham dự', 'Số người', 'Lời chúc', 'Mã gửi'];

function createScript(initialRows = [], exists = true) {
  const rows = [headers, ...initialRows];
  const sheet = {
    getLastRow: () => rows.length,
    getRange(start, column, count, width) {
      const values = () => rows.slice(start - 1, start - 1 + count).map((row) => row.slice(column - 1, column - 1 + width));
      return {
        getValues: values,
        getDisplayValues: () => values().map((row) => row.map(String)),
        setNumberFormats() {},
        setValues(valuesToWrite) {
          for (let i = 0; i < valuesToWrite.length; i++) rows[start - 1 + i] = [...valuesToWrite[i]];
        },
      };
    },
  };
  const context = vm.createContext({
    SpreadsheetApp: {
      getActiveSpreadsheet: () => ({
        getSheetByName: () => exists ? sheet : null,
        insertSheet: () => { throw new Error('Public reads must not create sheets'); },
      }),
    },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    Utilities: { formatDate: () => '2026-11-19 12:00:00' },
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput: (body) => ({ setMimeType: () => JSON.parse(body) }),
    },
  });
  vm.runInContext(scriptSource, context);
  return {
    rows,
    get: (params = {}) => context.doGet({ parameter: params }),
    post: (data) => context.doPost({ postData: { contents: JSON.stringify(data) } }),
  };
}

const row = (name, message, id = name) => ['2026-11-19 12:00:00', 'Nhà gái', name, '0901234567', 'Không tham dự', 0, message, id];

test('health check stays compatible and unknown actions are rejected', () => {
  const app = createScript();
  assert.deepEqual(app.get(), { ok: true, service: 'wedding-rsvp' });
  assert.deepEqual(app.get({ action: 'contacts' }), { ok: false, error: 'invalid' });
});

test('empty or missing sheets return an empty guestbook without creating a sheet', () => {
  for (const exists of [true, false]) {
    assert.deepEqual(createScript([], exists).get({ action: 'wishes' }), { ok: true, wishes: [], nextCursor: null });
  }
});

test('only names and nonempty wishes are public, including older rows without submission IDs', () => {
  const app = createScript([
    row('Khách cũ', 'Chúc hai bạn trăm năm hạnh phúc!', ''),
    row('Chỉ xác nhận', '  \n  '),
    row('Bạn mới', 'Hạnh phúc nhé ❤️'),
  ]);
  assert.deepEqual(app.get({ action: 'wishes' }), {
    ok: true,
    wishes: [
      { id: 'wish-4', name: 'Bạn mới', message: 'Hạnh phúc nhé ❤️' },
      { id: 'wish-2', name: 'Khách cũ', message: 'Chúc hai bạn trăm năm hạnh phúc!' },
    ],
    nextCursor: null,
  });
});

test('saved wishes appear in subsequent reads and retrying a submission does not duplicate them', () => {
  const app = createScript();
  const payload = { id: 'submission-1', side: 'Nhà trai', name: 'Minh Anh', phone: '0901234567', attendance: 'no', guests: 3, message: 'Chúc mừng hai bạn!', website: '' };
  assert.deepEqual(app.post(payload), { ok: true });
  assert.deepEqual(app.post(payload), { ok: true, duplicate: true });
  assert.equal(app.rows.length, 2);
  assert.equal(app.rows[1][3], '0901234567');
  assert.equal(app.rows[1][5], 0);
  assert.deepEqual(app.get({ action: 'wishes' }).wishes, [{ id: 'wish-2', name: 'Minh Anh', message: 'Chúc mừng hai bạn!' }]);
});

test('bride session details are private and metadata-only confirmations are not wishes', () => {
  const app = createScript([
    row('Khách trưa', '[Cữ tiệc: Cữ trưa 10:30 | 05/12/2026]\nChúc mừng hai bạn!'),
    row('Chỉ tham dự', '[Cữ tiệc: Cữ chiều 16:00 | 05/12/2026]'),
    row('Khách vắng', '[Thiệp mời: Cữ chiều 16:00 | 05/12/2026] Hạnh phúc nhé!'),
  ]);
  const page = app.get({ action: 'wishes' });
  assert.deepEqual(page.wishes.map((wish) => wish.message), ['Hạnh phúc nhé!', 'Chúc mừng hai bạn!']);
  assert.equal(JSON.stringify(page).includes('16:00'), false);
});

test('validation and bot checks still prevent unwanted writes', () => {
  const app = createScript();
  assert.equal(app.post({ name: 'A', attendance: 'yes' }).ok, false);
  assert.equal(app.post({ name: 'Khách', attendance: 'maybe' }).ok, false);
  assert.equal(app.post({ name: 'Bot', attendance: 'yes', message: 'Spam', website: 'spam' }).ok, true);
  assert.equal(app.rows.length, 1);
});

test('pagination scans past blank wishes and new submissions do not shift older pages', () => {
  const initialRows = Array.from({ length: 470 }, (_, i) => row(`Khách ${i}`, i % 10 === 0 ? `Lời chúc ${i}` : ''));
  const app = createScript(initialRows);
  let page = app.get({ action: 'wishes' });
  assert.equal(page.wishes.length, 20);
  const all = [...page.wishes];
  app.rows.push(row('Vừa gửi', 'Lời chúc mới'));
  while (page.nextCursor !== null) {
    const cursor = page.nextCursor;
    page = app.get({ action: 'wishes', cursor: String(cursor) });
    assert.ok(page.nextCursor === null || page.nextCursor < cursor);
    assert.ok(page.wishes.length <= 20);
    all.push(...page.wishes);
  }
  assert.equal(all.length, 47);
  assert.equal(new Set(all.map((wish) => wish.id)).size, 47);
  assert.deepEqual(all.map((wish) => wish.name), Array.from({ length: 47 }, (_, i) => `Khách ${460 - i * 10}`));
  assert.equal(app.get({ action: 'wishes' }).wishes[0].name, 'Vừa gửi');
});

test('bad cursors are rejected and cursors beyond the last row are safe', () => {
  const app = createScript([row('Khách', 'Lời chúc')]);
  for (const cursor of ['', '0', '1', '-1', '2.5', 'NaN', 'Infinity', '9007199254740992']) {
    assert.deepEqual(app.get({ action: 'wishes', cursor }), { ok: false, error: 'invalid' });
  }
  assert.equal(app.get({ action: 'wishes', cursor: '999' }).wishes.length, 1);
});

const clientSource = (await readFile(new URL('../src/utils/rsvpSheet.ts', import.meta.url), 'utf8'))
  .replace("import { buildSheetMessage, type RsvpPayload } from './messaging';", "const buildSheetMessage = (data) => data.message.trim();")
  .replace("import { rsvp } from '../data/weddingData';", "const rsvp = { sheetUrl: 'https://script.google.com/macros/s/test/exec', side: 'Nhà trai' };");
const client = await import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(clientSource)).toString('base64')}`);

test('client reads fresh shared data, validates responses, and supports cancellation', async (t) => {
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  globalThis.window = { setTimeout, clearTimeout };
  t.after(() => { globalThis.fetch = originalFetch; globalThis.window = originalWindow; });

  const goodPage = { ok: true, wishes: [{ id: 'wish-4', name: 'Khách', message: 'Chúc mừng!', phone: 'PRIVATE' }], nextCursor: 3 };
  globalThis.fetch = async (url, init) => {
    assert.equal(url.searchParams.get('action'), 'wishes');
    assert.equal(url.searchParams.get('cursor'), '5');
    assert.equal(init.cache, 'no-store');
    assert.equal(init.credentials, 'omit');
    return Response.json(goodPage);
  };
  assert.deepEqual(await client.fetchWishesFromSheet(5), {
    wishes: [{ id: 'wish-4', name: 'Khách', message: 'Chúc mừng!' }], nextCursor: 3,
  });

  for (const response of [
    { ok: true, service: 'wedding-rsvp' },
    { ok: false, error: 'server' },
    { ...goodPage, nextCursor: 5 },
    { ...goodPage, nextCursor: -1 },
    { ...goodPage, wishes: [{ id: 'x', name: '', message: 'Test' }] },
  ]) {
    globalThis.fetch = async () => Response.json(response);
    await assert.rejects(client.fetchWishesFromSheet(5));
  }
  globalThis.fetch = async () => Response.json(goodPage, { status: 500 });
  await assert.rejects(client.fetchWishesFromSheet());
  globalThis.fetch = async () => new Response('<html>Login required</html>');
  await assert.rejects(client.fetchWishesFromSheet());

  const controller = new AbortController();
  globalThis.fetch = (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
  });
  const pending = client.fetchWishesFromSheet(null, controller.signal);
  controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
});
