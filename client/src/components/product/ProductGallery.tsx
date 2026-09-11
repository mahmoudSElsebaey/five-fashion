import { useMemo, useState } from 'react';

interface ProductGalleryProps {
  images?: string[] | null;
  name: string;
}

function normalizeImages(images?: string[] | null): string[] {
  if (!images || !Array.isArray(images)) return [];
  return images
    .map((src) => (typeof src === 'string' ? src.trim() : ''))
    .filter((src) => src.length > 0 && !src.includes('placeholder'));
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const slides = useMemo(() => normalizeImages(images), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = slides.length ? Math.min(activeIndex, slides.length - 1) : 0;
  const active = slides[safeIndex] ?? null;

  return (
    <div className="space-y-4" aria-label={name}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
        {active ? (
          <img
            src={active}
            alt={`${name} ${safeIndex + 1}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface via-muted to-accent/10" />
        )}
        {slides.length > 0 && (
          <div className="absolute bottom-4 start-4 rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            {safeIndex + 1} / {slides.length}
          </div>
        )}
      </div>
      {slides.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible">
          {slides.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`aspect-square w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:w-auto ${
                safeIndex === i ? 'border-primary' : 'border-transparent'
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
