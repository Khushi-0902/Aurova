'use client'

import { useState } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import { 
  ChevronLeft, 
  ChevronRight, 
  Briefcase, 
  Calendar, 
  Bell, 
  MessageCircle,
  CalendarCheck,
  Check,
  Leaf,
  Drumstick,
  CigaretteOff,
  Cigarette,
  User,
  MapPin,
  Quote
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Room } from '@/lib/property-data'

interface RoomCardProps {
  room: Room
  index: number
}

export function RoomCard({ room, index }: RoomCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [notifyRequested, setNotifyRequested] = useState(false)
  const [showFullNote, setShowFullNote] = useState(false)

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? room.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === room.images.length - 1 ? 0 : prev + 1))
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi! I'm interested in ${room.name} at this property. Is it still available?`)
    window.open(`https://wa.me/919876543210?text=${message}`, '_blank')
  }

  const handleBookTour = () => {
    // This would open a calendar booking modal
    alert('Calendar booking feature coming soon!')
  }

  return (
    <Card 
      className={cn(
        'overflow-hidden transition-all duration-300 hover:shadow-xl group',
        index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse',
        'flex flex-col lg:flex-row'
      )}
    >
      {/* Image Carousel */}
      <div className="relative w-full lg:w-2/5 aspect-[4/3] lg:aspect-auto lg:min-h-[320px]">
        <Image
          src={room.images[currentImageIndex]}
          alt={`${room.name} - Image ${currentImageIndex + 1}`}
          fill
          className="object-cover"
        />
        
        {/* Image navigation */}
        {room.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              aria-label="Next image"
            >
              <ChevronRight className="size-4" />
            </button>
            
            {/* Image dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {room.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={cn(
                    'size-2 rounded-full transition-all',
                    idx === currentImageIndex 
                      ? 'bg-primary-foreground w-4' 
                      : 'bg-primary-foreground/50 hover:bg-primary-foreground/75'
                  )}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Status badge */}
        <Badge
          className={cn(
            'absolute top-3 left-3 border-0',
            room.isOccupied ? 'status-occupied' : 'status-available'
          )}
        >
          {room.isOccupied ? 'Occupied' : 'Available'}
        </Badge>
      </div>

      {/* Room Details */}
      <CardContent className="flex-1 p-6 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Room header */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-semibold">{room.name}</h3>
                <p className="text-sm text-muted-foreground">{room.type} - {room.size}</p>
              </div>
              {!room.isOccupied && room.rent && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    ₹{room.rent.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">per month</p>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {room.features.map((feature, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
              >
                <Check className="size-3 text-primary" />
                {feature}
              </span>
            ))}
          </div>

          {/* Tenant info or Rent details */}
          {room.isOccupied && room.tenant ? (
            <div className="space-y-4">
              {/* Tenant Quick Info */}
              <div className="p-4 rounded-xl bg-accent/50 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-accent-foreground">Current Flatmate</p>
                  <div className="flex items-center gap-2">
                    {/* Lifestyle badges */}
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                      room.tenant.diet === 'vegetarian' ? 'bg-green-100 text-green-700' : 
                      room.tenant.diet === 'vegan' ? 'bg-emerald-100 text-emerald-700' : 
                      'bg-orange-100 text-orange-700'
                    )}>
                      {room.tenant.diet === 'vegetarian' || room.tenant.diet === 'vegan' ? (
                        <Leaf className="size-3" />
                      ) : (
                        <Drumstick className="size-3" />
                      )}
                      {room.tenant.diet === 'vegetarian' ? 'Veg' : room.tenant.diet === 'vegan' ? 'Vegan' : 'Non-Veg'}
                    </span>
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                      room.tenant.smoker ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    )}>
                      {room.tenant.smoker ? (
                        <Cigarette className="size-3" />
                      ) : (
                        <CigaretteOff className="size-3" />
                      )}
                      {room.tenant.smoker ? 'Smoker' : 'Non-Smoker'}
                    </span>
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700"
                    )}>
                      <User className="size-3" />
                      {room.tenant.gender === 'male' ? 'Male' : room.tenant.gender === 'female' ? 'Female' : 'Other'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="size-4 text-primary" />
                    <span>{room.tenant.profession}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {room.tenant.company}
                    </span>
                  </div>
                  {room.tenant.hometown && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-4 text-primary" />
                      <span>From {room.tenant.hometown}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="size-4 text-primary" />
                    <span>Since {format(new Date(room.tenant.moveInDate), 'MMM yyyy')}</span>
                  </div>
                </div>
              </div>

              {/* Personal Note */}
              {room.tenant.personalNote && (
                <div className="relative p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/30 border border-primary/10">
                  <Quote className="absolute top-3 left-3 size-5 text-primary/30" />
                  <div className="pl-6">
                    <p className="text-sm font-medium text-primary mb-2">A note from your potential flatmate</p>
                    <p className={cn(
                      "text-sm text-muted-foreground leading-relaxed",
                      !showFullNote && "line-clamp-3"
                    )}>
                      {room.tenant.personalNote}
                    </p>
                    {room.tenant.personalNote.length > 150 && (
                      <button
                        onClick={() => setShowFullNote(!showFullNote)}
                        className="text-xs text-primary font-medium mt-2 hover:underline"
                      >
                        {showFullNote ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            room.deposit && (
              <div className="p-4 rounded-xl bg-accent/50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Security Deposit</span>
                  <span className="font-medium">₹{room.deposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Lock-in Period</span>
                  <span className="font-medium">None</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Move-in</span>
                  <span className="font-medium text-primary">Immediate</span>
                </div>
              </div>
            )
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {room.isOccupied ? (
            <Button
              variant={notifyRequested ? 'secondary' : 'default'}
              className="flex-1 gap-2"
              onClick={() => setNotifyRequested(true)}
              disabled={notifyRequested}
            >
              {notifyRequested ? (
                <>
                  <Check className="size-4" />
                  Notification Set
                </>
              ) : (
                <>
                  <Bell className="size-4" />
                  Notify When Available
                </>
              )}
            </Button>
          ) : (
            <>
              <Button className="flex-1 gap-2 gradient-primary text-primary-foreground" onClick={handleWhatsApp}>
                <MessageCircle className="size-4" />
                Book Now
              </Button>
              <Button variant="outline" className="flex-1 gap-2" onClick={handleBookTour}>
                <CalendarCheck className="size-4" />
                Schedule Tour
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
