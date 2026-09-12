import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProductImage } from '@/components/ui/ProductImage';
import { CardBody, CardContainer, CardItem } from '@/components/ui/ThreeDCard';

export type CollectionCardData = {
  id: string;
  title: string;
  slug: string;
  image?: string;
  featured?: boolean;
};

/** 3D destination-style collection card (21st / Aceternity inspired), FIVE brand. */
export function Collection3DCard({
  item,
  aspectClassName = 'aspect-[3/4]',
}: {
  item: CollectionCardData;
  aspectClassName?: string;
}) {
  const { t } = useTranslation();
  const href = `/shop?collection=${item.slug}`;

  return (
    <CardContainer containerClassName="w-full" className="w-full">
      <CardBody className="w-full">
        <Link
          to={href}
          className="block w-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <div
            className={`group relative w-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-md ${aspectClassName}`}
          >
            <div
              className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--accent) 35%, transparent), transparent 55%)',
              }}
            />

            <CardItem translateZ={20} className="absolute inset-0">
              <ProductImage
                src={item.image}
                alt={item.title}
                className="h-full w-full"
                imgClassName="h-full w-full object-cover transition-transform duration-700 ease-five group-hover:scale-[1.04]"
              />
            </CardItem>

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

            <CardItem translateZ={50} className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
                {item.featured
                  ? t('home.collections.featured', { defaultValue: 'Featured' })
                  : t('nav.collections')}
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
                {item.title}
              </h3>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent">
                {t('home.collections.explore', { defaultValue: 'Explore' })}
                <span
                  aria-hidden
                  className="transition-transform duration-normal group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                >
                  →
                </span>
              </span>
            </CardItem>
          </div>
        </Link>
      </CardBody>
    </CardContainer>
  );
}
