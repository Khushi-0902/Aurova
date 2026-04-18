import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { SiteHeader } from '@/components/property/site-header'
import { SiteFooter } from '@/components/property/site-footer'
import { WishlistView } from '@/components/wishlist/wishlist-view'
import { Button } from '@/components/ui/button'

export default function WishlistPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" size="sm" className="mb-6 -ml-2 gap-1 text-muted-foreground" asChild>
            <Link href="/home">
              <ChevronLeft className="size-4" />
              Back to home
            </Link>
          </Button>
          <WishlistView />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
