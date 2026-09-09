import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { NewArrivals } from '@/components/home/NewArrivals';
import { EditorialSection } from '@/components/home/EditorialSection';
import { OffersSection } from '@/components/home/OffersSection';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCollections />
      <NewArrivals />
      <EditorialSection />
      <OffersSection />
    </>
  );
}
