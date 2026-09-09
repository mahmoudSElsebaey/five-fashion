import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';

export function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero placeholder */}
      <section className="mb-20 flex flex-col items-center text-center">
        <Badge variant="accent" className="mb-6">
          2026 Collection
        </Badge>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {t('welcome')}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          {t('tagline')}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg">{t('nav.shop')}</Button>
          <Button variant="outline" size="lg">
            {t('nav.collections')}
          </Button>
        </div>
      </section>

      {/* Components showcase (temporary for Phase 4) */}
      <section className="space-y-10">
        <h2 className="font-display text-2xl font-semibold">UI Components Preview</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card hoverable>
            <CardHeader>
              <h3 className="font-medium">Primary Card</h3>
              <p className="text-sm text-muted-foreground">Hoverable product-style card</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="accent">Accent</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-medium">Buttons</h3>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button size="sm">Primary</Button>
              <Button variant="secondary" size="sm">Secondary</Button>
              <Button variant="outline" size="sm">Outline</Button>
              <Button variant="accent" size="sm">Accent</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-medium">Loading</h3>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
              <Button isLoading size="sm">Loading</Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
