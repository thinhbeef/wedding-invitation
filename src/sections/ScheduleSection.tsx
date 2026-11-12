import { motion } from 'framer-motion';
import { Clock, Gem, Sparkles, Wine } from 'lucide-react';
import { schedule, weddingInfo } from '../data/weddingData';
import { getMapsUrl } from '../utils/messaging';
import { Reveal, SectionTitle } from '../components/layout/Section';

const ICONS = { arrival: Clock, ceremony: Gem, reception: Wine, other: Sparkles } as const;

export function ScheduleSection() {
  return (
    <section data-nav="wedding" className="bg-ivory px-5 py-20 sm:py-28">
      <SectionTitle script="Wedding Day" title="Lịch trình ngày cưới" />

      <ol className="relative mx-auto mt-14 max-w-md">
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
                <p className="mt-1 text-sm text-forest/65">{item.description}</p>
              </div>
            </Reveal>
          );
        })}
      </ol>

      <Reveal className="mx-auto mt-14 max-w-md border-t border-olive/20 pt-8 text-center">
        <p className="eyebrow">Địa điểm</p>
        <p className="mt-2 font-serif text-2xl">{weddingInfo.venue}</p>
        <p className="mt-1 text-sm text-forest/65">{weddingInfo.address}</p>
        <a
          href={getMapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block bg-olive px-7 py-3 text-[0.7rem] font-medium tracking-[0.25em] text-warm uppercase transition hover:bg-forest"
        >
          Chỉ đường
        </a>
      </Reveal>
    </section>
  );
}
