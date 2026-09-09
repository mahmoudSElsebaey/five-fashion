import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';

const collections = [
  { id: '1', key: 'essentials' },
  { id: '2', key: 'evening' },
  { id: '3', key: 'street' },
  { id: '4', key: 'atelier' },
];

export function FeaturedCollections() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium tracking-widest text-accent uppercase">
            {t('home.collections.label')}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('home.collections.title')}
          </h2>
        </div>
        <Link
          to="/collections"
          className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
        >
          {t('home.collections.viewAll')} →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {collections.map((item, index) => (
          <Link key={item.id} to={`/collections/${item.id}`}>
            <Card
              hoverable
              className="group relative aspect-[3/4] overflow-hidden border-0 bg-muted"
            >
              <div
                className={`absolute inset-0 transition-transform duration-700 ease-five group-hover:scale-105 ${
                  index % 2 === 0
                    ? 'bg-gradient-to-br from-muted via-surface to-accent/20'
                    : 'bg-gradient-to-tl from-surface via-muted to-primary/10'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 start-0 end-0 p-5">
                <h3 className="font-display text-lg font-medium text-foreground">
                  {t(`home.collections.items.${item.key}`)}
                </h3>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
