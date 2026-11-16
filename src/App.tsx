import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { musicSrc, type SectionId } from './data/weddingData';
import { useBackgroundMusic } from './hooks/useBackgroundMusic';
import { MusicPlayer } from './components/common/MusicPlayer';
import { BottomNav } from './components/navigation/BottomNav';
import { InvitationOpening } from './components/wedding/InvitationOpening';
import { HeroSection } from './sections/HeroSection';
import { InvitationSection } from './sections/InvitationSection';
import { StorySection } from './sections/StorySection';
import { CountdownSection } from './sections/CountdownSection';
import { ScheduleSection } from './sections/ScheduleSection';
import { DressCodeSection } from './sections/DressCodeSection';
import { GallerySection } from './sections/GallerySection';
import { RSVPSection } from './sections/RSVPSection';
import { ThankYouSection } from './sections/ThankYouSection';

export default function App() {
  const [active, setActive] = useState<SectionId>('home');
  const [opened, setOpened] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const music = useBackgroundMusic(musicSrc);

  const finishOpening = useCallback(() => setOpened(true), []);

  useEffect(() => {
    if (opened) mainRef.current?.focus({ preventScroll: true });
  }, [opened]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Tô sáng mục menu theo section đang nằm giữa màn hình
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive((visible.target as HTMLElement).dataset.nav as SectionId);
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    document.querySelectorAll('[data-nav]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleOpen = () => {
    scrollTo('invitation');
  };

  return (
    <MotionConfig reducedMotion="user">
      {!opened && (
        <InvitationOpening
          onStart={music.play}
          onComplete={finishOpening}
        />
      )}
      <div inert={!opened} aria-hidden={!opened}>
        <main ref={mainRef} tabIndex={-1} className="outline-none" aria-label="Nội dung thiệp cưới">
          <HeroSection onOpen={handleOpen} active={opened} />
          <InvitationSection />
          <StorySection />
          <CountdownSection />
          <ScheduleSection />
          <DressCodeSection />
          <GallerySection />
          <RSVPSection />
          <ThankYouSection />
        </main>
        <BottomNav
          active={active}
          onNavigate={scrollTo}
          musicControl={<MusicPlayer inline status={music.status} volume={music.volume} onToggle={music.toggle} onVolumeChange={music.setVolume} />}
        />
      </div>
    </MotionConfig>
  );
}
