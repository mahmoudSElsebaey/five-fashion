import { CSSProperties } from 'react';

const IMAGES = [
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1785199366362-5a0ea5e933a0?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1678366033925-b917160e101a?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1779675789410-85a43261a172?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=82&auto=format&fit=crop',
];

type StreamCardStyle = CSSProperties & { '--delay': string; '--index': number };

function Rail({ direction }: { direction: 'left' | 'right' }) {
  return (
    <div className={`five-image-stream__rail five-image-stream__rail--${direction}`} aria-hidden="true">
      {IMAGES.map((src, index) => {
        const style: StreamCardStyle = {
          '--delay': `${-index * 3.2}s`,
          '--index': index,
        };

        return (
          <div key={`${direction}-${src}-${index}`} className="five-image-stream__card" style={style}>
            <img src={src} alt="" loading="eager" decoding="async" draggable={false} />
          </div>
        );
      })}
    </div>
  );
}

export function ImageStreamHero() {
  return (
    <div className="five-image-stream" aria-hidden="true">
      <div className="five-image-stream__wash" />
      <Rail direction="left" />
      <Rail direction="right" />
      <style>{`
        .five-image-stream {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
          container-type: inline-size;
          perspective: 1100px;
          pointer-events: none;
          opacity: .88;
          contain: layout paint;
        }

        .five-image-stream__wash {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          background:
            radial-gradient(circle at 50% 50%, transparent 0%, color-mix(in srgb, var(--background) 5%, transparent) 28%, color-mix(in srgb, var(--background) 72%, transparent) 88%),
            linear-gradient(180deg, color-mix(in srgb, var(--background) 18%, transparent), color-mix(in srgb, var(--background) 58%, transparent));
        }

        .five-image-stream__rail {
          position: absolute;
          inset: 0;
          z-index: 1;
          transform-style: preserve-3d;
        }

        .five-image-stream__card {
          position: absolute;
          left: 50%;
          top: 52%;
          width: clamp(84px, 12cqw, 190px);
          aspect-ratio: 3 / 4;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--accent) 36%, transparent);
          border-radius: clamp(10px, 1.1cqw, 18px);
          background: var(--surface);
          box-shadow: 0 20px 60px color-mix(in srgb, #000 34%, transparent);
          transform-origin: center center;
          animation: five-stream-card 48s cubic-bezier(0.37, 0, 0.63, 1) infinite;
          animation-delay: var(--delay);
          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        .five-image-stream__card img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          filter: saturate(.92) contrast(1.03);
          user-select: none;
        }

        .five-image-stream__rail--left .five-image-stream__card { --direction: -1; }
        .five-image-stream__rail--right .five-image-stream__card { --direction: 1; }

        @keyframes five-stream-card {
          0% {
            opacity: 0;
            transform: translate3d(-50%, -50%, -720px) translateX(calc(var(--direction) * -4cqw)) scale(.2) rotateY(calc(var(--direction) * -4deg));
          }
          14% { opacity: .38; }
          38% {
            opacity: .66;
            transform: translate3d(-50%, -50%, -360px) translateX(calc(var(--direction) * 5cqw)) scale(.42) rotateY(calc(var(--direction) * -8deg));
          }
          62% {
            opacity: .8;
            transform: translate3d(-50%, -50%, -20px) translateX(calc(var(--direction) * 24cqw)) scale(.82) rotateY(calc(var(--direction) * -14deg));
          }
          86% { opacity: .48; }
          100% {
            opacity: 0;
            transform: translate3d(-50%, -50%, 280px) translateX(calc(var(--direction) * 58cqw)) scale(1.18) rotateY(calc(var(--direction) * -20deg));
          }
        }

        @media (max-width: 767px) {
          .five-image-stream { opacity: .48; }
          .five-image-stream__card { width: clamp(72px, 24cqw, 120px); }
          .five-image-stream__card:nth-child(n+7) { display: none; }
          .five-image-stream__card { animation-duration: 42s; }
        }

        @media (prefers-reduced-motion: reduce) {
          .five-image-stream__card { animation: none !important; }
          .five-image-stream__card {
            opacity: .34;
            transform: translate3d(-50%, -50%, -260px) translateX(calc(var(--direction) * 10cqw)) scale(.5) rotateY(calc(var(--direction) * -10deg));
          }
        }
      `}</style>
    </div>
  );
}
