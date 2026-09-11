import { useEffect } from 'react';

type ProductJsonLdProps = {
  name: string;
  description?: string;
  image?: string | string[];
  sku?: string;
  brand?: string;
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock';
  url?: string;
};

/** SECTION 14 — Product structured data for search engines */
export function ProductJsonLd({
  name,
  description,
  image,
  sku,
  brand = 'FIVE',
  price,
  currency = 'USD',
  availability = 'InStock',
  url,
}: ProductJsonLdProps) {
  useEffect(() => {
    const id = 'five-product-jsonld';
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const data: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name,
      description: description || undefined,
      sku: sku || undefined,
      brand: { '@type': 'Brand', name: brand },
      image: image || undefined,
    };

    if (typeof price === 'number' && Number.isFinite(price)) {
      data.offers = {
        '@type': 'Offer',
        priceCurrency: currency,
        price: price.toFixed(2),
        availability: `https://schema.org/${availability}`,
        url: url || (typeof window !== 'undefined' ? window.location.href : undefined),
      };
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      document.getElementById(id)?.remove();
    };
  }, [name, description, image, sku, brand, price, currency, availability, url]);

  return null;
}
