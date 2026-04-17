'use client'

import { 
  Wifi, 
  Thermometer, 
  Shirt, 
  UtensilsCrossed, 
  Tv, 
  Dumbbell, 
  Sun, 
  Briefcase, 
  Shield, 
  Camera, 
  Flame, 
  Zap,
  Coffee,
  Utensils,
  TreeDeciduous,
  TrainFront,
  ShoppingBag,
  Building2,
  Star
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Amenity, NearbyPlace } from '@/lib/property-data'

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  thermometer: Thermometer,
  shirt: Shirt,
  utensils: UtensilsCrossed,
  tv: Tv,
  dumbbell: Dumbbell,
  sun: Sun,
  briefcase: Briefcase,
  shield: Shield,
  camera: Camera,
  flame: Flame,
  zap: Zap,
}

const placeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  cafe: Coffee,
  restaurant: Utensils,
  gym: Dumbbell,
  park: TreeDeciduous,
  metro: TrainFront,
  mall: ShoppingBag,
  coworking: Building2,
}

interface AmenitiesSectionProps {
  amenities: Amenity[]
  nearbyPlaces: NearbyPlace[]
}

export function AmenitiesSection({ amenities, nearbyPlaces }: AmenitiesSectionProps) {
  const groupedAmenities = {
    essential: amenities.filter((a) => a.category === 'essential'),
    lifestyle: amenities.filter((a) => a.category === 'lifestyle'),
    safety: amenities.filter((a) => a.category === 'safety'),
  }

  return (
    <div className="space-y-12">
      {/* Amenities */}
      <div className="space-y-8">
        <div>
          <h2 className="font-serif text-2xl font-bold">Premium Amenities</h2>
          <p className="text-muted-foreground mt-1">Everything you need for comfortable living</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Essential */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Essentials
            </h3>
            <div className="space-y-3">
              {groupedAmenities.essential.map((amenity) => {
                const Icon = amenityIcons[amenity.icon] || Zap
                return (
                  <div
                    key={amenity.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card border hover:border-primary/30 hover:shadow-sm transition-all"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <span className="font-medium">{amenity.name}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Lifestyle */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Lifestyle
            </h3>
            <div className="space-y-3">
              {groupedAmenities.lifestyle.map((amenity) => {
                const Icon = amenityIcons[amenity.icon] || Zap
                return (
                  <div
                    key={amenity.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card border hover:border-primary/30 hover:shadow-sm transition-all"
                  >
                    <div className="p-2 rounded-lg bg-accent">
                      <Icon className="size-5 text-accent-foreground" />
                    </div>
                    <span className="font-medium">{amenity.name}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Safety */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Safety & Security
            </h3>
            <div className="space-y-3">
              {groupedAmenities.safety.map((amenity) => {
                const Icon = amenityIcons[amenity.icon] || Shield
                return (
                  <div
                    key={amenity.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card border hover:border-primary/30 hover:shadow-sm transition-all"
                  >
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <Icon className="size-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-medium">{amenity.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Places */}
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl font-bold">Nearby Hotspots</h2>
          <p className="text-muted-foreground mt-1">Explore the vibrant neighborhood</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {nearbyPlaces.map((place) => {
            const Icon = placeIcons[place.type] || Building2
            return (
              <Card
                key={place.id}
                className={cn(
                  'group hover:shadow-lg transition-all cursor-pointer border-0',
                  'bg-gradient-to-br from-card to-accent/30'
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-background shadow-sm group-hover:shadow-md transition-shadow">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                        {place.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground capitalize">
                          {place.type}
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-sm font-medium text-primary">
                          {place.distance}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{place.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
