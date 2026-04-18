'use client'

import { MessageCircle } from 'lucide-react'
import { WHATSAPP_URL } from '@/lib/contact'
import type { Property } from '@/lib/property-data'

interface MobileCTAProps {
  property: Property
}

export function MobileCTA({ property }: MobileCTAProps) {
  const availableRooms = property.rooms.filter((r) => !r.isOccupied && r.rent)
  const lowestRent = availableRooms.length > 0
    ? Math.min(...availableRooms.map((r) => r.rent!))
    : null

  const handleBookNow = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in ${property.name}. Can you share more details?`
    )
    window.open(`${WHATSAPP_URL}?text=${message}`, '_blank')
  }

  if (!lowestRent) return null

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-lg border-t z-30">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">From</p>
          <p className="text-xl font-bold">
            ₹{lowestRent.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground">/mo</span>
          </p>
        </div>
        <button
          onClick={handleBookNow}
          className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-medium"
        >
          <MessageCircle className="size-4" />
          Book Now
        </button>
      </div>
    </div>
  )
}
