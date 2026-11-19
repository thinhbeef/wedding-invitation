import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { displayCouple } from '../../data/weddingData';
import { invitationVariant } from '../../data/invitationVariant';
import { formatDotDate } from '../../utils/date';
import { BotanicalBranch } from '../common/Botanical';
import { WeddingMonogram } from './WeddingMonogram';
import '../../styles/invitation-opening.css';

interface Props {
  onStart: () => void;
  onComplete: () => void;
}

/** The same full-width print is cropped by each half of the folded cover. */
function CoverPrint() {
  return (
    <span className="gatefold-print">
      <span className="gatefold-frame" />
      <span className="gatefold-heading">Thiệp mời {invitationVariant.ceremony.toLocaleLowerCase('vi-VN')}</span>
      <BotanicalBranch className="gatefold-botanical gatefold-botanical--left" outline leaves={7} />
      <BotanicalBranch className="gatefold-botanical gatefold-botanical--right" outline leaves={7} />
      <span className="gatefold-names">
        <span>{displayCouple[0].name}</span>
        <i>&amp;</i>
        <span>{displayCouple[1].name}</span>
      </span>
      <span className="gatefold-date">{formatDotDate()}</span>
    </span>
  );
}

export function InvitationOpening({ onStart, onComplete }: Props) {
  const [opening, setOpening] = useState(false);
  const started = useRef(false);
  const rootRef = useRef<HTMLElement>(null);
  const animations = useRef<Animation[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      animations.current.forEach((animation) => animation.cancel());
    };
  }, []);

  const open = () => {
    const root = rootRef.current;
    if (started.current || !root) return;
    started.current = true;
    setOpening(true);
    onStart();

    // One compositor timeline; no mid-animation z-index changes or removal timer.
    const epoch = document.timeline.currentTime;
    const animate = (element: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      const animation = element.animate(frames, { fill: 'forwards', ...options });
      if (epoch !== null) animation.startTime = epoch;
      animations.current.push(animation);
      return animation;
    };

    if (!reduceMotion) {
      root.querySelectorAll('[data-opening-fade]').forEach((element) => {
        animate(element, [{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease-out' });
      });
      root.querySelectorAll<HTMLElement>('[data-opening-door]').forEach((element) => {
        const angle = element.dataset.openingDoor === 'left' ? -105 : 105;
        animate(element, [{ transform: 'rotateY(0deg)' }, { transform: `rotateY(${angle}deg)` }], {
          delay: 120,
          duration: 1550,
          easing: 'cubic-bezier(0.22, 0.65, 0.15, 1)',
        });
      });
    }

    const exit = animate(root, [{ opacity: 1 }, { opacity: 0 }], {
      delay: reduceMotion ? 0 : 1150,
      duration: reduceMotion ? 150 : 650,
      easing: 'ease-in-out',
    });
    // Cancellation during unmount is expected; finishing reveals the prepared page.
    void exit.finished.then(onComplete).catch(() => {});
  };

  return (
    <section
      ref={rootRef}
      className={`invitation-opening${opening ? ' is-opening' : ''}`}
      aria-label={`Thiệp mời ${invitationVariant.ceremony.toLocaleLowerCase('vi-VN')}`}
      aria-busy={opening}
    >
      <div className="opening-content">
        <header className="opening-intro" data-opening-fade>
          <p className="opening-eyebrow">Trân trọng kính mời</p>
          <h1 className="opening-dedication">Mừng ngày hạnh phúc</h1>
        </header>

        <button
          type="button"
          className="opening-trigger"
          onClick={open}
          aria-label={`Mở thiệp cưới ${displayCouple[0].name} và ${displayCouple[1].name}`}
          aria-describedby="opening-instruction"
          aria-disabled={opening}
        >
          <span className="gatefold-card" aria-hidden="true">
            <span className="gatefold-inside">
              <span className="inside-eyebrow">{invitationVariant.ceremony}</span>
              <WeddingMonogram className="inside-monogram" />
              <span className="inside-names">{displayCouple[0].name}<i>&amp;</i>{displayCouple[1].name}</span>
              <span className="inside-divider" />
              <span className="inside-date">{formatDotDate()}</span>
              <span className="inside-message">Hân hạnh đón tiếp quý khách!</span>
            </span>
            <span className="gatefold-door gatefold-door--left" data-opening-door="left"><CoverPrint /></span>
            <span className="gatefold-door gatefold-door--right" data-opening-door="right"><CoverPrint /></span>
            <span className="gatefold-monogram" data-opening-fade><WeddingMonogram /></span>
          </span>
          <span className="opening-action" data-opening-fade aria-hidden="true">
            <span>Mở thiệp mời</span><ArrowRight size={16} strokeWidth={1.2} />
          </span>
        </button>

        <p id="opening-instruction" className="opening-instruction" role="status" data-opening-fade>
          {opening ? 'Đang mở thiệp…' : 'Bấm vào thiệp để mở'}
        </p>
      </div>
    </section>
  );
}
