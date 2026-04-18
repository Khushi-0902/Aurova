import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/property/site-header'
import { SiteFooter } from '@/components/property/site-footer'
import { ImageGallery } from '@/components/property/image-gallery'
import { PropertyHeader } from '@/components/property/property-header'
import { RoomCard } from '@/components/property/room-card'
import { SharedCostsSection } from '@/components/property/shared-costs-section'
import { AmenitiesSection } from '@/components/property/amenities-section'
import { ReviewsSection } from '@/components/property/reviews-section'
import { NearbyProperties } from '@/components/property/nearby-properties'
import { BookingPanel } from '@/components/property/booking-panel'
import { MobileCTA } from '@/components/property/mobile-cta'
import { allProperties, getPropertyBySlug } from '@/lib/property-data'

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return allProperties.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const property = getPropertyBySlug(slug)
  if (!property) {
    return { title: 'Property | Aurova' }
  }
  return {
    title: `${property.name} | Aurova`,
    description: `${property.tagline} — ${property.type} in ${property.city}. ${property.totalRooms} rooms, flexible co-living.`,
  }
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params
  const property = getPropertyBySlug(slug)
  if (!property) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="container mx-auto px-4 pt-6 pb-8">
          <ImageGallery images={property.images} propertyName={property.name} />
        </section>

        <div className="container mx-auto px-4 pb-24 lg:pb-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            <div className="space-y-16">
              <PropertyHeader property={property} />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
                <div className="relative flex justify-center">
                  <div className="size-2 rounded-full bg-primary/30" />
                </div>
              </div>

              <section className="space-y-8">
                <div>
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">Your Future Space</span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold mt-2">Find Your Perfect Room</h2>
                  <p className="text-muted-foreground mt-2 max-w-2xl">
                    Each room at {property.name} has been crafted with care - from the natural light that fills the
                    space to the thoughtful storage solutions. Pick one that matches your vibe and make it truly yours.
                  </p>
                </div>
                <div className="space-y-6">
                  {property.rooms.map((room, index) => (
                    <RoomCard key={room.id} room={room} index={index} />
                  ))}
                </div>
              </section>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
                <div className="relative flex justify-center">
                  <div className="size-2 rounded-full bg-primary/30" />
                </div>
              </div>

              <SharedCostsSection sharedCosts={property.sharedCosts} occupiedRooms={property.occupiedRooms} />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
                <div className="relative flex justify-center">
                  <div className="size-2 rounded-full bg-primary/30" />
                </div>
              </div>

              <AmenitiesSection amenities={property.amenities} nearbyPlaces={property.nearbyPlaces} />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
                <div className="relative flex justify-center">
                  <div className="size-2 rounded-full bg-primary/30" />
                </div>
              </div>

              <section id="reviews" className="scroll-mt-24">
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Testimonials</span>
                <div className="mt-2">
                  <ReviewsSection
                    reviews={property.reviews}
                    rating={property.rating}
                    reviewCount={property.reviewCount}
                  />
                </div>
              </section>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
                <div className="relative flex justify-center">
                  <div className="size-2 rounded-full bg-primary/30" />
                </div>
              </div>

              <NearbyProperties properties={property.nearbyProperties} currentProperty={property} />
            </div>

            <aside className="hidden lg:block">
              <BookingPanel property={property} />
            </aside>
          </div>
        </div>

        <MobileCTA property={property} />
      </main>

      <SiteFooter />
    </div>
  )
}
