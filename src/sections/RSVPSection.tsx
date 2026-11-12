import { rsvp } from '../data/weddingData';
import { RSVPForm } from '../components/forms/RSVPForm';
import { Reveal, SectionTitle } from '../components/layout/Section';

export function RSVPSection() {
  return (
    <section id="rsvp" data-nav="rsvp" className="bg-ivory px-5 py-20 sm:py-28">
      <SectionTitle script="RSVP" title={rsvp.title} subtitle={rsvp.note} />
      <Reveal effect="scale" duration={1.1} className="mx-auto mt-12 max-w-lg border border-olive/25 bg-warm px-5 py-8 sm:px-10 sm:py-10">
        <RSVPForm maxGuests={rsvp.maxGuests} />
      </Reveal>
    </section>
  );
}
