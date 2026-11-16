import { motion } from 'framer-motion';
import { Clock, Gem, Sparkles, Wine } from 'lucide-react';
import { schedule } from '../data/weddingData';
import { Reveal, SectionTitle } from '../components/layout/Section';

const ICONS = { arrival: Clock, ceremony: Gem, reception: Wine, other: Sparkles } as const;

export function ScheduleSection() {
  return (
    <section data-nav="wedding" className="section-space bg-ivory">
      <SectionTitle script="Wedding Day" title="Lịch trình ngày cưới" />

      <ol className="relative mx-auto mt-10 max-w-md">
        <motion.span
          className="absolute top-2 bottom-2 left-[1.15rem] w-px origin-top bg-olive/30"
          aria-hidden="true"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
        />
        {schedule.map((item, i) => {
          const Icon = ICONS[item.icon];
          return (
            <Reveal key={item.id} effect="up" delay={0.2 + i * 0.25} className="relative flex gap-6 pb-10 last:pb-0">
              <motion.span
                className="relative z-10 flex h-[2.3rem] w-[2.3rem] shrink-0 items-center justify-center rounded-full border border-olive/40 bg-ivory text-olive"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.3 + i * 0.25 }}
              >
                <Icon className="h-4 w-4" strokeWidth={1.3} />
              </motion.span>
              <div className="pt-0.5">
                <p className="font-serif text-2xl leading-none font-light text-olive tabular-nums">{item.time}</p>
                <p className="mt-2 font-serif text-xl">{item.title}</p>
                <p className="mt-1 text-sm text-forest/75">{item.description}</p>
              </div>
            </Reveal>
          );
        })}
      </ol>

    </section>
  );
}
