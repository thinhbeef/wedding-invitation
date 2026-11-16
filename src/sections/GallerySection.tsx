import { useCallback, useState } from 'react';
import { gallery, type GalleryImage, type ImageAspect } from '../data/weddingData';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { GalleryLightbox } from '../components/gallery/GalleryLightbox';
import { Reveal, SectionTitle } from '../components/layout/Section';

const RATIO: Record<ImageAspect, number> = { portrait: 4 / 5, landscape: 3 / 2, square: 1, tall: 2 / 3 };

function GalleryTile({ image, index, onOpen }: { image: GalleryImage; index: number; onOpen: () => void }) {
  return (
    <Reveal
      className={index === 0 ? 'col-span-2 sm:col-span-2' : ''}
      effect={index === 0 ? 'scale' : 'up'}
      delay={Math.min(index * 0.1, 0.5)}
    >
      <figure>
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Xem ảnh: ${image.caption}`}
          className="group block w-full overflow-hidden border border-olive/20 bg-ivory"
          style={{ aspectRatio: String(RATIO[image.aspectRatio]) }}
        >
          <ImageWithFallback
            src={image.src}
            thumbnail={image.thumbnail}
            alt={image.alt}
            focus={image.focus}
            className="h-full w-full"
            imgClassName="duration-700 group-hover:scale-[1.04]"
          />
        </button>
        {image.caption && <figcaption className="mt-2 font-serif text-sm text-forest/60 italic">{image.caption}</figcaption>}
      </figure>
    </Reveal>
  );
}

export function GallerySection() {
  const [index, setIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

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

  if (gallery.length === 0) return null;

  return (
    <section id="gallery" data-nav="gallery" className="bg-warm py-20 sm:py-28">
      <div className="px-5">
        <SectionTitle script="Our Moments" title="Khoảnh khắc của chúng mình" />
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 items-start gap-x-3 gap-y-6 px-5 sm:mt-16 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8">
        {gallery.map((image, i) => (
          <GalleryTile key={image.id} image={image} index={i} onOpen={() => open(i)} />
        ))}
      </div>

      <GalleryLightbox images={gallery} index={index} direction={direction} onClose={close} onNext={next} onPrev={prev} />
    </section>
  );
}
