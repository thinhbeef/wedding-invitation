import { ChevronDown } from 'lucide-react';
import { hero, weddingInfo } from '../data/weddingData';
import { formatDotDate } from '../utils/date';
import { ArchBranch, FallingLeaves, Sprig } from '../components/common/Botanical';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

interface Props {
  onOpen: () => void;
  active?: boolean;
}

export function HeroSection({ onOpen, active = true }: Props) {
  return (
    <section id="home" data-nav="home" className="hero-section">
      {active && <FallingLeaves />}
      <div className="hero-layout">
        <figure className="hero-photo">
          <span className="hero-photo-border" aria-hidden="true" />
          <div className="hero-photo-crop">
            <ImageWithFallback
              src={hero.image}
              alt={`${weddingInfo.groom.name} và ${weddingInfo.bride.name}`}
              aspect="portrait"
              focus={hero.focus}
              priority
            />
          </div>
          <ArchBranch className="hero-branch hero-branch--left" />
          <ArchBranch flip className="hero-branch hero-branch--right" />
        </figure>
        <div className="hero-copy">
          <p className="hero-tagline">{hero.tagline}</p>
          <h1 className="hero-names">
            <span>{weddingInfo.groom.name}</span>
            <span className="hero-ampersand">&amp;</span>
            <span>{weddingInfo.bride.name}</span>
          </h1>
          <Sprig className="hero-sprig" />
          <p className="hero-date">{formatDotDate()}</p>
          <button type="button" onClick={onOpen} className="hero-link">
            Xem lời mời <ChevronDown size={15} strokeWidth={1.3} />
          </button>
        </div>
      </div>
    </section>
  );
}
