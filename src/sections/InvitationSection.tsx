import { CalendarPlus, MapPin } from 'lucide-react';
import { invitation, weddingInfo, displayCouple, type Person } from '../data/weddingData';
import { invitationVariant } from '../data/invitationVariant';
import { downloadIcs } from '../utils/calendar';
import { getWeddingDateParts } from '../utils/date';
import { getMapsUrl } from '../utils/messaging';
import { BotanicalBranch } from '../components/common/Botanical';
import { Reveal, WriteIn } from '../components/layout/Section';

function Family({ label, person }: { label: string; person: Person }) {
  return (
    <div>
      <p className="family-label">{label}</p>
      {person.father && <p className="family-parent">Ông {person.father}</p>}
      {person.mother && <p className="family-parent">Bà {person.mother}</p>}
      {person.home && <p className="family-home">{person.home}</p>}
    </div>
  );
}

export function InvitationSection() {
  const { day, month, year, weekday } = getWeddingDateParts();
  const [hour, minute] = weddingInfo.time.split(':');

  return (
    <section id="invitation" data-nav="wedding" className="section-space bg-ivory">
      <Reveal className="invitation-card">
        <div className="invitation-card-inner">
          <BotanicalBranch className="invitation-decoration invitation-decoration--top" outline />
          <BotanicalBranch className="invitation-decoration invitation-decoration--bottom" outline />
          <div className="invitation-columns">
            <div>
              <div className="invitation-families">
                <Family label={invitationVariant.isBride ? 'Nhà gái' : 'Nhà trai'} person={displayCouple[0]} />
                <Family label={invitationVariant.isBride ? 'Nhà trai' : 'Nhà gái'} person={displayCouple[1]} />
              </div>
              <WriteIn className="invitation-greeting">{invitation.greeting}</WriteIn>
              <p className="invitation-lead">{invitation.lead}</p>
              <h2 className="invitation-names">
                {displayCouple[0].name}<span>&amp;</span>{displayCouple[1].name}
              </h2>
            </div>
            <div className="invitation-event">
              <div className="invitation-date">
                <p className="invitation-date-side">{invitationVariant.isBride && !invitationVariant.session ? 'Hai cữ tiệc' : `${hour}:${minute}`}</p>
                <div>
                  <p className="invitation-date-meta">Tháng {month}</p>
                  <p className="invitation-date-number">{day}</p>
                  <p className="invitation-date-meta">{year}</p>
                </div>
                <p className="invitation-date-side">{weekday}</p>
              </div>
              {invitationVariant.isBride && !invitationVariant.session && (
                <div className="my-5 grid grid-cols-2 gap-3" aria-label="Hai cữ tiệc">
                  {invitationVariant.sessions.map((session) => (
                    <div key={session.id} className="border border-olive/25 p-3 text-center">
                      <p className="text-xs text-olive-deep">{session.label}</p>
                      <p className="font-serif text-3xl">{session.time}</p>
                      <button type="button" className="mt-2 text-xs underline underline-offset-4" onClick={() => downloadIcs(session.time)}>Lưu lịch {session.time}</button>
                    </div>
                  ))}
                </div>
              )}
              <p className="invitation-venue">{weddingInfo.venue}</p>
              <p className="invitation-address">{weddingInfo.address}</p>
              <div className="invitation-actions">
                <a href={getMapsUrl()} target="_blank" rel="noopener noreferrer">
                  <MapPin size={15} strokeWidth={1.5} /> Chỉ đường
                </a>
                {(!invitationVariant.isBride || invitationVariant.session) && <button type="button" onClick={() => downloadIcs()}>
                  <CalendarPlus size={15} strokeWidth={1.5} /> Lưu lịch
                </button>}
              </div>
            </div>
          </div>
          <p className="invitation-note">{invitation.message}</p>
        </div>
      </Reveal>
    </section>
  );
}
