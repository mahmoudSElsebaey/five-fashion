import { CSSProperties } from 'react';

const IMAGES = [
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596755094514-f87e34085b81?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1678366033925-b917160e101a?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1779675789410-85a43261a172?w=900&q=82&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1785199366362-5a0ea5e933a0?w=900&q=82&auto=format&fit=crop',
];

type StreamCardStyle = CSSProperties & { '--delay': string; '--index': number };

function Rail({ direction }: { direction: 'left' | 'right' }) {
  return (
    <div className={`five-image-stream__rail five-image-stream__rail--${direction}`} aria-hidden="true">
      {IMAGES.map((src, index) => {
        const style: StreamCardStyle = {
          '--delay': `${-index * 1.5}s`,
          '--index': index,
        };

        return (
          <div key={`${direction}-${src}`} className="five-image-stream__card" style={style}>
            <img src={src} alt="" loading={index < 4 ? 'eager' : 'lazy'} draggable={false} />
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
          z-index: -9;
          overflow: hidden;
          container-type: inline-size;
          perspective: 900px;
          pointer-events: none;
          opacity: .78;
        }

        .five-image-stream__wash {
          position: absolute;
          inset: 0;
          z-index: 4;
          background:
            radial-gradient(circle at 50% 50%, transparent 0%, color-mix(in srgb, var(--background) 8%, transparent) 28%, var(--background) 88%),
            linear-gradient(180deg, color-mix(in srgb, var(--background) 22%, transparent), color-mix(in srgb, var(--background) 72%, transparent));
        }

        .five-image-stream__rail {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
        }

        .five-image-stream__rail--left {
          animation: five-stream-drift-left 18s linear infinite;
        }

        .five-image-stream__rail--right {
          animation: five-stream-drift-right 18s linear infinite;
        }

        .five-image-stream__card {
          position: absolute;
          left: 50%;
          top: 52%;
          width: clamp(84px, 12cqw, 190px);
          aspect-ratio: 3 / 4;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
          border-radius: clamp(10px, 1.1cqw, 18px);
          background: var(--surface);
          box-shadow: 0 20px 60px color-mix(in srgb, #000 24%, transparent);
          transform-origin: center center;
          animation: five-stream-card 18s linear infinite;
          animation-delay: var(--delay);
          will-change: transform;
        }

        .five-image-stream__card img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          filter: saturate(.88) contrast(1.02);
        }

        .five-image-stream__rail--left .five-image-stream__card {
          --direction: -1;
        }

        .five-image-stream__rail--right .five-image-stream__card {
          --direction: 1;
        }

        @keyframes five-stream-card {
          0% {
            opacity: 0;
            transform: translate3d(-50%, -50%, -850px) translateX(calc(var(--direction) * -1cqw)) scale(.16) rotateY(calc(var(--direction) * -5deg));
          }
          16% {
            opacity: .38;
          }
          42% {
            opacity: .68;
            transform: translate3d(-50%, -50%, -260px) translateX(calc(var(--direction) * 7cqw)) scale(.48) rotateY(calc(var(--direction) * -12deg));
          }
          68% {
            opacity: .82;
            transform: translate3d(-50%, -50%, 30px) translateX(calc(var(--direction) * 25cqw)) scale(.92) rotateY(calc(var(--direction) * -20deg));
          }
          100% {
            opacity: 0;
            transform: translate3d(-50%, -50%, 420px) translateX(calc(var(--direction) * 62cqw)) scale(1.45) rotateY(calc(var(--direction) * -30deg));
          }
        }

        @keyframes five-stream-drift-left {
          from { transform: translateX(-2%); }
          to { transform: translateX(2%); }
        }

        @keyframes five-stream-drift-right {
          from { transform: translateX(2%); }
          to { transform: translateX(-2%); }
        }

        @media (max-width: 767px) {
          .five-image-stream {
            opacity: .42;
          }
          .five-image-stream__card {
            width: clamp(72px, 24cqw, 120px);
          }
          .five-image-stream__card:nth-child(n+7) {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .five-image-stream__rail,
          .five-image-stream__card {
            animation-play-state: paused;
          }
          .five-image-stream__card {
            opacity: .28;
            transform: translate3d(-50%, -50%, -260px) translateX(calc(var(--direction) * 10cqw)) scale(.5) rotateY(calc(var(--direction) * -10deg));
          }
        }
      `}</style>
    </div>
  );
}
