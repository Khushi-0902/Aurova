'use client'

import { useState } from 'react'
import { 
  Sparkles, 
  ChefHat, 
  Wifi, 
  Zap, 
  Droplets,
  Users,
  Info,
  Calculator
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { SharedCost } from '@/lib/property-data'

interface SharedCostsSectionProps {
  sharedCosts: SharedCost[]
  occupiedRooms: number
}

const costIcons: Record<string, React.ElementType> = {
  'Maid Service': Sparkles,
  'Cook': ChefHat,
  'WiFi': Wifi,
  'Electricity': Zap,
  'Water & Maintenance': Droplets,
}

export function SharedCostsSection({ sharedCosts, occupiedRooms }: SharedCostsSectionProps) {
  const [hoveredCost, setHoveredCost] = useState<string | null>(null)

  const totalSharedCosts = sharedCosts.reduce((acc, cost) => {
    if (cost.perPerson) {
      return acc + cost.monthlyCost
    }
    return acc + Math.round(cost.monthlyCost / (occupiedRooms + 1))
  }, 0)

  return (
    <section className="space-y-8">
      <div>
        <span className="text-sm font-medium text-primary uppercase tracking-wider">Living Expenses</span>
        <h2 className="font-serif text-2xl md:text-3xl font-bold mt-2">Shared Costs Breakdown</h2>
        <p className="text-muted-foreground mt-2">
          Transparent pricing with no hidden fees. Here&apos;s what you&apos;ll share with your flatmates.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sharedCosts.map((cost) => {
          const IconComponent = costIcons[cost.name] || Info
          const displayCost = cost.perPerson 
            ? cost.monthlyCost 
            : Math.round(cost.monthlyCost / (occupiedRooms + 1))
          
          return (
            <Card 
              key={cost.id}
              className={cn(
                'transition-all duration-300 cursor-default',
                hoveredCost === cost.id ? 'shadow-lg border-primary/30 scale-[1.02]' : ''
              )}
              onMouseEnter={() => setHoveredCost(cost.id)}
              onMouseLeave={() => setHoveredCost(null)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className={cn(
                    'size-12 rounded-xl flex items-center justify-center transition-colors',
                    hoveredCost === cost.id ? 'gradient-primary' : 'bg-primary/10'
                  )}>
                    <IconComponent className={cn(
                      'size-6 transition-colors',
                      hoveredCost === cost.id ? 'text-primary-foreground' : 'text-primary'
                    )} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">
                      ₹{displayCost.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <h3 className="font-semibold text-lg mb-1">{cost.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cost.description}</p>
                {!cost.perPerson && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="size-3" />
                    <span>Split equally among flatmates</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Total Estimate */}
      <Card className="overflow-hidden">
        <div className="gradient-primary p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                <Calculator className="size-7 text-primary-foreground" />
              </div>
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Estimated Monthly Shared Costs</p>
                <p className="text-3xl font-bold text-primary-foreground">
                  ₹{totalSharedCosts.toLocaleString()}
                  <span className="text-lg font-normal text-primary-foreground/70">/month</span>
                </p>
              </div>
            </div>
            <div className="text-primary-foreground/80 text-sm md:text-right">
              <p>This is in addition to your room rent.</p>
              <p className="text-primary-foreground font-medium">No hidden charges. What you see is what you pay.</p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
