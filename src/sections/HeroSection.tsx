import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { hero, weddingInfo } from '../data/weddingData';
import { ArchBranch, FallingLeaves, Sprig } from '../components/common/Botanical';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

const EASE = [0.22, 1, 0.36, 1] as const;
const ARCH = 'rounded-[50%_50%_0_0/40%_40%_0_0]';

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
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_32%,#fdfbf4_0%,var(--color-ivory)_60%)] px-5 pt-[max(env(safe-area-inset-top),2rem)] pb-6 lg:grid lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-10"
    >
      <FallingLeaves />

      <motion.figure
        className="relative mx-auto w-full max-w-[min(400px,52vw,36svh)] sm:max-w-[min(400px,52vw,38svh)] lg:order-2 lg:mr-0 lg:max-w-[min(400px,70vw,46svh)] lg:mr-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: EASE }}
      >
        <motion.span
          aria-hidden="true"
          className={`pointer-events-none absolute -top-3 -right-3 -left-3 bottom-0 border border-b-0 border-sage ${ARCH}`}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.1, ease: EASE }}
        />
        <motion.div
          className={`overflow-hidden ${ARCH}`}
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

        <ArchBranch className="absolute right-[94%] bottom-[-7%] z-10 w-[32%] md:right-[93%] md:w-[56%]" delay={1.2} />
        <ArchBranch flip className="absolute bottom-[-7%] left-[94%] z-10 w-[32%] md:left-[93%] md:w-[56%]" delay={1.4} />
      </motion.figure>

      <div className="relative mt-3 text-center lg:order-1 lg:mt-0">
        <motion.p {...fade(0.9)} className="eyebrow">
          {hero.tagline}
        </motion.p>
        <h1 className="mt-2 font-serif text-[3.2rem] leading-[1.05] font-light text-forest sm:text-6xl xl:text-7xl">
          <motion.span {...fade(1.1, { x: -30 })} className="block">
            {weddingInfo.groom.name}
          </motion.span>
          <motion.span {...fade(1.3, { scale: 0.6 })} className="block font-serif text-[0.8em] font-light text-olive italic">
            &amp;
          </motion.span>
          <motion.span {...fade(1.5, { x: 30 })} className="block">
            {weddingInfo.bride.name}
          </motion.span>
        </h1>
        <Sprig className="mx-auto mt-3 h-5 w-24" animated delay={2.1} />
        <motion.button
          {...fade(2.3)}
          type="button"
          onClick={onOpen}
          className="group relative mt-3 inline-flex items-center gap-2 overflow-hidden border border-olive/50 px-8 py-3 text-[0.7rem] font-medium tracking-[0.3em] text-olive uppercase transition-colors duration-500 hover:text-warm"
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
