import { navItems, type SectionId } from '../../data/weddingData';

interface Props {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
}

/** Thanh điều hướng nhỏ gọn cố định cuối màn hình. */
export function BottomNav({ active, onNavigate }: Props) {
  return (
    <nav
      aria-label="Điều hướng"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(env(safe-area-inset-bottom),0.6rem)] sm:pb-5"
    >
      <ul className="pointer-events-auto flex w-full max-w-[440px] justify-between rounded-xl border border-olive/20 bg-ivory/85 px-1.5 py-1 shadow-[0_10px_30px_-18px_rgb(52_59_48/0.5)] backdrop-blur-md">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={isActive ? 'true' : undefined}
                className={`flex h-12 w-full flex-col items-center justify-center gap-0.5 transition-colors ${
                  isActive ? 'text-olive-deep' : 'text-forest/60 hover:text-forest/80'
                }`}
              >
                <Icon className="h-[1.1rem] w-[1.1rem]" strokeWidth={isActive ? 1.8 : 1.4} />
                <span className={`text-[0.66rem] tracking-[0.04em] uppercase ${isActive ? 'font-medium' : ''}`}>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
