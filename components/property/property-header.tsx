'use client'

import { usePathname } from 'next/navigation'
import {
  Star,
  MapPin,
  Home,
  Users,
  Share2,
  Heart,
  Link2,
  MessageCircle,
  Mail,
  MessagesSquare,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useWishlist } from '@/components/wishlist/wishlist-provider'
import { cn } from '@/lib/utils'
import type { Property } from '@/lib/property-data'

interface PropertyHeaderProps {
  property: Property
}

export function PropertyHeader({ property }: PropertyHeaderProps) {
  const pathname = usePathname()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const saved = isWishlisted(property.slug)
  const availableRooms = property.totalRooms - property.occupiedRooms

  const getPageUrl = () =>
    typeof window !== 'undefined' ? `${window.location.origin}${pathname}` : ''

  const getShareText = () => {
    const url = getPageUrl()
    return url ? `Check out ${property.name} on Aurova:\n${url}` : `Check out ${property.name} on Aurova`
  }

  const handleCopyLink = async () => {
    const url = getPageUrl()
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard')
    } catch {
      toast.error('Could not copy — try again or copy from the address bar')
    }
  }

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(getShareText())
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  const handleShareEmail = () => {
    const url = getPageUrl()
    const subject = encodeURIComponent(`Check out ${property.name}`)
    const body = encodeURIComponent(getShareText())
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const handleShareMessages = () => {
    const body = encodeURIComponent(getShareText())
    window.location.href = `sms:&body=${body}`
  }

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
          
          <a
            href="#reviews"
            className="flex items-center gap-2 rounded-md -mx-1 px-1 py-0.5 text-inherit transition-colors hover:bg-accent/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`${property.rating} out of 5, ${property.reviewCount} reviews — jump to guest reviews`}
          >
            <span className="flex items-center gap-1 text-amber-500">
              <Star className="size-4 fill-current" aria-hidden />
              <span className="font-semibold text-foreground">{property.rating}</span>
            </span>
            <span className="text-muted-foreground">({property.reviewCount} reviews)</span>
          </a>

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="lg" className="gap-2 flex-1 lg:flex-none">
              <Share2 className="size-4" />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Share this listing</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleCopyLink}>
              <Link2 className="size-4" />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleShareWhatsApp}>
              <MessageCircle className="size-4" />
              WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleShareEmail}>
              <Mail className="size-4" />
              Email
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleShareMessages}>
              <MessagesSquare className="size-4" />
              Messages
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn(
            'group gap-2 flex-1 lg:flex-none',
            saved && 'border-red-200/80 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20',
          )}
          onClick={() => toggleWishlist(property.slug)}
          aria-pressed={saved}
          aria-label={saved ? 'Remove from saved homes' : 'Save to your homes'}
        >
          <Heart
            className={cn(
              'size-4 transition-colors',
              saved ? 'fill-red-500 text-red-500' : 'text-muted-foreground group-hover:fill-red-500 group-hover:text-red-500',
            )}
          />
          {saved ? 'Saved' : 'Save'}
        </Button>
      </div>
    </div>
  )
}
