'use client'

import Link from 'next/link'
import { Heart, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { allProperties } from '@/lib/property-data'
import { useWishlist } from '@/components/wishlist/wishlist-provider'

export function WishlistView() {
  const { slugs, removeWishlist, hydrated } = useWishlist()

  const saved = hydrated
    ? slugs
        .map((slug) => allProperties.find((p) => p.slug === slug))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
    : []

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center text-muted-foreground text-sm">Loading your saved homes…</div>
    )
  }

  if (saved.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center space-y-6">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-muted">
          <Heart className="size-8 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold">No saved homes yet</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Tap the heart on a property you like.{' '}
            <Link href="/auth/signin" className="font-medium text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>{' '}
            to sync your saved homes to your account on this browser.
          </p>
        </div>
        <Button asChild className="gradient-primary text-primary-foreground">
          <Link href="/home#properties">Browse homes</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">Saved homes</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          {saved.length === 1 ? '1 property' : `${saved.length} properties`} on this device
        </p>
      </div>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {saved.map((property) => {
          const hero = property.images.find((i) => i.section === 'hero') ?? property.images[0]
          return (
            <li key={property.slug}>
              <Card className="overflow-hidden border-0 shadow-md transition-shadow hover:shadow-lg">
                <Link href={`/${property.slug}`} className="block relative aspect-[16/10] bg-muted overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {hero ? (
                    <img
                      src={hero.url}
                      alt={hero.alt || property.name}
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : null}
                </Link>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <Link href={`/${property.slug}`}>
                      <h2 className="font-serif text-lg font-semibold hover:text-primary transition-colors">
                        {property.name}
                      </h2>
                    </Link>
                    <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0 mt-0.5" aria-hidden />
                      {property.address}, {property.city}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/${property.slug}`}>View listing</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeWishlist(property.slug)}
                      aria-label={`Remove ${property.name} from saved homes`}
                    >
                      <Heart className="size-4 fill-current" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
