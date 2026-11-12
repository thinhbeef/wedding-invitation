import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryImage, ImageAspect } from '../../data/weddingData';
import { ImageWithFallback } from '../common/ImageWithFallback';

const RATIO: Record<ImageAspect, number> = { portrait: 4 / 5, landscape: 3 / 2, square: 1, tall: 2 / 3 };
const SWIPE_DISTANCE = 70;
const SWIPE_VELOCITY = 450;

interface Props {
  images: GalleryImage[];
  index: number | null;
  direction: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

/** Xem ảnh toàn màn hình: nút trước/sau, phím mũi tên, Esc để đóng, vuốt trên điện thoại. */
export function GalleryLightbox({ images, index, direction, onClose, onNext, onPrev }: Props) {
  const isOpen = index !== null && images[index] !== undefined;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onNext();
      else if (e.key === 'ArrowLeft') onPrev();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose, onNext, onPrev]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) onNext();
    else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) onPrev();
  };

  const image = isOpen ? images[index] : null;
  const ratio = image ? RATIO[image.aspectRatio] : 1;

  return createPortal(
    <AnimatePresence>
      {image && index !== null && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh"
          className="fixed inset-0 z-[70] flex flex-col bg-[#1f231c]/95 text-warm backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <header className="relative z-10 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),1rem)] pb-2 sm:px-8 sm:pt-6">
            <span className="font-serif text-lg tracking-[0.2em] tabular-nums">
              {String(index + 1).padStart(2, '0')}
              <span className="mx-2 text-warm/40">/</span>
              <span className="text-warm/60">{String(images.length).padStart(2, '0')}</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-warm/20 transition hover:bg-warm/10"
            >
              <X className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </header>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2 sm:px-20" onClick={onClose}>
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={image.id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 80, scale: direction === 0 ? 0.94 : 1 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: direction * -80 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
                onClick={(e) => e.stopPropagation()}
                className="relative cursor-grab touch-pan-y [--lb-w:94vw] active:cursor-grabbing sm:[--lb-w:calc(100vw-11rem)]"
                style={{
                  aspectRatio: String(ratio),
                  height: `min(74dvh, calc(var(--lb-w) / ${ratio}))`,
                }}
              >
                <ImageWithFallback
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full rounded-lg"
                  fit="contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                  }}
                  aria-label="Ảnh trước"
                  className="absolute left-2 hidden h-12 w-12 items-center justify-center rounded-full border border-warm/20 bg-black/20 transition hover:bg-warm/15 sm:left-6 sm:flex"
                >
                  <ChevronLeft className="h-6 w-6" strokeWidth={1.3} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  aria-label="Ảnh tiếp theo"
                  className="absolute right-2 hidden h-12 w-12 items-center justify-center rounded-full border border-warm/20 bg-black/20 transition hover:bg-warm/15 sm:right-6 sm:flex"
                >
                  <ChevronRight className="h-6 w-6" strokeWidth={1.3} />
                </button>
              </>
            )}
          </div>

          <footer className="flex items-center justify-between gap-4 px-4 pt-3 pb-[max(env(safe-area-inset-bottom),1.25rem)] sm:justify-center sm:px-8 sm:pb-8">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Ảnh trước"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-warm/20 sm:hidden"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.3} />
            </button>
            <motion.p
              key={image.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center font-serif text-lg italic"
            >
              {image.caption}
              <span className="mt-0.5 block font-sans text-[0.6rem] tracking-[0.25em] text-warm/50 uppercase not-italic sm:hidden">
                Vuốt để xem tiếp
              </span>
            </motion.p>
            <button
              type="button"
              onClick={onNext}
              aria-label="Ảnh tiếp theo"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-warm/20 sm:hidden"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.3} />
            </button>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
