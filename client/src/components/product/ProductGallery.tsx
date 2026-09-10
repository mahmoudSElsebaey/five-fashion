import { useState } from 'react';

interface ProductGalleryProps {
  productId: string;
  name: string;
}

export function ProductGallery({ productId: _productId, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Placeholder slides – later replace with real images
  const slides = [0, 1, 2, 3];

  return (
    <div className="space-y-4" aria-label={name}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
        <div
          className="absolute inset-0 bg-gradient-to-br from-surface via-muted to-accent/10 transition-opacity duration-500"
          style={{ opacity: 1 }}
        />
        <div className="absolute bottom-4 start-4 rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
          {activeIndex + 1} / {slides.length}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {slides.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setActiveIndex(s)}
            className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
              activeIndex === s ? 'border-primary' : 'border-transparent'
            }`}
          >
            <div className="h-full w-full bg-gradient-to-br from-surface via-muted to-accent/10" />
          </button>
        ))}
      </div>
    </div>
  );
}
