import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const products = [
  { id: '1', nameKey: 'silkBlazer', price: 890, tag: 'new' },
  { id: '2', nameKey: 'structuredCoat', price: 1240, tag: 'new' },
  { id: '3', nameKey: 'fluidDress', price: 720, tag: 'sale', oldPrice: 980 },
  { id: '4', nameKey: 'tailoredTrousers', price: 480, tag: null },
];

export function NewArrivals() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium tracking-widest text-accent uppercase">
            {t('home.arrivals.label')}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('home.arrivals.title')}
          </h2>
        </div>
        <Link
          to="/shop?sort=newest"
          className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
        >
          {t('home.arrivals.viewAll')} →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`}>
            <Card hoverable className="overflow-hidden border-0 bg-transparent shadow-none">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                <div className="absolute inset-0 bg-gradient-to-br from-surface via-muted to-accent/10" />
                {product.tag && (
                  <div className="absolute top-3 start-3">
                    <Badge variant={product.tag === 'sale' ? 'error' : 'accent'}>
                      {product.tag === 'sale' ? t('home.arrivals.sale') : t('home.arrivals.new')}
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="mt-4 space-y-1 px-0">
                <h3 className="font-medium text-foreground">
                  {t(`home.arrivals.products.${product.nameKey}`)}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">${product.price}</span>
                  {product.oldPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.oldPrice}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center sm:hidden">
        <Button variant="outline">{t('home.arrivals.viewAll')}</Button>
      </div>
    </section>
  );
}
