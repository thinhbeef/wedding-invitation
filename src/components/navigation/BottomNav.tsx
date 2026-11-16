import type { ReactNode } from 'react';
import { navItems, type SectionId } from '../../data/weddingData';

interface Props {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
  musicControl?: ReactNode;
}

/** Thanh điều hướng nhỏ gọn cố định cuối màn hình. */
export function BottomNav({ active, onNavigate, musicControl }: Props) {
  return (
    <nav
      aria-label="Điều hướng"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-2 pb-[max(env(safe-area-inset-bottom),0.6rem)] sm:pb-5"
    >
      <div className="pointer-events-auto flex w-full max-w-[520px] items-center rounded-xl border border-olive/20 bg-ivory/95 px-1 py-1 shadow-[0_10px_30px_-18px_rgb(52_59_48/0.5)] backdrop-blur-md">
      <ul className="flex min-w-0 flex-1 justify-between">
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
                <span className={`text-[0.58rem] uppercase sm:text-[0.66rem] ${isActive ? 'font-medium' : ''}`}>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {musicControl && <div className="shrink-0 border-l border-olive/20 pl-1">{musicControl}</div>}
      </div>
    </nav>
  );
}
