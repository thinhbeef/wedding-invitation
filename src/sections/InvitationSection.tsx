import { motion } from 'framer-motion';
import { CalendarPlus, MapPin } from 'lucide-react';
import { invitation, weddingInfo, type Person } from '../data/weddingData';
import { downloadIcs } from '../utils/calendar';
import { getWeddingDateParts } from '../utils/date';
import { getMapsUrl } from '../utils/messaging';
import { BotanicalBranch } from '../components/common/Botanical';
import { EASE, Reveal, WriteIn } from '../components/layout/Section';

function Family({ label, person }: { label: string; person: Person }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      {person.father && <p className="mt-2 font-serif text-lg leading-snug">Ông {person.father}</p>}
      {person.mother && <p className="font-serif text-lg leading-snug">Bà {person.mother}</p>}
      {person.home && <p className="mt-1 text-xs text-forest/55">{person.home}</p>}
    </div>
  );
}

export function InvitationSection() {
  const { day, month, year, weekday } = getWeddingDateParts();
  const [hour, minute] = weddingInfo.time.split(':');

  return (
    <section id="invitation" data-nav="home" className="bg-ivory px-5 py-20 sm:py-28">
      <Reveal effect="scale" duration={1.2} className="relative mx-auto max-w-xl border border-olive/30 bg-warm p-2 sm:p-3">
        <div className="relative overflow-hidden border border-champagne/70 px-6 py-12 text-center sm:px-12 sm:py-16">
          <motion.div
            className="pointer-events-none absolute -top-10 -left-10 h-32 w-32"
            initial={{ opacity: 0, rotate: 0 }}
            whileInView={{ opacity: 0.5, rotate: 45 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: 0.4, ease: EASE }}
          >
            <BotanicalBranch className="h-full w-full" outline />
          </motion.div>
          <motion.div
            className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32"
            initial={{ opacity: 0, rotate: 180 }}
            whileInView={{ opacity: 0.5, rotate: 225 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: 0.6, ease: EASE }}
          >
            <BotanicalBranch className="h-full w-full" outline />
          </motion.div>

          <Reveal delay={0.3} className="grid grid-cols-2 gap-4 text-center">
            <Family label="Nhà trai" person={weddingInfo.groom} />
            <Family label="Nhà gái" person={weddingInfo.bride} />
          </Reveal>

          <WriteIn delay={0.4} className="mt-10 font-script text-[1.8rem] leading-tight text-olive sm:text-3xl">
            {invitation.greeting}
          </WriteIn>
          <Reveal delay={0.5}>
            <p className="mx-auto mt-3 whitespace-nowrap text-[0.58rem] text-forest/70 sm:text-sm">{invitation.lead}</p>
          </Reveal>

          <Reveal effect="blur" delay={0.3} duration={1.4}>
            <h2 className="mt-7 font-serif text-[2.4rem] leading-tight font-normal sm:text-5xl">
              {weddingInfo.groom.name}
              <span className="block py-1 font-serif text-2xl text-champagne italic">&amp;</span>
              {weddingInfo.bride.name}
            </h2>
          </Reveal>

          <Reveal effect="scale" delay={0.2} className="mx-auto mt-10 grid max-w-sm grid-cols-[1fr_auto_1fr] items-center">
            <p className="border-y border-olive/30 py-2 text-[0.62rem] font-medium tracking-[0.12em] whitespace-nowrap uppercase sm:text-[0.7rem] sm:tracking-[0.2em]">
              {hour} giờ {minute}
            </p>
            <div className="px-3 sm:px-5">
              <p className="text-[0.65rem] tracking-[0.25em] text-olive uppercase">Tháng {month}</p>
              <p className="font-serif text-6xl sm:text-7xl leading-none font-bold text-olive">{day}</p>
              <p className="text-[0.7rem] tracking-[0.25em] text-olive">{year}</p>
            </div>
            <p className="border-y border-olive/30 py-2 text-[0.62rem] font-medium tracking-[0.12em] whitespace-nowrap uppercase sm:text-[0.7rem] sm:tracking-[0.2em]">{weekday}</p>
          </Reveal>

          <Reveal delay={0.2} className="mt-10">
            <p className="eyebrow">Địa điểm</p>
            <p className="mt-2 font-serif text-2xl">{weddingInfo.venue}</p>
            <p className="mt-1 text-sm text-forest/65">{weddingInfo.address}</p>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="mx-auto mt-8 max-w-sm font-serif text-lg leading-relaxed text-forest/80 italic">{invitation.message}</p>
          </Reveal>

          <Reveal delay={0.4} className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-[0.7rem] font-medium tracking-[0.2em] text-olive uppercase">
            <a href={getMapsUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-b border-olive/40 pb-1 hover:text-forest">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} /> Xem bản đồ
            </a>
            <button type="button" onClick={downloadIcs} className="inline-flex items-center gap-2 border-b border-olive/40 pb-1 uppercase hover:text-forest">
              <CalendarPlus className="h-3.5 w-3.5" strokeWidth={1.5} /> Thêm vào lịch
            </button>
          </Reveal>
        </div>
      </Reveal>
    </section>
  );
}
