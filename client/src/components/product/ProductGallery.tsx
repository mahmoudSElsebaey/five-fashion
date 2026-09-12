import { useMemo, useState } from 'react';
import { ProductImage } from '@/components/ui/ProductImage';

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
    <div className="space-y-3 sm:space-y-4" aria-label={name}>
      <div className="relative">
        <ProductImage
          src={active}
          alt={`${name} ${safeIndex + 1}`}
          className="aspect-[3/4] rounded-xl sm:rounded-2xl"
          loading="eager"
        />
        {slides.length > 0 && (
          <div className="absolute bottom-3 start-3 z-10 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm sm:bottom-4 sm:start-4 sm:px-3 sm:text-xs">
            {safeIndex + 1} / {slides.length}
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-3 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden"
          role="listbox"
          aria-label="Product images"
        >
          {slides.map((src, i) => {
            const selected = safeIndex === i;
            return (
              <button
                key={`${src}-${i}`}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => setActiveIndex(i)}
                className={`aspect-square shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50
                  w-[4.25rem] sm:w-[5rem] md:w-full
                  ${selected
                    ? 'border-accent shadow-md shadow-accent/15 ring-1 ring-accent/30'
                    : 'border-border/60 hover:border-accent/50'
                  }`}
              >
                <ProductImage
                  src={src}
                  alt=""
                  className="h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
