import { useCallback, useState } from 'react';
import { gallery, type GalleryImage, type ImageAspect } from '../data/weddingData';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { GalleryLightbox } from '../components/gallery/GalleryLightbox';
import { Reveal, SectionTitle } from '../components/layout/Section';

const RATIO: Record<ImageAspect, number> = { portrait: 4 / 5, landscape: 3 / 2, square: 1, tall: 2 / 3 };

function GalleryTile({ image, index, onOpen }: { image: GalleryImage; index: number; onOpen: () => void }) {
  return (
    <Reveal
      className="gallery-tile"
      effect="up"
      delay={Math.min(index * 0.06, 0.2)}
    >
      <figure>
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Xem ảnh: ${image.caption || image.alt}`}
          className="gallery-button group"
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
    <section id="gallery" data-nav="gallery" className="section-space bg-warm">
      <div>
        <SectionTitle script="Our Moments" title="Khoảnh khắc của chúng mình" />
      </div>

      <div className="gallery-layout">
        {gallery.map((image, i) => (
          <GalleryTile key={image.id} image={image} index={i} onOpen={() => open(i)} />
        ))}
      </div>

      <GalleryLightbox images={gallery} index={index} direction={direction} onClose={close} onNext={next} onPrev={prev} />
    </section>
  );
}
