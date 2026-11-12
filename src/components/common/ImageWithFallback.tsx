import { useCallback, useState } from 'react';
import { ImageIcon } from 'lucide-react';
import type { ImageAspect } from '../../data/weddingData';
import { BotanicalBranch } from './Botanical';

export const aspectClass: Record<ImageAspect, string> = {
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[3/2]',
  square: 'aspect-square',
  tall: 'aspect-[2/3]',
};

const placeholderTones = ['#e8ebdd', '#ece8dc', '#e3e7d8', '#efebe1'];

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h;
}

interface Props {
  src: string;
  alt: string;
  thumbnail?: string;
  /** Nếu có, khung ảnh giữ đúng tỉ lệ (tránh nhảy bố cục). Nếu không, ảnh lấp đầy phần tử cha. */
  aspect?: ImageAspect;
  className?: string;
  imgClassName?: string;
  /** Ảnh quan trọng ở màn hình đầu: tải ngay thay vì lazy */
  priority?: boolean;
  /** Ẩn nhãn tên file trên ảnh giữ chỗ */
  hideLabel?: boolean;
  fit?: 'cover' | 'contain';
  /** object-position, ví dụ "50% 30%" */
  focus?: string;
}

/**
 * Ảnh cục bộ có lazy-load, hiệu ứng hiện dần và ảnh giữ chỗ thanh lịch
 * khi file chưa tồn tại trong public/images.
 */
export function ImageWithFallback({
  src,
  alt,
  thumbnail,
  aspect,
  className = '',
  imgClassName = '',
  priority = false,
  hideLabel = false,
  fit = 'cover',
  focus,
}: Props) {
  const sourceKey = `${src}|${thumbnail ?? ''}`;
  const [prevKey, setPrevKey] = useState(sourceKey);
  const [currentSrc, setCurrentSrc] = useState(thumbnail ?? src);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (sourceKey !== prevKey) {
    setPrevKey(sourceKey);
    setCurrentSrc(thumbnail ?? src);
    setLoaded(false);
    setFailed(false);
  }

  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  const handleError = () => {
    // Thumbnail lỗi → thử ảnh gốc trước khi hiển thị ảnh giữ chỗ
    if (currentSrc !== src) setCurrentSrc(src);
    else setFailed(true);
  };

  const tone = placeholderTones[hash(src) % placeholderTones.length];
  const fileName = src.split('/').pop();

  return (
    <div
      className={`relative overflow-hidden ${aspect ? aspectClass[aspect] : ''} ${className}`}
      style={{ backgroundColor: tone }}
    >
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-olive" role="img" aria-label={alt}>
          <BotanicalBranch className="absolute -right-4 -bottom-4 h-1/2 w-1/2 opacity-30" outline />
          <ImageIcon className="h-5 w-5 opacity-50" strokeWidth={1.2} />
          {!hideLabel && (
            <span className="px-4 text-center font-serif text-sm leading-tight italic opacity-80">
              Ảnh sẽ được cập nhật
              {import.meta.env.DEV && (
                <span className="mt-1 block font-sans text-[0.6rem] tracking-[0.2em] uppercase not-italic opacity-70">{fileName}</span>
              )}
            </span>
          )}
        </div>
      ) : (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          style={focus ? { objectPosition: focus } : undefined}
          className={`absolute inset-0 h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'} transition-[opacity,transform] duration-1000 ease-silk ${
            loaded ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0'
          } ${imgClassName}`}
        />
      )}
    </div>
  );
}
