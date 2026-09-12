import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { animate, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ProductImage } from '@/components/ui/ProductImage';
import { Spinner } from '@/components/ui/Spinner';
import { productsApi } from '@/services/apiClient';
import { mapApiProduct, type ApiProduct, type UiProduct } from '@/types/product';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const RADIUS_DESKTOP = 300;
const RADIUS_REDUCED = 160;
const CARD_W = 210;
const DRAG_THRESHOLD = 12;

export function FeaturedCarousel() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const reduced = useReducedMotion();
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayIndex, setDisplayIndex] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const pointerActive = useRef(false);
  const dragging = useRef(false);
  const startX = useRef(0);
  const lastX = useRef(0);
  const velocity = useRef(0);

  const rotation = useMotionValue(0);
  const smooth = useSpring(rotation, { stiffness: 110, damping: 24, mass: 0.85 });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await productsApi.list({ featured: true, limit: 8, sort: 'newest' });
        if (cancelled) return;
        let list = ((res.data || []) as ApiProduct[]).map(mapApiProduct);
        if (list.length < 3) {
          const fb = await productsApi.list({ limit: 8, sort: 'newest' });
          if (cancelled) return;
          list = ((fb.data || []) as ApiProduct[]).map(mapApiProduct);
        }
        setProducts(list.slice(0, 7));
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const count = products.length;
  const step = count > 0 ? 360 / count : 51.4;
  const radius = reduced ? RADIUS_REDUCED : RADIUS_DESKTOP;

  useEffect(() => {
    return smooth.on('change', (v) => {
      if (!count) return;
      setDisplayIndex(((Math.round(v) % count) + count) % count);
    });
  }, [smooth, count]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let lock = false;
    const onWheel = (e: WheelEvent) => {
      if (reduced || !count) return;
      e.preventDefault();
      if (lock) return;
      lock = true;
      const dir = Math.sign(e.deltaY || e.deltaX) || 1;
      const current = Math.round(rotation.get());
      animate(rotation, current + dir, { type: 'spring', stiffness: 140, damping: 22 });
      window.setTimeout(() => {
        lock = false;
      }, 260);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [count, reduced, rotation]);

  const snapTo = useCallback(
    (target: number) => {
      animate(rotation, target, { type: 'spring', stiffness: 130, damping: 22, mass: 0.9 });
    },
    [rotation]
  );

  const go = useCallback(
    (dir: number) => {
      if (!count) return;
      snapTo(Math.round(rotation.get()) + dir);
    },
    [count, rotation, snapTo]
  );

  const jumpToIndex = (i: number) => {
    if (!count) return;
    const base = Math.round(rotation.get());
    const current = ((base % count) + count) % count;
    let delta = i - current;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    snapTo(base + delta);
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('a, button')) return;
    pointerActive.current = true;
    dragging.current = false;
    startX.current = e.clientX;
    lastX.current = e.clientX;
    velocity.current = 0;
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointerActive.current || reduced || !count) return;
    const total = e.clientX - startX.current;
    if (!dragging.current && Math.abs(total) > DRAG_THRESHOLD) {
      dragging.current = true;
    }
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    const delta = dx * -0.016;
    velocity.current = delta;
    rotation.set(rotation.get() + delta);
  };

  const onPointerUp = () => {
    if (!pointerActive.current) return;
    const wasDragging = dragging.current;
    pointerActive.current = false;
    dragging.current = false;
    if (wasDragging) {
      snapTo(Math.round(rotation.get() + velocity.current * 10));
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </section>
    );
  }

  if (count === 0) return null;

  const current = products[displayIndex];
  const currentName = isAr ? current.nameAr : current.nameEn;
  const productHref = `/product/${current.slug || current.id}`;

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 42%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 65%)',
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
          <p className="text-sm font-medium tracking-widest text-accent uppercase">
            {t('home.featured.label', { defaultValue: 'Featured' })}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('home.featured.title', { defaultValue: "Editor's picks" })}
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {t('home.featured.subtitle', {
              defaultValue: 'Drag the reel — cards orbit in 3D.',
            })}
          </p>
        </div>

        <div
          ref={stageRef}
          className="relative mx-auto flex h-[min(460px,66vh)] max-w-5xl cursor-grab items-center justify-center active:cursor-grabbing select-none"
          style={{ perspective: reduced ? '900px' : '1400px' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="region"
          aria-roledescription="carousel"
          aria-label={t('home.featured.title', { defaultValue: "Editor's picks" })}
        >
          <div className="relative h-full w-full" style={{ transformStyle: 'preserve-3d' }}>
            {products.map((product, i) => (
              <ReelCard
                key={product.id}
                product={product}
                index={i}
                step={step}
                radius={radius}
                rotation={smooth}
                isAr={isAr}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-hover"
            aria-label={t('common.previous', { defaultValue: 'Previous' })}
          >
            <span aria-hidden className="rtl:rotate-180">
              ←
            </span>
          </button>
          <div className="flex items-center gap-1.5" role="tablist">
            {products.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={i === displayIndex}
                onClick={() => jumpToIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-normal ${
                  i === displayIndex ? 'w-6 bg-accent' : 'w-1.5 bg-border hover:bg-muted-foreground/40'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-hover"
            aria-label={t('common.next', { defaultValue: 'Next' })}
          >
            <span aria-hidden className="rtl:rotate-180">
              →
            </span>
          </button>
        </div>

        <div className="relative z-20 mt-5 flex flex-col items-center gap-1 text-center">
          <Link
            to={productHref}
            className="text-base font-semibold text-foreground underline-offset-4 transition-colors hover:text-accent hover:underline sm:text-lg"
          >
            {currentName}
          </Link>
          <Link to="/shop?featured=1" className="text-sm text-accent underline-offset-4 hover:underline">
            {t('home.featured.viewAll', { defaultValue: 'View all featured' })}
          </Link>
        </div>
      </div>
    </section>
  );
}

function ReelCard({
  product,
  index,
  step,
  radius,
  rotation,
  isAr,
}: {
  product: UiProduct;
  index: number;
  step: number;
  radius: number;
  rotation: ReturnType<typeof useSpring>;
  isAr: boolean;
}) {
  const { t } = useTranslation();
  const name = isAr ? product.nameAr : product.nameEn;
  const href = `/product/${product.slug || product.id}`;
  const price = product.salePrice ?? product.price;

  const transform = useTransform(rotation, (rot) => {
    const angle = (index - rot) * step;
    const rad = (angle * Math.PI) / 180;
    const x = Math.sin(rad) * radius;
    const z = Math.cos(rad) * radius - radius;
    const front = Math.cos(rad);
    const scale = 0.8 + Math.max(0, front) * 0.22;
    return `translateX(${x}px) translateZ(${z}px) rotateY(${-angle}deg) scale(${scale})`;
  });

  const opacity = useTransform(rotation, (rot) => {
    const angle = (index - rot) * step;
    const rad = (angle * Math.PI) / 180;
    const front = Math.cos(rad);
    return Math.max(0.2, (front + 1) / 2);
  });

  const zIndex = useTransform(rotation, (rot) => {
    const angle = (index - rot) * step;
    const rad = (angle * Math.PI) / 180;
    return Math.round(Math.cos(rad) * 100 + 100);
  });

  const isFront = useTransform(rotation, (rot) => {
    const angle = ((index - rot) * step + 540) % 360 - 180;
    return Math.abs(angle) < step * 0.55;
  });

  const [front, setFront] = useState(false);
  useEffect(() => isFront.on('change', setFront), [isFront]);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 will-change-transform"
      style={{
        width: CARD_W,
        marginLeft: -CARD_W / 2,
        marginTop: -CARD_W * 0.68,
        transform,
        opacity,
        zIndex,
        transformStyle: 'preserve-3d',
        pointerEvents: front ? 'auto' : 'none',
      }}
    >
      <Link
        to={href}
        draggable={false}
        className={`block w-full overflow-hidden rounded-2xl border border-border/70 bg-card text-start shadow-xl ${
          front ? 'ring-1 ring-accent/40' : ''
        }`}
        tabIndex={front ? 0 : -1}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="relative aspect-[3/4] bg-muted">
          <ProductImage
            src={product.images?.[0]}
            alt={name}
            className="h-full w-full"
            imgClassName="pointer-events-none h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3.5 pt-14">
            {product.isNew && (
              <span className="mb-1.5 inline-block rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">
                {t('shop.badges.new')}
              </span>
            )}
            <h3 className="font-display text-sm font-semibold text-white line-clamp-1 sm:text-base">
              {name}
            </h3>
            {front && (
              <p className="mt-0.5 text-xs text-white/85 sm:text-sm">
                ${price}
                {product.salePrice != null && (
                  <span className="ms-2 text-white/50 line-through">${product.price}</span>
                )}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
