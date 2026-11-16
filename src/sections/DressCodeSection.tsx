import { dressCode, type ColorSwatch } from '../data/weddingData';
import { Reveal, SectionTitle } from '../components/layout/Section';

function Swatches({ label, colors, crossed = false }: { label: string; colors: ColorSwatch[]; crossed?: boolean }) {
  if (colors.length === 0) return null;
  return (
    <div className="mt-8">
      <p className="eyebrow">{label}</p>
      <ul className="mt-4 flex flex-wrap justify-center gap-5">
        {colors.map((c) => (
          <li key={c.name + c.hex} className="flex w-16 flex-col items-center gap-2">
            <span className="relative h-10 w-10 rounded-full border border-forest/10" style={{ backgroundColor: c.hex }}>
              {crossed && <span className="absolute top-1/2 left-1/2 h-px w-12 -translate-x-1/2 -rotate-45 bg-forest/50" />}
            </span>
            <span className="text-center text-xs text-forest/65">{c.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Chỉ hiển thị khi dressCode.enabled = true trong weddingData.ts */
export function DressCodeSection() {
  if (!dressCode.enabled) return null;
  return (
    <section data-nav="wedding" className="bg-warm px-5 py-20 sm:py-24">
      <SectionTitle script="Dress Code" title={dressCode.name} subtitle={dressCode.note} />
      <Reveal className="mx-auto max-w-md text-center">
        <Swatches label="Màu gợi ý" colors={dressCode.recommended} />
        <Swatches label="Nên hạn chế" colors={dressCode.avoid} crossed />
      </Reveal>
    </section>
  );
}
