import { useCallback, useState } from 'react';
import { gallery, type GalleryImage, type ImageAspect } from '../data/weddingData';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { GalleryLightbox } from '../components/gallery/GalleryLightbox';
import { ImageReveal, Reveal, SectionTitle } from '../components/layout/Section';

const RATIO: Record<ImageAspect, number> = { portrait: 4 / 5, landscape: 3 / 2, square: 1, tall: 2 / 3 };

function Thumb({ image, onOpen }: { image: GalleryImage; onOpen: () => void }) {
  return (
    <figure className="shrink-0 snap-start">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Xem ảnh: ${image.caption}`}
        className="group block h-44 overflow-hidden sm:h-56"
        style={{ aspectRatio: String(RATIO[image.aspectRatio]) }}
      >
        <ImageWithFallback
          src={image.src}
          thumbnail={image.thumbnail}
          alt={image.alt}
          focus={image.focus}
          className="h-full w-full"
          imgClassName="duration-700 group-hover:scale-[1.04]"
          hideLabel
        />
      </button>
      <figcaption className="mt-2 font-serif text-sm text-forest/60 italic">{image.caption}</figcaption>
    </figure>
  );
}

export function GallerySection() {
  const [index, setIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [featured, ...rest] = gallery;

  const open = (i: number) => {
    setDirection(0);
    setIndex(i);
  };
  const step = useCallback((delta: number) => {
    setDirection(delta);
    setIndex((i) => (i === null ? i : (i + delta + gallery.length) % gallery.length));
  }, []);
  const next = useCallback(() => step(1), [step]);
  const prev = useCallback(() => step(-1), [step]);
  const close = useCallback(() => setIndex(null), []);

  if (!featured) return null;
  const featuredRatio = RATIO[featured.aspectRatio];

  return (
    <section id="gallery" data-nav="gallery" className="bg-warm py-20 sm:py-28">
      <div className="px-5">
        <SectionTitle script="Our Moments" title="Khoảnh khắc của chúng mình" />
      </div>

      <div className="mx-auto mt-12 max-w-5xl px-5 sm:mt-16">
        <figure className="mx-auto" style={{ maxWidth: `calc(78svh * ${featuredRatio})` }}>
          <ImageReveal>
            <button type="button" onClick={() => open(0)} aria-label={`Xem ảnh: ${featured.caption}`} className="group block w-full overflow-hidden">
              <ImageWithFallback
                src={featured.src}
                alt={featured.alt}
                aspect={featured.aspectRatio}
                focus={featured.focus}
                imgClassName="duration-1000 group-hover:scale-[1.03]"
              />
            </button>
          </ImageReveal>
          <Reveal delay={0.6}>
            <figcaption className="mt-3 text-center font-serif text-base text-forest/60 italic">{featured.caption}</figcaption>
          </Reveal>
        </figure>
      </div>

      {rest.length > 0 && (
        <Reveal className="mt-10">
          <div className="no-scrollbar mx-auto flex max-w-5xl snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 sm:gap-5 lg:flex-wrap lg:justify-center lg:overflow-visible">
            {rest.map((image, i) => (
              <Reveal key={image.id} effect="right" delay={i * 0.12} className="shrink-0 snap-start">
                <Thumb image={image} onOpen={() => open(i + 1)} />
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-center text-xs tracking-[0.2em] text-forest/45 uppercase lg:hidden">Vuốt để xem thêm</p>
        </Reveal>
      )}

      <GalleryLightbox images={gallery} index={index} direction={direction} onClose={close} onNext={next} onPrev={prev} />
    </section>
  );
}
