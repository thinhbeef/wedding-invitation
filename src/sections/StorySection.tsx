import { motion } from 'framer-motion';
import { story } from '../data/weddingData';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { Reveal, SectionTitle } from '../components/layout/Section';

// Góc nghiêng và độ lệch của từng polaroid
const TILTS = [
  { rotate: -5, y: 0 },
  { rotate: 3, y: -18 },
  { rotate: -2, y: 10 },
];

export function StorySection() {
  return (
    <section id="story" data-nav="story" className="overflow-hidden bg-warm px-5 py-20 sm:py-28">
      <SectionTitle script="Our Story" title="Chuyện của chúng mình" />

      <div className="mx-auto mt-14 flex max-w-4xl justify-center sm:mt-16">
        {story.photos.map((photo, i) => {
          const tilt = TILTS[i % TILTS.length];
          return (
            <motion.figure
              key={photo.src}
              className={`w-[38%] max-w-[260px] shrink-0 bg-white p-2 pb-3 shadow-[0_14px_30px_-16px_rgb(52_59_48/0.45)] sm:p-3 sm:pb-4 ${
                i > 0 ? '-ml-[12%] sm:-ml-8' : ''
              }`}
              style={{ zIndex: i === 1 ? 2 : 1 }}
              initial={{ opacity: 0, y: -60, rotate: tilt.rotate * 3 }}
              whileInView={{ opacity: 1, y: tilt.y, rotate: tilt.rotate }}
              whileHover={{ rotate: 0, scale: 1.06, zIndex: 5, transition: { duration: 0.4 } }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: 'spring', stiffness: 70, damping: 14, delay: i * 0.25 }}
            >
              {/* Ảnh "hiện hình" dần như polaroid thật */}
              <motion.div
                initial={{ filter: 'sepia(0.8) brightness(1.6) contrast(0.6)' }}
                whileInView={{ filter: 'sepia(0) brightness(1) contrast(1)' }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 2.4, delay: 0.6 + i * 0.25 }}
              >
                <ImageWithFallback src={photo.src} alt={photo.alt} aspect="portrait" focus={photo.focus} />
              </motion.div>
              <figcaption className="mt-2 truncate text-center font-serif text-sm text-forest/70 italic sm:text-base">{photo.caption}</figcaption>
            </motion.figure>
          );
        })}
      </div>

      <Reveal effect="blur" duration={1.4} className="mx-auto mt-14 max-w-lg text-center">
        <p className="font-serif text-xl leading-relaxed text-forest/80">{story.intro}</p>
      </Reveal>
    </section>
  );
}
