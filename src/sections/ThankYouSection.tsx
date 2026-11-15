import { thankYou, weddingInfo } from '../data/weddingData';
import { formatDotDate } from '../utils/date';
import { Sprig } from '../components/common/Botanical';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { ImageReveal, Reveal, WriteIn } from '../components/layout/Section';

export function ThankYouSection() {
  return (
    <section data-nav="rsvp" className="bg-ivory px-5 pt-6 pb-10 sm:pb-16">
      <div className="mx-auto max-w-md text-center">
        <Reveal effect="scale" className="border border-olive/25 p-2">
          <ImageReveal>
            <ImageWithFallback src={thankYou.image} alt="Lời cảm ơn" aspect="portrait" />
          </ImageReveal>
        </Reveal>
        <WriteIn delay={0.2} className="mt-10 font-script text-5xl text-olive">
          {thankYou.title}
        </WriteIn>
        <Reveal delay={0.4}>
          <p className="mx-auto mt-4 max-w-sm font-serif text-lg leading-relaxed text-forest/80">{thankYou.message}</p>
        </Reveal>
        <Sprig className="mx-auto mt-8 h-5 w-24" animated delay={0.3} />
        <Reveal effect="blur" delay={0.5}>
          <p className="mt-6 font-serif text-2xl">
            {weddingInfo.bride.name} <span className="text-champagne italic">&amp;</span> {weddingInfo.groom.name}
          </p>
          <p className="mt-2 text-sm tracking-[0.3em] text-olive">{formatDotDate().replace(/ · /g, '.')}</p>
        </Reveal>
      </div>
    </section>
  );
}
