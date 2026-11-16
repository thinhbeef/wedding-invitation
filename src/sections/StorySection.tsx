import { motion, useReducedMotion } from 'framer-motion';
import { story } from '../data/weddingData';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { Reveal, SectionTitle } from '../components/layout/Section';

const TILTS = [-5, 3, -2];

export function StorySection() {
  const reducedMotion = useReducedMotion();
  return (
    <section id="story" data-nav="story" className="section-space story-section bg-warm">
      <SectionTitle script="Our Story" title="Chuyện của chúng mình" />
      <div className="story-polaroids">
        {story.photos.map((photo, i) => (
          <motion.figure
            key={photo.src}
            className="story-polaroid"
            style={{ rotate: TILTS[i % TILTS.length], zIndex: i === 1 ? 2 : 1 }}
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={reducedMotion ? undefined : { rotate: 0, scale: 1.03, zIndex: 3 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: reducedMotion ? 0 : i * 0.1 }}
          >
            <ImageWithFallback src={photo.src} alt={photo.alt} aspect="portrait" focus={photo.focus} />
            {photo.caption && <figcaption>{photo.caption}</figcaption>}
          </motion.figure>
        ))}
      </div>
      <Reveal className="story-copy"><p className="story-text">{story.intro}</p></Reveal>
    </section>
  );
}
