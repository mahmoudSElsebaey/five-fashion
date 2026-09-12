import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { ProductImage } from '@/components/ui/ProductImage';
import { Spinner } from '@/components/ui/Spinner';
import { productsApi } from '@/services/apiClient';
import { mapApiProduct, type ApiProduct, type UiProduct } from '@/types/product';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Relative index → fan layout (stacked card carousel / 21st carousel-07). */
function fanStyle(offset: number, reduced: boolean) {
  if (reduced) {
    return {
      x: offset * 28,
      y: Math.abs(offset) * 6,
      rotate: offset * 4,
      scale: offset === 0 ? 1 : 0.9,
      zIndex: 20 - Math.abs(offset),
      opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.18,
    };
  }
  return {
    x: offset * 72,
    y: Math.abs(offset) * 14 + (offset === 0 ? 0 : 8),
    rotate: offset * 11,
    scale: offset === 0 ? 1 : Math.max(0.78, 1 - Math.abs(offset) * 0.08),
    zIndex: 40 - Math.abs(offset),
    opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.12,
  };
}

export function FeaturedCarousel() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const reduced = useReducedMotion();
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

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

  const go = useCallback(
    (dir: number) => {
      if (count === 0) return;
      setActive((i) => (i + dir + count) % count);
    },
    [count]
  );

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold) go(isAr ? -1 : 1);
    else if (info.offset.x > threshold) go(isAr ? 1 : -1);
  };

  const visible = useMemo(() => {
    if (!count) return [];
    const out: { product: UiProduct; offset: number; index: number }[] = [];
    for (let o = -2; o <= 2; o += 1) {
      const index = (active + o + count * 10) % count;
      out.push({ product: products[index], offset: o, index });
    }
    return out;
  }, [active, count, products]);

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

  const current = products[active];
  const currentName = isAr ? current.nameAr : current.nameEn;

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 40%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 65%)',
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
              defaultValue: 'Swipe or use the arrows to explore standout pieces.',
            })}
          </p>
        </div>

        <div className="relative mx-auto flex h-[min(520px,70vh)] max-w-4xl items-center justify-center">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map(({ product, offset, index }) => {
              const name = isAr ? product.nameAr : product.nameEn;
              const style = fanStyle(offset, reduced);
              const isCenter = offset === 0;
              const href = `/product/${product.slug || product.id}`;
              const price = product.salePrice ?? product.price;

              return (
                <motion.div
                  key={`${product.id}-${index}-${offset}`}
                  className="absolute"
                  style={{ zIndex: style.zIndex }}
                  initial={false}
                  animate={{
                    x: style.x,
                    y: style.y,
                    rotate: style.rotate,
                    scale: style.scale,
                    opacity: style.opacity,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 28,
                    mass: 0.85,
                  }}
                  drag={isCenter && !reduced ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={isCenter ? onDragEnd : undefined}
                  onClick={() => {
                    if (!isCenter) setActive(index);
                  }}
                >
                  <Link
                    to={href}
                    className={`block w-[min(240px,68vw)] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-lg sm:w-[260px] ${
                      isCenter ? 'ring-1 ring-accent/30' : 'cursor-pointer'
                    }`}
                    onClick={(e) => {
                      if (!isCenter) e.preventDefault();
                    }}
                    tabIndex={isCenter ? 0 : -1}
                    aria-hidden={!isCenter}
                  >
                    <div className="relative aspect-[3/4] bg-muted">
                      <ProductImage
                        src={product.images?.[0]}
                        alt={name}
                        className="h-full w-full"
                        imgClassName="h-full w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-4 pt-16">
                        {product.isNew && (
                          <span className="mb-2 inline-block rounded-full bg-background/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">
                            {t('shop.badges.new')}
                          </span>
                        )}
                        <h3 className="font-display text-base font-semibold text-white line-clamp-1 sm:text-lg">
                          {name}
                        </h3>
                        {isCenter && (
                          <p className="mt-1 text-sm text-white/85">
                            ${price}
                            {product.salePrice != null && (
                              <span className="ms-2 text-white/55 line-through">${product.price}</span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(isAr ? 1 : -1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-hover"
            aria-label={t('common.previous', { defaultValue: 'Previous' })}
          >
            <span aria-hidden className="rtl:rotate-180">←</span>
          </button>
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Featured slides">
            {products.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-normal ${
                  i === active ? 'w-6 bg-accent' : 'w-1.5 bg-border hover:bg-muted-foreground/40'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(isAr ? -1 : 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-hover"
            aria-label={t('common.next', { defaultValue: 'Next' })}
          >
            <span aria-hidden className="rtl:rotate-180">→</span>
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{currentName}</span>
          {' · '}
          <Link to="/shop?featured=1" className="text-accent underline-offset-4 hover:underline">
            {t('home.featured.viewAll', { defaultValue: 'View all featured' })}
          </Link>
        </p>
      </div>
    </section>
  );
}
