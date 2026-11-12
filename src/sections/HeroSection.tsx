import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { hero, weddingInfo } from '../data/weddingData';
import { formatDotDate } from '../utils/date';
import { FallingLeaves, Sprig } from '../components/common/Botanical';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

const EASE = [0.22, 1, 0.36, 1] as const;

interface Props {
  onOpen: () => void;
}

export function HeroSection({ onOpen }: Props) {
  const { scrollY } = useScroll();
  const parallax = useTransform(scrollY, [0, 900], [0, 28]);

  const fade = (delay: number, from: Record<string, number | string> = { y: 16 }) => ({
    initial: { opacity: 0, filter: 'blur(8px)', ...from },
    animate: { opacity: 1, filter: 'blur(0px)', x: 0, y: 0, scale: 1 },
    transition: { duration: 1.2, delay, ease: EASE },
  });

  return (
    <section
      id="home"
      data-nav="home"
      className="relative overflow-hidden bg-ivory px-5 pt-[max(env(safe-area-inset-top),1.5rem)] pb-6 lg:grid lg:min-h-[100svh] lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-16 lg:py-10"
    >
      <FallingLeaves />

      {/* Ảnh bìa: khung viền hiện trước, ảnh hé lộ như kéo rèm rồi zoom chậm */}
      <motion.figure
        className="relative mx-auto w-full border border-olive/25 p-1.5 sm:p-2 lg:order-2 lg:mr-0"
        style={{ maxWidth: 'min(560px, calc(88svh * 2 / 3))' }}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: EASE }}
      >
        <motion.div
          className="overflow-hidden"
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0% 0 0 0)' }}
          transition={{ duration: 1.6, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ scale: 1.25 }}
            animate={{ scale: 1.12 }}
            transition={{ duration: 3.5, delay: 0.2, ease: EASE }}
            style={{ y: parallax }}
          >
            <ImageWithFallback
              src={hero.image}
              alt={`${weddingInfo.groom.name} và ${weddingInfo.bride.name}`}
              aspect="tall"
              focus={hero.focus}
              priority
            />
          </motion.div>
        </motion.div>
      </motion.figure>

      <div className="relative mt-10 text-center lg:order-1 lg:mt-0">
        <motion.p {...fade(1)} className="eyebrow">
          {hero.tagline}
        </motion.p>
        <h1 className="mt-4 font-serif text-[2.6rem] leading-[1.1] font-light text-forest sm:text-6xl xl:text-7xl">
          <motion.span {...fade(1.2, { x: -30 })} className="block">
            {weddingInfo.groom.name}
          </motion.span>
          <motion.span {...fade(1.5, { scale: 0.6 })} className="block py-1 font-script text-[0.7em] text-olive">
            &amp;
          </motion.span>
          <motion.span {...fade(1.7, { x: 30 })} className="block">
            {weddingInfo.bride.name}
          </motion.span>
        </h1>
        <Sprig className="mx-auto mt-6 h-5 w-24" animated delay={2} />
        <motion.p {...fade(2.3)} className="mt-4 font-serif text-xl tracking-[0.35em] text-forest/80">
          {formatDotDate().replace(/ · /g, '.')}
        </motion.p>
        <motion.button
          {...fade(2.6)}
          type="button"
          onClick={onOpen}
          className="group relative mt-8 inline-flex items-center gap-2 overflow-hidden border border-olive/50 px-8 py-3 text-[0.7rem] font-medium tracking-[0.3em] text-olive uppercase transition-colors duration-500 hover:text-warm"
        >
          <span className="absolute inset-0 origin-bottom scale-y-0 bg-olive transition-transform duration-500 ease-silk group-hover:scale-y-100" />
          <span className="relative">Mở thiệp</span>
          <motion.span
            className="relative"
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
          </motion.span>
        </motion.button>
      </div>
    </section>
  );
}
