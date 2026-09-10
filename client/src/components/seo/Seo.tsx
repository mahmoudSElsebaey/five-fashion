import { useEffect } from 'react';

export type SeoProps = {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  noindex?: boolean;
};

const SITE = 'FIVE Fashion';
const DEFAULT_DESC =
  'FIVE Fashion — Luxury fashion e-commerce. Discover refined collections with immersive digital experiences.';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/** Lightweight SEO head manager for Vite/React SPA. */
export function Seo({
  title,
  description = DEFAULT_DESC,
  canonical,
  image = '/logo.png',
  type = 'website',
  noindex = false,
}: SeoProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE}` : SITE;
    document.title = fullTitle;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    upsertMeta('property', 'og:site_name', SITE);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:image', image);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);

    if (canonical) {
      upsertLink('canonical', canonical);
      upsertMeta('property', 'og:url', canonical);
    }
  }, [title, description, canonical, image, type, noindex]);

  return null;
}
