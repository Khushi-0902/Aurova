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
import { sampleProperty } from '@/lib/property-data'

export default function PropertyPage() {
  const property = sampleProperty
  console.log("[v0] Total rooms in property:", property.rooms.length, property.rooms.map(r => r.name))

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Gallery */}
        <section className="container mx-auto px-4 pt-6 pb-8">
          <ImageGallery images={property.images} propertyName={property.name} />
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 pb-24 lg:pb-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            {/* Left Column - Main Content */}
            <div className="space-y-16">
              {/* Property Header */}
              <PropertyHeader property={property} />

              {/* Decorative Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
                <div className="relative flex justify-center">
                  <div className="size-2 rounded-full bg-primary/30" />
                </div>
              </div>

              {/* Rooms Section */}
              <section className="space-y-8">
                <div>
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">Your Future Space</span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold mt-2">Find Your Perfect Room</h2>
                  <p className="text-muted-foreground mt-2 max-w-2xl">
                    Each room at {property.name} has been crafted with care - from the natural light that fills the space 
                    to the thoughtful storage solutions. Pick one that matches your vibe and make it truly yours.
                  </p>
                </div>
                <div className="space-y-6">
                  {property.rooms.map((room, index) => (
                    <RoomCard key={room.id} room={room} index={index} />
                  ))}
                </div>
              </section>

              {/* Decorative Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
                <div className="relative flex justify-center">
                  <div className="size-2 rounded-full bg-primary/30" />
                </div>
              </div>

              {/* Shared Costs Section */}
              <SharedCostsSection 
                sharedCosts={property.sharedCosts} 
                occupiedRooms={property.occupiedRooms}
              />

              {/* Decorative Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
                <div className="relative flex justify-center">
                  <div className="size-2 rounded-full bg-primary/30" />
                </div>
              </div>

              {/* Amenities & Nearby */}
              <AmenitiesSection
                amenities={property.amenities}
                nearbyPlaces={property.nearbyPlaces}
              />

              {/* Decorative Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
                <div className="relative flex justify-center">
                  <div className="size-2 rounded-full bg-primary/30" />
                </div>
              </div>

              {/* Reviews */}
              <section>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Testimonials</span>
                <div className="mt-2">
                  <ReviewsSection
                    reviews={property.reviews}
                    rating={property.rating}
                    reviewCount={property.reviewCount}
                  />
                </div>
              </section>

              {/* Decorative Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
                <div className="relative flex justify-center">
                  <div className="size-2 rounded-full bg-primary/30" />
                </div>
              </div>

              {/* Nearby Properties */}
              <NearbyProperties
                properties={property.nearbyProperties}
                currentProperty={property}
              />
            </div>

            {/* Right Column - Booking Panel */}
            <aside className="hidden lg:block">
              <BookingPanel property={property} />
            </aside>
          </div>
        </div>

        {/* Mobile Sticky CTA */}
        <MobileCTA property={property} />
      </main>

      <SiteFooter />
    </div>
  )
}
