import { useState } from 'react';

interface ProductGalleryProps {
  images?: string[];
  name: string;
}

export function ProductGallery({ images = [], name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = images.length > 0 ? images : [null];
  const active = slides[activeIndex] ?? null;

  return (
    <div className="space-y-4" aria-label={name}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
        {active ? (
          <img
            src={active}
            alt={`${name} ${activeIndex + 1}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface via-muted to-accent/10" />
        )}
        <div className="absolute bottom-4 start-4 rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
          {activeIndex + 1} / {slides.length}
        </div>
      </div>
      {slides.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {slides.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                activeIndex === i ? 'border-primary' : 'border-transparent'
              }`}
            >
              {src ? (
                <img src={src} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-surface via-muted to-accent/10" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
