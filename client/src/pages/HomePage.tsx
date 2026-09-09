import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { NewArrivals } from '@/components/home/NewArrivals';
import { EditorialSection } from '@/components/home/EditorialSection';
import { OffersSection } from '@/components/home/OffersSection';
import { Reveal } from '@/components/motion/Reveal';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <Reveal>
        <FeaturedCollections />
      </Reveal>
      <Reveal delay={0.05}>
        <NewArrivals />
      </Reveal>
      <Reveal>
        <EditorialSection />
      </Reveal>
      <Reveal delay={0.05}>
        <OffersSection />
      </Reveal>
    </>
  );
}
