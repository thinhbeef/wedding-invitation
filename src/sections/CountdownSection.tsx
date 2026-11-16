import { motion } from 'framer-motion';
import { useCountdown } from '../hooks/useCountdown';
import { getWeddingTimestamp } from '../utils/date';
import { EASE, Reveal, SectionTitle } from '../components/layout/Section';
import { WeddingCalendar } from '../components/wedding/WeddingCalendar';

const target = getWeddingTimestamp();

export function CountdownSection() {
  const { days, hours, minutes, seconds, isPast } = useCountdown(target);
  const units = [
    { value: days, label: 'Ngày' },
    { value: hours, label: 'Giờ' },
    { value: minutes, label: 'Phút' },
    { value: seconds, label: 'Giây' },
  ];

  return (
    <section id="wedding" data-nav="wedding" className="section-space bg-mist">
      <SectionTitle script="Save the date" title="Đếm ngược ngày chung đôi" />
      <Reveal className="mx-auto mt-8 max-w-xl">
        {isPast ? (
          <p className="text-center font-serif text-2xl text-forest/80 italic">Cảm ơn bạn đã cùng chúng mình đi qua ngày hạnh phúc nhất.</p>
        ) : (
          <div className="grid grid-cols-4 divide-x divide-olive/25" role="timer">
            {units.map((unit, i) => (
              <Reveal key={unit.label} effect="up" delay={i * 0.12} className="text-center">
                <p className="h-[2.6rem] overflow-hidden font-serif text-[2.6rem] leading-none font-light tabular-nums sm:h-[4.5rem] sm:text-7xl">
                  {/* Số mới trượt xuống mỗi khi đổi */}
                  <motion.span
                    key={unit.value}
                    className="block"
                    initial={{ y: '-100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    {String(unit.value).padStart(2, '0')}
                  </motion.span>
                </p>
                <p className="mt-2 text-[0.62rem] tracking-[0.3em] text-olive uppercase">{unit.label}</p>
              </Reveal>
            ))}
          </div>
        )}
      </Reveal>

      {/* Lịch tháng tô đậm ngày cưới */}
      <Reveal effect="scale" delay={0.25}>
        <WeddingCalendar />
      </Reveal>
    </section>
  );
}
