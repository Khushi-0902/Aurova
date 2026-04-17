'use client'

import Image from 'next/image'
import { format } from 'date-fns'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Review } from '@/lib/property-data'

interface ReviewsSectionProps {
  reviews: Review[]
  rating: number
  reviewCount: number
}

export function ReviewsSection({ reviews, rating, reviewCount }: ReviewsSectionProps) {
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage: (reviews.filter((r) => r.rating === stars).length / reviews.length) * 100,
  }))

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h2 className="font-serif text-2xl font-bold">Guest Reviews</h2>
          <p className="text-muted-foreground mt-1">See what our residents are saying</p>
        </div>

        {/* Rating summary card */}
        <Card className="border-0 bg-gradient-to-br from-primary/5 to-accent">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              {/* Main rating */}
              <div className="text-center">
                <div className="text-5xl font-bold gradient-text">{rating}</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'size-4',
                        i < Math.floor(rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-muted text-muted'
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{reviewCount} reviews</p>
              </div>

              {/* Rating distribution */}
              <div className="space-y-1.5 min-w-[140px]">
                {ratingDistribution.map(({ stars, percentage }) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-3">{stars}</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {reviews.map((review, index) => (
          <Card
            key={review.id}
            className={cn(
              'group hover:shadow-lg transition-all duration-300 border-0',
              index === 0 && 'md:col-span-2 bg-gradient-to-br from-card to-accent/20'
            )}
          >
            <CardContent className="p-6">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 rounded-full overflow-hidden ring-2 ring-primary/10">
                      <Image
                        src={review.avatar}
                        alt={review.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{review.author}</h4>
                      <p className="text-sm text-muted-foreground">
                        Stayed for {review.stayDuration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'size-4',
                          i < review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-muted text-muted'
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <div className="relative mt-4 flex-1">
                  <Quote className="absolute -top-1 -left-1 size-6 text-primary/20" />
                  <p className="text-muted-foreground leading-relaxed pl-4">
                    {review.comment}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <time className="text-sm text-muted-foreground">
                    {format(new Date(review.date), 'MMMM d, yyyy')}
                  </time>
                  <span className="text-xs bg-secondary px-2 py-1 rounded-full text-secondary-foreground">
                    Verified Resident
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
