import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';

const source = async (file) => readFile(new URL('../src/' + file, import.meta.url), 'utf8');
const moduleUrl = (text) => 'data:text/javascript;base64,' + Buffer.from(stripTypeScriptTypes(text)).toString('base64');

async function invitationFor(side, pathname) {
  const variantUrl = moduleUrl((await source('data/invitationVariant.ts'))
    .replace('import.meta.env.VITE_INVITATION_SIDE', JSON.stringify(side))
    .replace("typeof window === 'undefined' ? '/' : window.location.pathname", JSON.stringify(pathname)));
  const weddingUrl = moduleUrl((await source('data/weddingData.ts'))
    .replace("import { BookHeart, CalendarHeart, House, Images, MailCheck } from 'lucide-react';", 'const BookHeart = {}, CalendarHeart = {}, House = {}, Images = {}, MailCheck = {};')
    .replaceAll("'./invitationVariant'", JSON.stringify(variantUrl))
    .replace('import.meta.env.BASE_URL', "'/'"));
  const dateUrl = moduleUrl((await source('utils/date.ts')).replaceAll("'../data/weddingData'", JSON.stringify(weddingUrl)));
  const messagingUrl = moduleUrl((await source('utils/messaging.ts'))
    .replaceAll("'../data/weddingData'", JSON.stringify(weddingUrl))
    .replaceAll("'../data/invitationVariant'", JSON.stringify(variantUrl)));
  const calendarUrl = moduleUrl((await source('utils/calendar.ts'))
    .replaceAll("'../data/weddingData'", JSON.stringify(weddingUrl))
    .replaceAll("'../data/invitationVariant'", JSON.stringify(variantUrl))
    .replaceAll("'./date'", JSON.stringify(dateUrl))
    .replaceAll("'./messaging'", JSON.stringify(messagingUrl)));
  return {
    variant: (await import(variantUrl)).invitationVariant,
    data: await import(weddingUrl),
    messaging: await import(messagingUrl),
    calendar: await import(calendarUrl),
  };
}

for (const example of [
  { side: 'groom', path: '/', date: '2026-12-06', time: '11:00', first: 'Ngọc Thịnh', ceremony: 'Lễ tân hôn', utc: '20261206T040000Z' },
  { side: 'bride', path: '/10h30-trua', date: '2026-12-05', time: '10:30', first: 'Như Ý', ceremony: 'Lễ vu quy', utc: '20261205T033000Z' },
  { side: 'bride', path: '/16h/', date: '2026-12-05', time: '16:00', first: 'Như Ý', ceremony: 'Lễ vu quy', utc: '20261205T090000Z' },
]) {
  test(example.side + example.path + ' retains its date, time, names, calendar and Sheet session', async () => {
    const { variant, data, messaging, calendar } = await invitationFor(example.side, example.path);
    assert.equal(data.weddingInfo.date, example.date);
    assert.equal(data.weddingInfo.time, example.time);
    assert.equal(data.displayCouple[0].name, example.first);
    assert.equal(data.hero.tagline, example.ceremony);
    assert.ok(data.story.intro.includes(example.side === 'bride' ? 'Ngày 5 tháng 12' : 'Ngày 6 tháng 12'));
    const ics = calendar.buildIcs();
    assert.ok(ics.includes('DTSTART:' + example.utc));
    assert.ok(ics.includes(example.ceremony.toLocaleLowerCase('vi-VN')));
    const payload = { name: 'Khách', phone: '', attendance: 'yes', guests: 2, message: 'Chúc mừng!' };
    const sheetMessage = messaging.buildSheetMessage(payload);
    assert.ok(sheetMessage.endsWith('Chúc mừng!'));
    if (example.side === 'bride') {
      assert.equal(data.rsvp.side, 'Nhà gái');
      assert.equal(variant.sessions.length, 1);
      assert.ok(sheetMessage.includes(example.time + ' | 05/12/2026'));
      assert.ok(messaging.buildRsvpMessage(payload).includes(example.time));
      assert.ok(data.weddingInfo.mapsUrl.includes('9.281501038003864'));
    } else {
      assert.equal(data.rsvp.side, 'Nhà trai');
      assert.equal(sheetMessage, 'Chúc mừng!');
    }
  });
}

test('bride home retains both sessions and selected calendars use the intended time', async () => {
  const { variant, messaging, calendar } = await invitationFor('bride', '/');
  assert.equal(variant.sessions.length, 2);
  assert.ok(calendar.buildIcs('16:00').includes('DTSTART:20261205T090000Z'));
  const payload = { name: 'Khách', phone: '', attendance: 'yes', guests: 1, message: '', sessionId: 'afternoon' };
  assert.equal(messaging.buildSheetMessage(payload), '[Cữ tiệc: Cữ chiều 16:00 | 05/12/2026]');
});
