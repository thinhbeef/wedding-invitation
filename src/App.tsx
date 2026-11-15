import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { musicSources, type SectionId } from './data/weddingData';
import { useBackgroundMusic } from './hooks/useBackgroundMusic';
import { MusicPlayer } from './components/common/MusicPlayer';
import { BottomNav } from './components/navigation/BottomNav';
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
  const music = useBackgroundMusic(musicSources);

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
    if (music.status !== 'playing') music.play();
    scrollTo('invitation');
  };

  return (
    <MotionConfig reducedMotion="user">
      <main>
        <HeroSection onOpen={handleOpen} />
        <InvitationSection />
        <StorySection />
        <CountdownSection />
        <ScheduleSection />
        <DressCodeSection />
        <GallerySection />
        <RSVPSection />
        <ThankYouSection />
        <div style={{ height: 'var(--nav-space)' }} className="bg-ivory" aria-hidden="true" />
      </main>
      <BottomNav active={active} onNavigate={scrollTo} />
      <MusicPlayer status={music.status} volume={music.volume} onToggle={music.toggle} onVolumeChange={music.setVolume} />
    </MotionConfig>
  );
}
