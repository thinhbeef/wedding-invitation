import { rsvp } from '../data/weddingData';
import { RSVPForm } from '../components/forms/RSVPForm';
import { Guestbook } from '../components/wedding/Guestbook';
import { isSheetConfigured } from '../utils/rsvpSheet';
import { Reveal, SectionTitle } from '../components/layout/Section';

export function RSVPSection() {
  return (
    <section id="rsvp" data-nav="rsvp" className="section-space bg-ivory">
      <div className="rsvp-layout">
        <SectionTitle script="RSVP" title={rsvp.title} subtitle={isSheetConfigured() ? rsvp.note : rsvp.noteFallback} />
        <Reveal effect="scale" className="rsvp-panel">
          <RSVPForm maxGuests={rsvp.maxGuests} />
          {isSheetConfigured() && <Guestbook />}
        </Reveal>
      </div>
    </section>
  );
}
