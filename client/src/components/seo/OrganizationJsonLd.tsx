import { useEffect } from 'react';

type OrganizationJsonLdProps = {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
};

/** SECTION 15 — Site-level Organization structured data */
export function OrganizationJsonLd({
  name = 'FIVE Fashion',
  url,
  logo = '/logo.png',
  description = 'Luxury fashion e-commerce with immersive digital experiences.',
}: OrganizationJsonLdProps) {
  useEffect(() => {
    const id = 'five-organization-jsonld';
    document.getElementById(id)?.remove();

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name,
      url: url || origin || undefined,
      logo: logo.startsWith('http') ? logo : `${origin}${logo}`,
      description,
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      document.getElementById(id)?.remove();
    };
  }, [name, url, logo, description]);

  return null;
}
