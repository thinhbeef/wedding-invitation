import { CalendarPlus, MapPin } from 'lucide-react';
import { invitation, weddingInfo, type Person } from '../data/weddingData';
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
                <Family label="Nhà trai" person={weddingInfo.groom} />
                <Family label="Nhà gái" person={weddingInfo.bride} />
              </div>
              <WriteIn className="invitation-greeting">{invitation.greeting}</WriteIn>
              <p className="invitation-lead">{invitation.lead}</p>
              <h2 className="invitation-names">
                {weddingInfo.groom.name}<span>&amp;</span>{weddingInfo.bride.name}
              </h2>
            </div>
            <div className="invitation-event">
              <div className="invitation-date">
                <p className="invitation-date-side">{hour}:{minute}</p>
                <div>
                  <p className="invitation-date-meta">Tháng {month}</p>
                  <p className="invitation-date-number">{day}</p>
                  <p className="invitation-date-meta">{year}</p>
                </div>
                <p className="invitation-date-side">{weekday}</p>
              </div>
              <p className="invitation-venue">{weddingInfo.venue}</p>
              <p className="invitation-address">{weddingInfo.address}</p>
              <div className="invitation-actions">
                <a href={getMapsUrl()} target="_blank" rel="noopener noreferrer">
                  <MapPin size={15} strokeWidth={1.5} /> Chỉ đường
                </a>
                <button type="button" onClick={downloadIcs}>
                  <CalendarPlus size={15} strokeWidth={1.5} /> Lưu lịch
                </button>
              </div>
            </div>
          </div>
          <p className="invitation-note">{invitation.message}</p>
        </div>
      </Reveal>
    </section>
  );
}
