import { useState } from 'react';

interface ProductGalleryProps {
  productId: string;
  name: string;
}

export function ProductGallery({ productId, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = [0, 1, 2, 3];

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
        <div
          className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 ${
            activeIndex % 2 === 0
              ? 'from-surface via-muted to-accent/15'
              : 'from-muted via-surface to-primary/10'
          }`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-6xl font-semibold text-foreground/5 select-none">FIVE</span>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {slides.map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg transition-all ${
              activeIndex === i
                ? 'ring-2 ring-accent ring-offset-2 ring-offset-background'
                : 'opacity-70 hover:opacity-100'
            }`}
            aria-label={`View image ${i + 1}`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${
                i % 2 === 0
                  ? 'from-surface via-muted to-accent/20'
                  : 'from-muted via-surface to-primary/15'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
