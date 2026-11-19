import { thankYou, displayCouple } from '../data/weddingData';
import { Sprig } from '../components/common/Botanical';
import { WeddingMonogram } from '../components/wedding/WeddingMonogram';
import { Reveal, WriteIn } from '../components/layout/Section';

export function ThankYouSection() {
  return (
    <section data-nav="rsvp" className="thankyou-section">
      <div className="thankyou-inner">
        <WeddingMonogram className="thankyou-monogram" />
        <WriteIn className="mt-5 font-script text-5xl text-olive">
          {thankYou.title}
        </WriteIn>
        <Reveal>
          <p className="thankyou-message">{thankYou.message}</p>
        </Reveal>
        <Sprig className="mx-auto mt-5 h-5 w-24" />
        <Reveal>
          <p className="mt-4 font-serif text-2xl">
            {displayCouple[0].name} <span className="text-champagne italic">&amp;</span> {displayCouple[1].name}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
