import { Seo } from '@/components/seo/Seo';
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';
import { NewArrivals } from '@/components/home/NewArrivals';
import { EditorialSection } from '@/components/home/EditorialSection';
import { OffersSection } from '@/components/home/OffersSection';
import { BrandsStrip } from '@/components/home/BrandsStrip';
import { PromoBanner } from '@/components/home/PromoBanner';
import { Reveal } from '@/components/motion/Reveal';

export function HomePage() {
  return (
    <>
      <Seo
        title="Luxury Fashion"
        description="FIVE Fashion — luxury 3D fashion e-commerce. Refined collections, immersive experience."
      />
      <OrganizationJsonLd />
      <HeroSection />
      <Reveal>
        <FeaturedCarousel />
      </Reveal>
      <Reveal delay={0.05}>
        <PromoBanner variant="featured" />
      </Reveal>
      <Reveal delay={0.05}>
        <FeaturedCollections />
      </Reveal>
      <Reveal>
        <NewArrivals />
      </Reveal>
      <Reveal delay={0.05}>
        <PromoBanner variant="arrivals" />
      </Reveal>
      <Reveal delay={0.05}>
        <EditorialSection />
      </Reveal>
      <Reveal>
        <OffersSection />
      </Reveal>
      <Reveal delay={0.05}>
        <BrandsStrip />
      </Reveal>
    </>
  );
}
