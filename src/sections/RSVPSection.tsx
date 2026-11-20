import { useState } from 'react';
import { rsvp } from '../data/weddingData';
import { RSVPForm } from '../components/forms/RSVPForm';
import { Guestbook } from '../components/wedding/Guestbook';
import { isSheetConfigured } from '../utils/rsvpSheet';
import { Reveal, SectionTitle } from '../components/layout/Section';

export function RSVPSection() {
  const [wishesVersion, setWishesVersion] = useState(0);

  return (
    <section id="rsvp" data-nav="rsvp" className="section-space bg-ivory">
      <div className="rsvp-layout">
        <SectionTitle script="RSVP" title={rsvp.title} subtitle={isSheetConfigured() ? rsvp.note : rsvp.noteFallback} />
        <Reveal effect="scale" className="rsvp-panel">
          <RSVPForm maxGuests={rsvp.maxGuests} onWishSaved={() => setWishesVersion((version) => version + 1)} />
        </Reveal>
        {isSheetConfigured() && <Guestbook refreshVersion={wishesVersion} />}
      </div>
    </section>
  );
}
