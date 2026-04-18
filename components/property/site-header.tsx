'use client'

import Link from 'next/link'
import { Heart, Menu } from 'lucide-react'
import { useWishlist } from '@/components/wishlist/wishlist-provider'
import { Button } from '@/components/ui/button'
import { AuthNav } from '@/components/auth/auth-nav'
import { WHATSAPP_URL } from '@/lib/contact'

export function SiteHeader() {
  const { count, hydrated } = useWishlist()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2 group">
          <div className="size-9 rounded-xl gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-serif font-bold text-lg">A</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-serif text-xl font-bold tracking-tight">Aurova</span>
            <p className="text-[10px] text-muted-foreground -mt-1">Flexible living made easy</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/home#properties"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/home#home-search"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Locations
          </Link>
          <Link
            href="/home#about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/wishlist"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
          >
            <Heart className="size-3.5 shrink-0" aria-hidden />
            Saved homes
            {hydrated && count > 0 ? (
              <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-primary">
                {count}
              </span>
            ) : null}
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <AuthNav variant="property" />
          <Link
            href="/wishlist"
            className="relative inline-flex md:hidden size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label={count > 0 ? `Saved homes, ${count} properties` : 'Saved homes'}
          >
            <Heart className="size-5" aria-hidden />
            {hydrated && count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground">
                {count > 9 ? '9+' : count}
              </span>
            ) : null}
          </Link>
          <Button asChild className="gradient-primary text-primary-foreground">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Contact Us
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
