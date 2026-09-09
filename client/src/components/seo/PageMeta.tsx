import { useEffect } from 'react';

interface PageMetaProps {
  title?: string;
  description?: string;
  path?: string;
}

const SITE = 'FIVE Fashion';
const DEFAULT_DESC =
  'FIVE Fashion — Luxury 3D fashion e-commerce. Discover refined collections with immersive digital experiences.';

export function PageMeta({ title, description = DEFAULT_DESC, path = '' }: PageMetaProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE}` : SITE;
    document.title = fullTitle;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', description);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:type', 'website', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = `${window.location.origin}${path || window.location.pathname}`;
  }, [title, description, path]);

  return null;
}
