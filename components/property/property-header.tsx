'use client'

import { Star, MapPin, Home, Users, Share2, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Property } from '@/lib/property-data'

interface PropertyHeaderProps {
  property: Property
}

export function PropertyHeader({ property }: PropertyHeaderProps) {
  const availableRooms = property.totalRooms - property.occupiedRooms

  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
      <div className="space-y-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-0 px-3 py-1">
            {property.type}
          </Badge>
          <Badge variant="secondary" className="bg-accent text-accent-foreground border-0 px-3 py-1">
            {property.area} sq ft
          </Badge>
          {availableRooms > 0 && (
            <Badge className="status-available border-0 px-3 py-1">
              {availableRooms} room{availableRooms > 1 ? 's' : ''} available
            </Badge>
          )}
        </div>

        {/* Title */}
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-balance">
            {property.name}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground italic">
            {property.tagline}
          </p>
        </div>

        {/* Location & Stats */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4 text-primary" />
            <span>{property.address}, {property.city}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="size-4 fill-current" />
              <span className="font-semibold text-foreground">{property.rating}</span>
            </div>
            <span className="text-muted-foreground">({property.reviewCount} reviews)</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Home className="size-4 text-primary" />
            <span>{property.totalRooms} rooms</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="size-4 text-primary" />
            <span>{property.occupiedRooms} occupied</span>
          </div>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2 pt-2">
          {property.highlights.map((highlight, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <span className="size-1.5 rounded-full bg-primary" />
              {highlight}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 lg:flex-col">
        <Button variant="outline" size="lg" className="gap-2 flex-1 lg:flex-none">
          <Share2 className="size-4" />
          Share
        </Button>
        <Button variant="outline" size="lg" className="gap-2 flex-1 lg:flex-none group">
          <Heart className="size-4 group-hover:fill-red-500 group-hover:text-red-500 transition-colors" />
          Save
        </Button>
      </div>
    </div>
  )
}
