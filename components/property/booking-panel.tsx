'use client'

import { MessageCircle, CalendarCheck, Phone, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PHONE_TEL, WHATSAPP_URL } from '@/lib/contact'
import type { Property } from '@/lib/property-data'

interface BookingPanelProps {
  property: Property
}

export function BookingPanel({ property }: BookingPanelProps) {
  const availableRooms = property.rooms.filter((r) => !r.isOccupied)
  const lowestRent = availableRooms.length > 0
    ? Math.min(...availableRooms.map((r) => r.rent || 0))
    : null

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in ${property.name}. Can you share more details about available rooms?`
    )
    window.open(`${WHATSAPP_URL}?text=${message}`, '_blank')
  }

  const handleBookTour = () => {
    alert('Calendar booking feature coming soon!')
  }

  const handleCall = () => {
    window.open(PHONE_TEL, '_self')
  }

  return (
    <Card className="sticky top-6 border-0 shadow-xl overflow-hidden">
      {/* Premium header */}
      <div className="gradient-primary p-4 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Starting from</p>
            {lowestRent ? (
              <p className="text-3xl font-bold">
                ₹{lowestRent.toLocaleString()}
                <span className="text-base font-normal opacity-90">/month</span>
              </p>
            ) : (
              <p className="text-lg font-medium">No rooms available</p>
            )}
          </div>
          <div className="flex items-center gap-1 bg-background/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{property.rating}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Availability summary */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{property.totalRooms}</p>
            <p className="text-xs text-muted-foreground">Total Rooms</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-500">{property.occupiedRooms}</p>
            <p className="text-xs text-muted-foreground">Occupied</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-500">{availableRooms.length}</p>
            <p className="text-xs text-muted-foreground">Available</p>
          </div>
        </div>

        {/* Available rooms preview */}
        {availableRooms.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Available Now</p>
            {availableRooms.map((room) => (
              <div
                key={room.id}
                className="flex items-center justify-between p-3 rounded-xl bg-accent/50"
              >
                <div>
                  <p className="font-medium text-sm">{room.name}</p>
                  <p className="text-xs text-muted-foreground">{room.size}</p>
                </div>
                <p className="font-semibold text-primary">
                  ₹{room.rent?.toLocaleString()}/mo
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {availableRooms.length > 0 ? (
            <>
              <Button 
                className="w-full gap-2 h-12 text-base gradient-primary text-primary-foreground" 
                onClick={handleWhatsApp}
              >
                <MessageCircle className="size-5" />
                Book on WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="w-full gap-2 h-12"
                onClick={handleBookTour}
              >
                <CalendarCheck className="size-5" />
                Schedule a Visit
              </Button>
            </>
          ) : (
            <Button 
              variant="secondary" 
              className="w-full gap-2 h-12"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="size-5" />
              Join Waitlist
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            className="w-full gap-2"
            onClick={handleCall}
          >
            <Phone className="size-4" />
            Call Us
          </Button>
        </div>

        {/* Trust badges */}
        <div className="pt-4 border-t">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-green-500" />
              Verified Property
            </span>
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-primary" />
              Instant Response
            </span>
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-amber-500" />
              No Brokerage
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
