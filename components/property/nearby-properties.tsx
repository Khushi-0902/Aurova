'use client'

import Image from 'next/image'
import { Star, MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { NearbyProperty, Property } from '@/lib/property-data'

interface NearbyPropertiesProps {
  properties: NearbyProperty[]
  currentProperty: Property
}

export function NearbyProperties({ properties, currentProperty }: NearbyPropertiesProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold">More Aurova Properties</h2>
          <p className="text-muted-foreground mt-1">Explore other premium living spaces nearby</p>
        </div>
        <Button variant="outline" className="gap-2 self-start md:self-auto">
          View All Properties
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Map placeholder */}
        <Card className="md:col-span-2 lg:col-span-1 lg:row-span-2 overflow-hidden border-0 bg-gradient-to-br from-accent to-primary/5">
          <CardContent className="p-0 h-full min-h-[300px] relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4 p-6">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <MapPin className="size-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Interactive Map</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    View all {properties.length + 1} Aurova properties in {currentProperty.city}
                  </p>
                </div>
                <Button size="sm" className="gap-2">
                  Open Map View
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 size-3 rounded-full bg-primary animate-pulse" />
            <div className="absolute top-1/3 right-1/4 size-2 rounded-full bg-primary/60" />
            <div className="absolute bottom-1/4 left-1/3 size-2 rounded-full bg-primary/60" />
            <div className="absolute bottom-8 right-8 size-3 rounded-full bg-primary/40" />
          </CardContent>
        </Card>

        {/* Property cards */}
        {properties.map((property) => (
          <Card
            key={property.id}
            className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-0"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={property.image}
                alt={property.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
              
              {/* Price badge */}
              <div className="absolute top-3 right-3">
                <span className="bg-background/90 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full text-sm font-semibold">
                  From ₹{property.price.toLocaleString()}/mo
                </span>
              </div>

              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground">
                <h3 className="font-serif text-lg font-semibold">{property.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="size-3.5" />
                    <span className="opacity-90">{property.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{property.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-4">
              <Button variant="ghost" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                View Property
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
